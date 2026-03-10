# Jewel Exchange - Luxury Jewelry & Gemstone Boutique

**A premium, hand-crafted website for Sri Lanka's most discerning custodians of rare gemstones and masterful jewelry design.**

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [File Descriptions](#file-descriptions)
- [How to Update Content](#how-to-update-content)
- [Technologies Used](#technologies-used)
- [Browser Support](#browser-support)
- [Performance & Optimization](#performance--optimization)
- [Deployment Guide](#deployment-guide)
- [Contributing & Maintenance](#contributing--maintenance)

---

## 🎯 Project Overview

Jewel Exchange is a **luxury jewelry e-commerce website** showcasing:
- Hand-crafted jewelry collections
- Investment-grade gemstones
- Bespoke custom jewelry services
- Company heritage and craftsmanship story
- Direct boutique experience and consultations

**Key Highlights:**
- ✨ Premium, responsive design
- 🎨 Consistent luxury brand aesthetic
- 📱 Fully mobile-optimized (tested down to 320px)
- ♿ Accessibility-focused with ARIA labels
- 🚀 Performance-optimized
- 📊 SEO-enhanced with schema markup

---

## ✨ Features

### Pages
1. **Home** (`index.html`)
   - Hero showcase (3-column with video)
   - Featured collections grid
   - Brand heritage section
   - Instagram gallery section (static)
   - Showroom information

2. **Jewelry Boutique** (`jewelry.html`)
   - Luxury product showcase
   - Sidebar filtering system
   - Interactive detail drawer
   - WhatsApp inquiry integration

3. **Gemstone Vault** (`gemstones.html`)
   - Investment-grade gemstones
   - Stone type filtering
   - Certification information display
   - Direct consultation booking

4. **Bespoke Services** (`bespoke.html`)
   - Custom jewelry process visualization
   - Consultation request form
   - Service advantages showcase
   - Timeline and pricing information

5. **Our Story** (`about.html`)
   - Company heritage narrative
   - Craftsmanship pillars
   - Timeline of achievements
   - Brand commitment statement

6. **Visit Us** (`contact.html`)
   - Store location with embedded map
   - Contact information
   - Private viewing appointments
   - Opening hours

### Core Functionality
- ✅ Responsive hamburger navigation menu
- ✅ Smooth hover effects and animations
- ✅ Interactive detail drawer for product information
- ✅ Form validation and submission
- ✅ Product filtering system (JS-driven with URL params)
- ✅ Navbar live search (products + gemstones, dropdown results)
- ✅ Mobile-optimized touch targets (48px minimum)
- ✅ Keyboard navigation support

---

## 📁 Project Structure

```
jewel-exchange-web/
├── index.html                 # Homepage
├── about.html                 # Company story
├── bespoke.html              # Custom jewelry service
├── contact.html              # Store location & appointments
├── jewelry.html              # Jewelry collection
├── gemstones.html            # Gemstone vault
├── robots.txt                # Search engine directives
├── sitemap.xml               # XML sitemap for SEO
├── css/
│   ├── style.css             # CSS import manifest
│   └── sections/             # Sectioned styles (01-06)
├── js/
│   ├── site-config.js        # Shared runtime constants
│   ├── main.js               # Nav, drawer, mobile filters
│   └── utilities.js          # Forms, filtering, card render helpers
├── data/
│   ├── products.json         # Jewelry products
│   └── gemstones.json        # Gemstone products
├── images/                   # Logos, banners, product & social images
└── videos/                   # Hero/background video files
```

---

## 🚀 Setup & Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor or IDE (VS Code recommended)
- Node.js (optional, for build processes)

### Local Development

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd jewel-exchange-web
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using VS Code Live Server extension
   # Right-click index.html > Open with Live Server
   ```

3. **Access the site**
   - Open `http://localhost:8000` in your browser
   - Navigate through all pages to verify functionality

### Verification Checklist
- [ ] All pages load without errors
- [ ] Navigation works on desktop and mobile
- [ ] Hamburger menu toggles on mobile
- [ ] Hero video plays (check browser autoplay permissions)
- [ ] Forms display validation messages
- [ ] Images load correctly
- [ ] Responsive design works at 320px, 768px, and 1400px

---

## 📄 File Descriptions

### HTML Files
| File | Purpose | Key Sections |
|------|---------|--------------|
| `index.html` | Homepage | Hero, Collections, Heritage, Showroom |
| `about.html` | Company story | Hero, Origin, Pillars, Timeline, Commitment |
| `bespoke.html` | Custom services | Hero, Process, Advantages, Form |
| `contact.html` | Contact & map | Hero, Details, Form, Embedded Map |
| `jewelry.html` | Collections | Hero, Sidebar filters, Grid, Detail drawer |
| `gemstones.html` | Gemstones | Hero, Sidebar filters, Grid, Detail drawer |

### CSS
- **`css/style.css`** (import manifest)
  - **01-core-foundation.css**: Global styles, navbar, buttons, shared UI, base responsive rules
  - **02-about-page.css**: About page styling
  - **03-bespoke-page.css**: Bespoke page styling
  - **04-collections-pages.css**: Jewelry + gemstone listings
  - **05-contact-page.css**: Contact page styles
  - **06-home-and-drawer.css**: Home sections + product cards/drawer
  - **Breakpoints**: 1024px (tablet), 768px (mobile), 480px (small phones)

### JavaScript
- **`js/site-config.js`**
  - WhatsApp number, data file paths, social URLs
- **`js/main.js`**
  - Hamburger menu + mobile navigation
  - Drawer open/close behavior
  - Mobile filter collapse for collections
-  - Navbar live search (products + gemstones)
- **`js/utilities.js`**
  - Form validation + Formspree submission
  - Product loading/filtering + card rendering
  - WhatsApp helper + smooth scroll

### SEO Files
- **`robots.txt`** - Directs search engine crawlers
- **`sitemap.xml`** - XML sitemap for all pages

---

## ✏️ How to Update Content

### Update Product Images
```
1. Replace images in `/images/` (keep paths in JSON in sync)
2. Update HTML src attributes in jewelry.html or gemstones.html
3. Keep image names consistent
4. Optimize images for web (use tools like TinyPNG)
```

### Update Showroom Information
```
1. Edit contact details in contact.html and index.html
2. Update phone numbers: Search for +94 11 2XXX XXX
3. Update address: 514A R.A. De Mel Mawatha
4. Update opening hours in multiple locations
```

### Update Instagram Gallery
```
1. Replace the Instagram grid images in /images/
2. Update the <img> sources in index.html if filenames change
3. Consider an API embed only if you want dynamic updates
```

### Update WhatsApp Link
```
1. Find: href="https://wa.me/94770000000"
2. Replace phone number with your actual WhatsApp business number
3. Update in: index.html, jewelry.html, gemstones.html, detail drawer
```

### Update Form Endpoints
```html
<!-- Current setup (Formspree enabled) -->
<form class="luxury-form" action="https://formspree.io/f/xwvrebqo" method="POST">

<!-- Replace the endpoint if needed -->
```

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, Media Queries, CSS Variables
- **JavaScript (ES6)** - Event handling, form validation
- **Font Awesome 6.0** - Icons library
- **Google Fonts** - Playfair Display (serif) & Lato (sans-serif)

### Design System
- **Color Palette**:
  - Primary Gold: `#c5a059`
  - Dark Charcoal: `#1a1a1a`
  - Off-White: `#fcfcfc`
  - Light Gray: `#f4f4f4`

- **Typography**:
  - Headlines: Playfair Display (serif, elegant)
  - Body: Lato (sans-serif, readable)

### Third-Party Services
- **Google Maps API** - Embedded store location map
- **Font Awesome** - CDN-hosted icons
- **Google Fonts** - Web fonts

---

## 🌐 Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ Latest | ✅ Latest | Fully supported |
| Firefox | ✅ Latest | ✅ Latest | Fully supported |
| Safari | ✅ 12+ | ✅ 12+ | Fully supported |
| Edge | ✅ Latest | ✅ Latest | Fully supported |
| IE 11 | ❌ Not tested | - | CSS Grid may have issues |

**Minimum Screen Sizes Tested:**
- Desktop: 1400px (max container width)
- Tablet: 1024px breakpoint
- Mobile: 768px breakpoint
- Small phones: 480px and 320px

---

## ⚡ Performance & Optimization

### Current Optimizations
- ✅ CSS organized into 18 sections for maintainability
- ✅ Mobile-first CSS approach
- ✅ Optimized media queries (480px, 768px, 1024px)
- ✅ Touch-friendly buttons (48px minimum height)
- ✅ Lazy-loaded video in hero section
- ✅ Font loading optimized with Google Fonts

### Future Optimizations (See Roadmap)
- [ ] Minify CSS and JavaScript
- [ ] Image optimization with WebP conversion
- [ ] Lazy loading for images
- [ ] CSS preprocessor (SASS/SCSS)
- [ ] Build process (Webpack/Vite)
- [ ] Service Worker for caching

### Recommended Tools
- **Image Optimization**: TinyPNG, ImageOptim, Squoosh
- **CSS Minification**: CSSNano, PostCSS
- **Performance Testing**: Google PageSpeed Insights, GTmetrix
- **Bundle Analysis**: Webpack Bundle Analyzer

---

## 🚢 Deployment Guide

### Hosting Recommendations
1. **Netlify** (Easiest for static sites)
   - Drag & drop deployment
   - Free HTTPS
   - Auto-deploy from Git

2. **Vercel** (Optimized for performance)
   - One-click deployment
   - Edge functions support
   - Automatic optimizations

3. **GitHub Pages** (Free, simple)
   - Push to GitHub
   - Automatic deployment
   - CNAME for custom domain

4. **Traditional Hosting** (Shared/VPS)
   - Upload via FTP
   - Full control
   - Better for dynamic backends

### Pre-Deployment Checklist
- [ ] All links verified (no 404s)
- [ ] Images optimized and compressed
- [ ] Forms configured (Formspree or backend)
- [ ] WhatsApp links updated with real number
- [ ] Contact information verified
- [ ] Meta tags reviewed
- [ ] Sitemap uploaded
- [ ] robots.txt configured
- [ ] HTTPS enabled
- [ ] Custom domain configured

---

## 📝 Contributing & Maintenance

### Regular Maintenance Tasks
- **Monthly**: Update Instagram feed images
- **Quarterly**: Review analytics and update featured collections
- **Annually**: Audit accessibility, performance, and SEO

### Version Control
```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit: Jewel Exchange website"

# Create branches for features
git checkout -b feature/new-section
git commit -m "Add new section"
git push origin feature/new-section
```

### Updating Dependencies
- Monitor Font Awesome for updates
- Check Google Fonts for new weights
- Keep track of API changes (Google Maps, etc.)

### Known Issues & Limitations
- Instagram gallery is static (consider API integration if needed)
- No shopping cart functionality (inquiry-only flow)

---

## 📊 SEO Checklist

- ✅ Meta descriptions on all pages
- ✅ robots.txt configured
- ✅ Sitemap.xml created
- ✅ Schema.org markup added
- ✅ Open Graph meta tags added
- ✅ Canonical tags added
- ✅ Mobile-friendly design verified
- ✅ Page speed optimized

---

## ♿ Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Proper heading hierarchy
- ✅ Color contrast meets WCAG standards
- ✅ Touch targets 48px minimum
- ✅ Keyboard navigation support
- ✅ Form labels associated with inputs
- ✅ Alt text on images

---

## 📞 Support & Questions

For questions about this project:
1. Check this README for common issues
2. Review the code comments in CSS for styling explanations
3. Refer to the TODO checklist for planned improvements

---

## 📅 Project Timeline

| Phase | Status | Completed |
|-------|--------|-----------|
| Design & Wireframes | ✅ | Yes |
| HTML Structure | ✅ | Yes |
| CSS Styling | ✅ | Yes |
| Responsive Design | ✅ | Yes |
| Accessibility | 🔄 | In Progress |
| SEO Optimization | 🔄 | In Progress |
| Form Validation | 🔄 | In Progress |
| Testing & Deployment | ⏳ | Planned |

---

## 📦 Changelog

### v2.0 (Current - March 2026)
- ✨ Complete redesign of About, Bespoke, Jewelry, Gemstones pages
- ✨ New luxury hero sections and sidebar filtering
- ✨ Enhanced contact page with refined forms
- ✨ Responsive improvements for 480px breakpoint
- ✨ Form validation and utilities
- ✨ SEO enhancements and accessibility improvements
- 📝 Comprehensive README documentation

### v1.0 (Initial)
- 🚀 Basic website structure
- 🎨 Initial luxury branding

---

**Last Updated**: March 5, 2026  
**Maintained By**: Development Team  
**License**: © 2026 Jewel Exchange. All Rights Reserved.
