# Security Audit Report

## Summary
The site is a static HTML/CSS/JS frontend with generally low inherent risk. The key security weaknesses are third-party assets without integrity, missing security headers, and DOM XSS exposure if product data becomes untrusted. No critical or high-risk vulnerabilities were found.

## Critical Vulnerabilities
None identified.

## High Risk Issues
None identified.

## Medium Risk Issues

**Issue ID:** SEC-001  
**Title:** External CDN assets without SRI (Font Awesome)  
**Risk Level:** Medium  
**Location:** `index.html`, `about.html`, `bespoke.html`, `contact.html`, `jewelry.html`, `gemstones.html`, `privacy-policy.html`, `terms.html`  
**Explanation:** Loading CSS from a CDN without Subresource Integrity means a compromised CDN or MITM could inject malicious CSS/JS via CSS imports.  
**Example Attack Scenario:** An attacker alters the CDN response and injects a malicious stylesheet that exfiltrates form data via crafted URLs.  
**Recommended Fix:** Add SRI + `crossorigin="anonymous"` or self-host Font Awesome.  
**Secure Code Example:**
```html
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      integrity="sha384-REPLACE_WITH_HASH"
      crossorigin="anonymous">
```

**Issue ID:** SEC-006  
**Title:** DOM XSS risk from unsanitized product fields inserted via `innerHTML`  
**Risk Level:** Medium  
**Location:** `js/utilities.js` -> `createProductCard()`, `createGemstonCard()`, `openDetailDrawer()`  
**Explanation:** Product fields (name, description, etc.) are interpolated into `innerHTML`. If product data ever comes from an API or CMS, a malicious payload could inject script or event handlers into the DOM.  
**Example Attack Scenario:** A compromised product record contains `<img src=x onerror=alert(1)>`, which is inserted into the card HTML and executes.  
**Recommended Fix:** Build DOM nodes via `createElement`/`textContent`, or sanitize inputs before HTML insertion.  
**Secure Code Example:**
```js
const title = document.createElement('h3');
title.className = 'product-name gold-text italic';
title.textContent = product.name || '';
```

**Issue ID:** SEC-007  
**Title:** Detail drawer description uses `innerHTML` with product fields  
**Risk Level:** Medium  
**Location:** `js/utilities.js` -> `openDetailDrawer()`  
**Explanation:** `descHTML` concatenates product fields and is injected into `innerHTML`. Same XSS vector as above, especially if data becomes remote.  
**Example Attack Scenario:** Malicious `product.description` injects script inside the drawer.  
**Recommended Fix:** Build the drawer content with DOM nodes and `textContent`, or sanitize.  
**Secure Code Example:**
```js
const descEl = document.getElementById('drawer-desc');
descEl.textContent = '';
```

## Low Risk Issues

**Issue ID:** SEC-002  
**Title:** Missing security headers (CSP, XFO, Referrer-Policy, Permissions-Policy, HSTS)  
**Risk Level:** Low  
**Location:** Global (applies to all pages)  
**Explanation:** Without these headers, the site is more exposed to clickjacking, referrer leakage, and injection risks if any vulnerability appears later.  
**Example Attack Scenario:** An attacker embeds the site in a malicious frame to deceive users.  
**Recommended Fix:** Set headers at the server level once hosting is configured.  
**Secure Code Example:**
```
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Issue ID:** SEC-003  
**Title:** Inline GA bootstrap script complicates CSP  
**Risk Level:** Low  
**Location:** `index.html`, `about.html`, `bespoke.html`, `contact.html`, `jewelry.html`, `gemstones.html`, `privacy-policy.html`, `terms.html`  
**Explanation:** Inline scripts require `'unsafe-inline'` or nonce-based CSP, weakening CSP unless nonces/hashes are used.  
**Example Attack Scenario:** If any injection vector appears later, a relaxed CSP increases exploitability.  
**Recommended Fix:** Move inline GA init to a dedicated JS file and use CSP with nonces/hashes.  
**Secure Code Example:**
```html
<script src="js/ga-init.js"></script>
```

**Issue ID:** SEC-004  
**Title:** robots.txt is not access control  
**Risk Level:** Low  
**Location:** `robots.txt`  
**Explanation:** Disallow rules only advise crawlers; they do not prevent access. Sensitive paths must be protected by server-side access controls.  
**Example Attack Scenario:** An attacker browses directly to `/admin/` or `/private/` because robots.txt lists them, and the server does not enforce authentication.  
**Recommended Fix:** Ensure any sensitive paths are protected by authentication/authorization on the server.  
**Secure Code Example:**
```
# Keep robots.txt for SEO only.
# Enforce access controls at the server or application layer.
```

**Issue ID:** SEC-005  
**Title:** External background image loaded from third-party domain  
**Risk Level:** Low  
**Location:** `css/sections/01-core-foundation.css` -> `.contact-hero`  
**Explanation:** Third-party background images leak referrer data and create availability dependencies.  
**Example Attack Scenario:** Replaced remote image becomes a tracking vector.  
**Recommended Fix:** Self-host the image.  
**Secure Code Example:**
```css
.contact-hero { background: url('/images/contact-hero.jpg') center/cover no-repeat; }
```

**Issue ID:** SEC-008  
**Title:** URL params used in `querySelector` without escaping  
**Risk Level:** Low  
**Location:** `js/utilities.js` -> `initializeFiltersFromURL()`  
**Explanation:** URL params interpolated into selectors can throw a `DOMException` and break filtering (client-side DoS).  
**Example Attack Scenario:** Crafted URL with invalid selector characters breaks filter init.  
**Recommended Fix:** Use `CSS.escape()`.  
**Secure Code Example:**
```js
const safeType = CSS.escape(type);
```

**Issue ID:** SEC-009  
**Title:** `window.open` without `noopener`  
**Risk Level:** Low  
**Location:** `js/utilities.js` -> `openWhatsApp()`  
**Explanation:** Reverse-tabnabbing risk if the target is compromised.  
**Recommended Fix:** Use `noopener` or set `opener` to null.  
**Secure Code Example:**
```js
const w = window.open(url, '_blank', 'noopener');
if (w) w.opener = null;
```


## Notes
- JSON data files contain no secrets or executable content.
- Static CSS files have no direct injection surfaces; primary risk is in JS DOM insertion.
- This report should be updated as new features (especially backend/payment flows) are added.
