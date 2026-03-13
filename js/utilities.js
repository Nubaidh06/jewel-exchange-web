/**
 * Jewel Exchange - Utilities & Form Validation
 * Core functionality for form handling, validation, and user interactions
 * Version: 2.0
 */

const SITE_CONFIG = window.JE_CONFIG || {};
const WHATSAPP_NUMBER = SITE_CONFIG.whatsappNumber || '';
const WHATSAPP_BASE_URL = SITE_CONFIG.whatsappBaseUrl || (WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : '');
const INSTAGRAM_URL = (SITE_CONFIG.social && SITE_CONFIG.social.instagram) || '';
const FACEBOOK_URL = (SITE_CONFIG.social && SITE_CONFIG.social.facebook) || '';
const TIKTOK_URL = (SITE_CONFIG.social && SITE_CONFIG.social.tiktok) || '';
const BUSINESS = SITE_CONFIG.business || {};

function buildWhatsAppUrl(message, phoneNumber = WHATSAPP_NUMBER) {
    if (!phoneNumber) return '';
    const baseUrl = WHATSAPP_BASE_URL || `https://wa.me/${phoneNumber}`;
    if (!message) return baseUrl;
    const waUrl = new URL(baseUrl);
    waUrl.searchParams.set('text', message);
    return waUrl.toString();
}

/**
 * Hydrates repeated social and WhatsApp links from centralized config values.
 * This keeps page markup stable while removing hardcoded link drift.
 */
function hydrateBusinessLinks() {
    const linkMap = {
        instagram: INSTAGRAM_URL,
        facebook: FACEBOOK_URL,
        tiktok: TIKTOK_URL,
        whatsapp: WHATSAPP_BASE_URL
    };

    document.querySelectorAll('a[data-business-link]').forEach((anchor) => {
        const key = anchor.dataset.businessLink;
        const targetHref = linkMap[key];
        if (!targetHref) return;

        if (key !== 'whatsapp') {
            anchor.href = targetHref;
            return;
        }

        let text = '';
        try {
            const currentUrl = new URL(anchor.href, window.location.origin);
            text = currentUrl.searchParams.get('text') || '';
        } catch (_) {
            text = '';
        }

        anchor.href = buildWhatsAppUrl(text) || anchor.href;
    });
}

function hydrateBusinessContent() {
    document.querySelectorAll('[data-business-text]').forEach((node) => {
        const key = node.dataset.businessText;
        const value = BUSINESS[key];
        if (!value) return;
        node.textContent = value;
    });
}

// ============================================================================
// FORM VALIDATION UTILITIES
// ============================================================================

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number format (international)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
function isValidPhone(phone) {
    // Accepts: +94 77 123 4567, 0771234567, +94771234567, etc.
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{7,14}$/;
    return phoneRegex.test(phone.replace(/[-.\s()]/g, ''));
}

/**
 * Validates required field is not empty
 * @param {string} value - Field value to check
 * @returns {boolean} - True if field has content
 */
function isRequired(value) {
    return value && value.trim().length > 0;
}

/**
 * Validates minimum length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if meets minimum length
 */
function minLength(value, minLength = 3) {
    return value && value.trim().length >= minLength;
}

/**
 * Validates select dropdown has selection
 * @param {string} value - Selected value
 * @returns {boolean} - True if value is selected
 */
function isSelected(value) {
    return value && value !== '';
}

/**
 * Main form validation function
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} - True if all fields are valid
 */
function validateForm(form) {
    if (!form) return false;

    let isValid = true;
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach((field) => {
        const fieldType = field.type.toLowerCase();
        const value = field.value.trim();
        const errorMessage = createErrorElement();
        const existingError = field.parentElement.querySelector('.error-message');

        // Remove previous error
        if (existingError) {
            existingError.remove();
        }

        // Validation rules
        if (fieldType === 'email') {
            if (!isRequired(value)) {
                showFieldError(field, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        } else if (fieldType === 'tel') {
            if (!isRequired(value)) {
                showFieldError(field, 'Phone number is required');
                isValid = false;
            } else if (!isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        } else if (field.tagName.toLowerCase() === 'select') {
            if (!isSelected(value)) {
                showFieldError(field, 'Please select an option');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        } else if (field.tagName.toLowerCase() === 'textarea') {
            if (!isRequired(value)) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (!minLength(value, 10)) {
                showFieldError(field, 'Please provide more details (at least 10 characters)');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        } else if (fieldType === 'text' || fieldType === '') {
            if (!isRequired(value)) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.name && field.name.toLowerCase().includes('name')) {
                if (!minLength(value, 2)) {
                    showFieldError(field, 'Please enter a valid name');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            } else {
                clearFieldError(field);
            }
        }
    });

    return isValid;
}

/**
 * Display error message on field
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message to display
 */
function showFieldError(field, message) {
    field.classList.add('has-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

/**
 * Clear error styling from field
 * @param {HTMLElement} field - Form field element
 */
function clearFieldError(field) {
    field.classList.remove('has-error');
}

/**
 * Create error element
 * @returns {HTMLElement} - Error message element
 */
function createErrorElement() {
    const div = document.createElement('div');
    div.className = 'error-message';
    return div;
}

// ============================================================================
// FORM SUBMISSION HANDLING
// ============================================================================

/**
 * Handle form submission with validation and optional Formspree integration
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Validate form
    if (!validateForm(form)) {
        console.log('Form validation failed');
        return false;
    }

    // If form has action attribute, submit normally or via JSON (Formspree)
    if (form.action) {
        // Formspree JSON submission
        if (form.action.includes('formspree.io')) {
            const payload = Object.fromEntries(new FormData(form).entries());
            fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Form submission failed');
                    }
                    showFormSuccess(form);
                })
                .catch((error) => {
                    console.error('Form submission error:', error);
                    showFormError(form);
                });
            return false;
        }

        // Non-Formspree: submit normally
        console.log('Form is valid, submitting to:', form.action);
        form.submit();

        // For demo, show success message
        showFormSuccess(form);
    } else {
        // No action - show success message
        showFormSuccess(form);
    }
}

/**
 * Display success message after form submission
 * @param {HTMLFormElement} form - The submitted form
 */
function showFormSuccess(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div class="form-feedback form-feedback-success">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
            <div>
                <strong>Thank you!</strong><br>
                <small>Your message has been received. We'll contact you within 24 hours.</small>
            </div>
        </div>
    `;

    // Insert at top of form
    form.parentElement.insertBefore(successDiv, form);

    // Reset form
    form.reset();

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.style.transition = 'opacity 0.3s ease';
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

/**
 * Display error message after form submission failure
 * @param {HTMLFormElement} form - The submitted form
 */
function showFormError(form) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `
        <div class="form-feedback form-feedback-error">
            <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
            <div>
                <strong>Submission failed.</strong><br>
                <small>Please try again or contact us by phone or WhatsApp.</small>
            </div>
        </div>
    `;

    form.parentElement.insertBefore(errorDiv, form);

    setTimeout(() => {
        errorDiv.style.transition = 'opacity 0.3s ease';
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 300);
    }, 6000);
}

// ============================================================================
// WHATSAPP INTEGRATION
// ============================================================================

/**
 * Generate WhatsApp message from form data
 * @param {string} productName - Name of product/service
 * @param {string} productDetails - Product details
 * @returns {string} - WhatsApp message
 */
function generateWhatsAppMessage(productName, productDetails) {
    const message = `Hi, I'm interested in ${productName}. ${productDetails || ''}`;
    return encodeURIComponent(message);
}

/**
 * Open WhatsApp chat
 * @param {string} phoneNumber - WhatsApp business number (with country code)
 * @param {string} message - Message to send
 */
function openWhatsApp(phoneNumber = WHATSAPP_NUMBER, message = '') {
    const url = buildWhatsAppUrl(message, phoneNumber);
    if (!url) return;
    window.open(url, '_blank');
}

// ============================================================================
// SMOOTH SCROLL
// ============================================================================

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset from top (for fixed header)
 */
function smoothScrollTo(elementId, offset = 120) {
    const element = document.getElementById(elementId);
    if (element) {
        const headerOffset = offset;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ============================================================================
// PRODUCT FILTERING
// ============================================================================

/**
 * Open drawer from URL params (used by navbar search)
 * @param {Array} data - Product/gemstone list
 * @param {string} kind - "jewelry" or "gemstone"
 */
function maybeOpenDrawerFromParams(data, kind, params) {
    const searchParams = params || new URLSearchParams(window.location.search);
    const openId = searchParams.get('open');
    const openKind = searchParams.get('kind');
    if (!openId) return;
    if (openKind && openKind !== kind) return;

    const match = data.find(item => String(item.id) === String(openId));
    if (!match) return;

    openDetailDrawer({
        name: match.name,
        price: match.price,
        description: match.description,
        image: match.image,
        weight: match.weight,
        origin: match.origin,
        treatment: match.treatment,
        certification: match.certification,
        type: match.type,
        category: match.category,
        material: match.material
    });

    searchParams.delete('open');
    searchParams.delete('kind');
    const newQuery = searchParams.toString();
    const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
}

/**
 * Load and display products/gemstones with filtering
 * @param {string} jsonFile - Path to JSON file (data/products.json or data/gemstones.json)
 * @param {string} gridId - ID of grid container
 * @param {Function} renderCallback - Function to render each item
 */
async function loadAndFilterProducts(jsonFile, gridId, renderCallback) {
    try {
        const response = await fetch(jsonFile);
        const data = await response.json();
        const grid = document.getElementById(gridId);
        if (!grid) return;

        // Home featured grid: render a limited set with no filters.
        if (grid.classList.contains('featured-limit')) {
            grid.innerHTML = '';
            data.slice(0, 3).forEach(item => {
                const element = renderCallback(item);
                grid.appendChild(element);
            });
            return;
        }

        window.allProducts = data;
        
        // Read URL params DIRECTLY (don't rely on radio button state)
        const params = new URLSearchParams(window.location.search);
        const urlType = params.has('type') ? params.get('type') : 'all';
        const urlCategory = params.has('category') ? params.get('category') : 'all';
        const urlMaterial = params.has('material') ? params.get('material') : 'all';
        
        // Initialize radio buttons from URL params BEFORE rendering
        initializeFiltersFromURL(urlType, urlCategory, urlMaterial);
        
        // Apply filters using URL values directly
        const kind = jsonFile.includes('gemstones') ? 'gemstone' : 'jewelry';
        maybeOpenDrawerFromParams(data, kind, params);

        applyFiltersWithValues(gridId, renderCallback, urlType, urlCategory, urlMaterial);
        
        // Attach filter listeners
        attachFilterListeners(gridId, renderCallback);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

/**
 * Initialize filter selections from URL query parameters
 * @param {string} type - Type filter value
 * @param {string} category - Category filter value
 * @param {string} material - Material filter value
 */
function initializeFiltersFromURL(type = 'all', category = 'all', material = 'all') {
    // For jewelry page - handle type filter
    if (type !== 'all') {
        const typeRadio = document.querySelector(`input[name="type"][value="${type}"]`);
        if (typeRadio) typeRadio.checked = true;
    }
    
    // For jewelry page - handle category filter
    if (category !== 'all') {
        const categoryRadio = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryRadio) categoryRadio.checked = true;
    }
    
    // For jewelry page - handle material filter
    if (material !== 'all') {
        const materialRadio = document.querySelector(`input[name="material"][value="${material}"]`);
        if (materialRadio) materialRadio.checked = true;
    }
}

/**
 * Apply filters using directly passed filter values (bypasses radio button state)
 * @param {string} gridId - ID of grid container
 * @param {Function} renderCallback - Function to render each item
 * @param {string} type - Type filter value
 * @param {string} category - Category filter value
 * @param {string} material - Material filter value
 */
function applyFiltersWithValues(gridId, renderCallback, type = 'all', category = 'all', material = 'all') {
    if (!window.allProducts) return;
    
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    // Filter products using directly passed values
    let filtered = window.allProducts;
    
    // Apply type filter (for jewelry)
    if (type !== 'all') {
        filtered = filtered.filter(item => item.type === type);
    }
    
    // Apply category filter (for jewelry & gemstones)
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    // Apply material filter (for jewelry)
    if (material !== 'all') {
        filtered = filtered.filter(item => item.material === material);
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    // Check if no results
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>No items found matching your filters.</p>
            </div>
        `;
        return;
    }
    
    // Render filtered products
    filtered.forEach(item => {
        const element = renderCallback(item);
        grid.appendChild(element);
    });
    
    // Update URL without page reload
    updateURLWithFilters(type, category, material);
    updateClearFiltersButtonState();
}

/**
 * Apply filters and render products (reads from radio button state)
 * @param {string} gridId - ID of grid container
 * @param {Function} renderCallback - Function to render each item
 */
function applyFilters(gridId, renderCallback) {
    if (!window.allProducts) return;
    
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    // Get current filter values
    const typeFilter = document.querySelector('input[name="type"]:checked');
    const categoryFilter = document.querySelector('input[name="category"]:checked');
    const materialFilter = document.querySelector('input[name="material"]:checked');
    
    const selectedType = typeFilter ? typeFilter.value : 'all';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedMaterial = materialFilter ? materialFilter.value : 'all';
    
    // Filter products
    let filtered = window.allProducts;
    
    // Apply type filter (for jewelry)
    if (selectedType !== 'all') {
        filtered = filtered.filter(item => item.type === selectedType);
    }
    
    // Apply category filter (for jewelry & gemstones)
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply material filter (for jewelry)
    if (selectedMaterial !== 'all') {
        filtered = filtered.filter(item => item.material === selectedMaterial);
    }
    
    // Clear grid
    grid.innerHTML = '';
    
    // Check if no results
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>No items found matching your filters.</p>
            </div>
        `;
        return;
    }
    
    // Render filtered products
    filtered.forEach(item => {
        const element = renderCallback(item);
        grid.appendChild(element);
    });
    
    // Update URL without page reload
    updateURLWithFilters(selectedType, selectedCategory, selectedMaterial);
    updateClearFiltersButtonState();
}

/**
 * Toggle Clear All button visibility based on active filters
 */
function updateClearFiltersButtonState() {
    const clearBtn = document.querySelector('.clear-filters-btn');
    if (!clearBtn) return;

    const selectedInputs = document.querySelectorAll('input[name="type"]:checked, input[name="category"]:checked, input[name="material"]:checked');
    const hasActiveFilters = Array.from(selectedInputs).some((input) => input.value !== 'all');
    clearBtn.classList.toggle('is-active', hasActiveFilters);
}

/**
 * Update browser URL with current filter selections
 * @param {string} type - Selected type
 * @param {string} category - Selected category
 * @param {string} material - Selected material
 */
function updateURLWithFilters(type, category, material) {
    const params = new URLSearchParams();
    
    if (type !== 'all') {
        params.append('type', type);
    }
    
    if (category !== 'all') {
        params.append('category', category);
    }
    
    if (material !== 'all') {
        params.append('material', material);
    }
    
    const newURL = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
    
    window.history.replaceState({}, '', newURL);
}

/**
 * Attach event listeners to filter controls
 * @param {string} gridId - ID of grid container
 * @param {Function} renderCallback - Function to render each item
 */
function attachFilterListeners(gridId, renderCallback) {
    const filterInputs = document.querySelectorAll('input[name="type"], input[name="category"], input[name="material"]');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            applyFilters(gridId, renderCallback);
        });
    });
    
    // Clear filters button
    const clearBtn = document.querySelector('.clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('input[name="type"], input[name="category"], input[name="material"]').forEach(input => {
                if (input.value === 'all') {
                    input.checked = true;
                }
            });
            applyFilters(gridId, renderCallback);
        });
    }

    updateClearFiltersButtonState();
}

/**
 * Create product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} - Product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.title = product.name || '';
    card.dataset.price = product.price || '';
    card.dataset.desc = product.description || '';
    card.dataset.img = product.image || '';
    card.dataset.type = product.type || '';
    card.dataset.category = product.category || '';
    card.dataset.material = product.material || '';
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="product-info">
            <h3 class="product-name gold-text italic">${product.name}</h3>
            <p class="product-price">${product.price}</p>
            <p class="product-desc">${product.description}</p>
            <button class="btn-gold view-detail-btn"
                data-title="${product.name || ''}"
                data-price="${product.price || ''}"
                data-desc="${product.description || ''}"
                data-img="${product.image || ''}"
                data-type="${product.type || ''}"
                data-category="${product.category || ''}"
                data-material="${product.material || ''}">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Create gemstone card element
 * @param {Object} stone - Gemstone object
 * @returns {HTMLElement} - Gemstone card element
 */
function createGemstonCard(stone) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.title = stone.name || '';
    card.dataset.price = stone.price || '';
    card.dataset.desc = stone.description || '';
    card.dataset.img = stone.image || '';
    card.dataset.weight = stone.weight || '';
    card.dataset.origin = stone.origin || '';
    card.dataset.treatment = stone.treatment || '';
    card.dataset.certification = stone.certification || '';
    card.dataset.category = stone.category || '';
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${stone.image}" alt="${stone.name}" class="product-image">
        </div>
        <div class="product-info">
            <h3 class="product-name gold-text italic">${stone.name}</h3>
            <p class="product-price">${stone.price}</p>
            <div class="stone-meta">
                <p>${stone.weight}</p>
                <p>${stone.origin}</p>
            </div>
            <p class="product-desc">${stone.description}</p>
            <button class="btn-gold view-detail-btn"
                data-title="${stone.name || ''}"
                data-price="${stone.price || ''}"
                data-desc="${stone.description || ''}"
                data-img="${stone.image || ''}"
                data-weight="${stone.weight || ''}"
                data-origin="${stone.origin || ''}"
                data-treatment="${stone.treatment || ''}"
                data-certification="${stone.certification || ''}"
                data-category="${stone.category || ''}">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Open detail drawer with product information
 * @param {Object} product - Product data
 */
function openDetailDrawer(product) {
    const drawer = document.getElementById('detail-drawer');
    if (!drawer) return;
    
    document.getElementById('drawer-img').src = product.image;
    document.getElementById('drawer-img').alt = product.name;
    document.getElementById('drawer-title').textContent = product.name;
    
    // Build description HTML
    let descHTML = '';
    if (product.price) {
        descHTML += `<h4 class="gold-text drawer-price-title">${product.price}</h4>`;
    }

    if (product.weight || product.origin || product.treatment || product.certification || product.type || product.category || product.material) {
        descHTML += `<div class="drawer-specs drawer-specs-highlight">`;
        if (product.weight) descHTML += `<p><strong>Weight:</strong> ${product.weight}</p>`;
        if (product.origin) descHTML += `<p><strong>Origin:</strong> ${product.origin}</p>`;
        if (product.treatment) descHTML += `<p><strong>Treatment:</strong> ${product.treatment}</p>`;
        if (product.certification) descHTML += `<p><strong>Certification:</strong> ${product.certification}</p>`;
        if (product.type) descHTML += `<p><strong>Type:</strong> ${product.type.replace('-', ' ')}</p>`;
        if (product.category) descHTML += `<p><strong>Collection:</strong> ${product.category.replace('-', ' ')}</p>`;
        if (product.material) descHTML += `<p><strong>Material:</strong> ${product.material.replace('-', ' ')}</p>`;
        descHTML += `</div>`;
    }

    if (product.description) {
        descHTML += `<p class="drawer-desc-text">${product.description}</p>`;
    }

    const descEl = document.getElementById('drawer-desc');
    if (descEl) {
        descEl.innerHTML = descHTML;
    }
    
    // Setup WhatsApp link
    const whatsappLink = document.getElementById('whatsapp-link');
    const message = encodeURIComponent(
        product.price
            ? `Hi Jewel Exchange, I'm interested in the "${product.name}" listed at ${product.price}. Could you provide more details?`
            : `Hi, I'm interested in: ${product.name}`
    );
    whatsappLink.href = buildWhatsAppUrl(message) || whatsappLink.href;

    const instagramLink = document.getElementById('instagram-link');
    if (instagramLink) {
        instagramLink.href = INSTAGRAM_URL;
    }
    
    // Show drawer (match main.js behavior)
    drawer.style.display = '';
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// ============================================================================
// EVENT LISTENER SETUP
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    hydrateBusinessLinks();
    hydrateBusinessContent();

    // Attach form submission handlers to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Setup smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                smoothScrollTo(targetId);
            }
        });
    });
    
});

// ============================================================================
// UTILITY HELPER FUNCTIONS
// ============================================================================

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})(\d{1,4})(\d{1,4})(\d{0,4})$/);
    
    if (!match) return phone;
    
    let formatted = '';
    if (match[1]) formatted += '+' + match[1] + ' ';
    if (match[2]) formatted += match[2] + ' ';
    if (match[3]) formatted += match[3] + ' ';
    if (match[4]) formatted += match[4];
    
    return formatted.trim();
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    const textarea = document.createElement('textarea');
    textarea.textContent = input;
    return textarea.innerHTML;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if visible in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// EXPORT FOR MODULE USAGE (if using modules)
// ============================================================================

// Uncomment if using ES6 modules
/*
export {
    validateForm,
    handleFormSubmit,
    openWhatsApp,
    smoothScrollTo,
    isValidEmail,
    isValidPhone,
    formatPhoneNumber,
    sanitizeInput,
    debounce
};
*/
