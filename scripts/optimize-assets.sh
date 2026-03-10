#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

require_tool() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Missing required tool: $1"
        exit 1
    fi
}

require_tool pngquant
require_tool ffmpeg
require_tool sips

echo "Starting asset optimization..."

png_before=$(find images -type f -name '*.png' -exec stat -f%z {} \; | awk '{s+=$1} END {print s+0}')
jpg_before=$(find images -type f \( -name '*.jpg' -o -name '*.jpeg' \) -exec stat -f%z {} \; | awk '{s+=$1} END {print s+0}')
video_before=$(find videos -type f -name '*.mp4' ! -name '*.original.mp4' -exec stat -f%z {} \; | awk '{s+=$1} END {print s+0}')

echo "Optimizing PNG files..."
png_count=0
while IFS= read -r -d '' file; do
    png_count=$((png_count + 1))
    pngquant --quality=65-85 --speed 1 --skip-if-larger --force --ext .png "$file" >/dev/null 2>&1 || true
done < <(find images -type f -name '*.png' -print0)
echo "Processed PNG files: $png_count"

echo "Optimizing JPG/JPEG files..."
jpg_count=0
while IFS= read -r -d '' file; do
    jpg_count=$((jpg_count + 1))
    before_size=$(stat -f%z "$file")
    tmp_file="$(mktemp /tmp/jpgopt.XXXXXX.jpg)"
    sips -s format jpeg -s formatOptions 82 "$file" --out "$tmp_file" >/dev/null 2>&1
    after_size=$(stat -f%z "$tmp_file")
    if [ "$after_size" -lt "$before_size" ]; then
        mv "$tmp_file" "$file"
    else
        rm -f "$tmp_file"
    fi
done < <(find images -type f \( -name '*.jpg' -o -name '*.jpeg' \) -print0)
echo "Processed JPG/JPEG files: $jpg_count"

echo "Optimizing MP4 files..."
video_count=0
while IFS= read -r -d '' video_file; do
    video_count=$((video_count + 1))
    base_no_ext="${video_file%.mp4}"
    backup_file="${base_no_ext}.original.mp4"
    temp_file="${base_no_ext}.tmp-optimized.mp4"

    if [ -f "$backup_file" ]; then
        source_file="$backup_file"
    else
        cp "$video_file" "$backup_file"
        source_file="$video_file"
    fi

    ffmpeg -y -i "$source_file" \
        -map 0:v:0 \
        -vf "scale='if(gt(iw,ih),min(iw,1280),-2)':'if(gt(iw,ih),-2,min(ih,1280))':flags=lanczos" \
        -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
        -movflags +faststart -an \
        "$temp_file" >/dev/null 2>&1

    current_size=$(stat -f%z "$video_file")
    new_size=$(stat -f%z "$temp_file")
    if [ "$new_size" -lt "$current_size" ]; then
        mv "$temp_file" "$video_file"
    else
        rm -f "$temp_file"
    fi
done < <(find videos -type f -name '*.mp4' ! -name '*.original.mp4' -print0)
echo "Processed MP4 files: $video_count"

png_after=$(find images -type f -name '*.png' -exec stat -f%z {} \; | awk '{s+=$1} END {print s+0}')
jpg_after=$(find images -type f \( -name '*.jpg' -o -name '*.jpeg' \) -exec stat -f%z {} \; | awk '{s+=$1} END {print s+0}')
video_after=$(find videos -type f -name '*.mp4' ! -name '*.original.mp4' -exec stat -f%z {} \; | awk '{s+=$1} END {print s+0}')

echo "Optimization summary:"
awk -v b="$png_before" -v a="$png_after" 'BEGIN {printf "  PNG saved: %.2f MB (%.2f%%)\n", (b-a)/1024/1024, (b>0?((b-a)/b*100):0)}'
awk -v b="$jpg_before" -v a="$jpg_after" 'BEGIN {printf "  JPG saved: %.2f MB (%.2f%%)\n", (b-a)/1024/1024, (b>0?((b-a)/b*100):0)}'
awk -v b="$video_before" -v a="$video_after" 'BEGIN {printf "  MP4 saved: %.2f MB (%.2f%%)\n", (b-a)/1024/1024, (b>0?((b-a)/b*100):0)}'

echo "Done."
