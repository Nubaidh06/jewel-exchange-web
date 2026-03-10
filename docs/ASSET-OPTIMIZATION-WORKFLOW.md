# Asset Optimization Workflow (Photos + Videos)

Use this workflow whenever you add new visuals before launch or updates.

## 1) One-time setup

Install required tools (already done on this machine):

```bash
brew install ffmpeg webp pngquant
```

## 2) Recommended process for new photos

1. Add originals to `images/`.
2. Run PNG compression with `pngquant` (keeps transparency, skips larger outputs).
3. Run JPEG recompression with `sips` at quality ~82.
4. Spot-check key pages (`index.html`, `jewelry.html`, `gemstones.html`, `about.html`).

## 3) Recommended process for new videos

1. Keep a master source copy (high quality) outside the website path.
2. Store web video in `videos/`.
3. Re-encode with `ffmpeg`:
   - H.264 MP4
   - `-movflags +faststart`
   - no audio for silent hero loops (`-an`)
   - cap longest side to 1280
4. Keep a `.original.mp4` backup in `videos/` for rollback.

## 4) Run the project script

```bash
bash scripts/optimize-assets.sh
```

What it does:
- Optimizes all PNG files in-place using `pngquant`
- Optimizes all JPEG/JPG files in-place using `sips`
- Re-encodes MP4 files in `videos/` and keeps `*.original.mp4` backups

## 5) Post-optimization checks

Run these quick checks:

```bash
node -e "const fs=require('fs');console.log('ok')"
```

And manually verify:
- Home hero video playback
- Jewelry/Gemstone product cards
- Instagram section image quality

## 6) Rollback strategy

- Images: restore from Git or backup if needed.
- Videos: swap `videos/<name>.original.mp4` back to `videos/<name>.mp4`.
