/* JEWEL EXCHANGE - MASTER LOGIC
    1. Navigation Slide (Mobile Menu & Scroll Lock)
    2. Dual-JSON Product Loader (Home Page Optimized)
    3. Unified Scroll Reveal (Intersection Observer)
    4. Smart Filtering (Supports Dynamic Card Generation)
    5. Detail Drawer (Smart Data Mapping & WhatsApp)
*/

document.addEventListener('DOMContentLoaded', async () => {
    const siteConfig = window.JE_CONFIG || {};
    const dataFiles = siteConfig.dataFiles || {
        products: 'data/products.json',
        gemstones: 'data/gemstones.json'
    };
    
    // --- Helper Function: Toggle Body Scroll ---
    const toggleBodyScroll = (isLocked) => {
        document.body.style.overflow = isLocked ? 'hidden' : '';
    };

    // --- 1. Navigation Slide Logic ---
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        if (!nav) return;
        const isMobileNav = () => window.matchMedia('(max-width: 768px)').matches;
        const topLevelDropdownTriggers = Array.from(nav.querySelectorAll('li.has-dropdown > a'))
            .filter((anchor) => anchor.parentElement && anchor.parentElement.parentElement === nav);

        const closeMobileNav = () => {
            nav.classList.remove('nav-active');
            if (burger) {
                burger.classList.remove('toggle');
                burger.setAttribute('aria-expanded', 'false');
            }
            toggleBodyScroll(false);
        };

        const closeAllMobileSubmenus = () => {
            const openDropdowns = nav.querySelectorAll('.has-dropdown.mobile-submenu-open');
            openDropdowns.forEach((item) => item.classList.remove('mobile-submenu-open'));
            topLevelDropdownTriggers.forEach((anchor) => anchor.setAttribute('aria-expanded', 'false'));
        };

        topLevelDropdownTriggers.forEach((anchor) => {
            anchor.setAttribute('aria-haspopup', 'true');
            anchor.setAttribute('aria-expanded', 'false');
        });

        const syncMobileCloseButton = () => {
            const existing = nav.querySelector('.nav-close-item');
            if (isMobileNav()) {
                if (existing) return;
                const li = document.createElement('li');
                li.className = 'nav-close-item';
                li.innerHTML = '<button type="button" class="nav-close-btn" aria-label="Close menu">×</button>';
                nav.prepend(li);
                li.querySelector('.nav-close-btn').addEventListener('click', () => {
                    closeAllMobileSubmenus();
                    closeMobileNav();
                });
                return;
            }
            if (existing) existing.remove();
        };

        syncMobileCloseButton();

        if (burger) {
            burger.onclick = () => {
                const isActive = nav.classList.toggle('nav-active');
                burger.classList.toggle('toggle');
                burger.setAttribute('aria-expanded', String(isActive));
                toggleBodyScroll(isActive);
                if (!isActive) closeAllMobileSubmenus();
            };
            burger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    burger.click();
                }
            });
        }

        nav.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor || !nav.contains(anchor)) return;

            const parent = anchor.parentElement;
            const isTopLevelDropdownTrigger = parent &&
                parent.classList.contains('has-dropdown') &&
                parent.parentElement === nav;

            if (isMobileNav() && isTopLevelDropdownTrigger) {
                if (parent.classList.contains('mobile-submenu-open')) {
                    closeAllMobileSubmenus();
                    closeMobileNav();
                    return;
                }
                e.preventDefault();
                closeAllMobileSubmenus();
                parent.classList.add('mobile-submenu-open');
                anchor.setAttribute('aria-expanded', 'true');
                return;
            }

            if (isMobileNav()) {
                closeAllMobileSubmenus();
                closeMobileNav();
            }
        });

        nav.addEventListener('keydown', (e) => {
            if (e.key !== ' ') return;
            const anchor = e.target.closest('a');
            if (!anchor || !nav.contains(anchor)) return;
            const parent = anchor.parentElement;
            const isTopLevelDropdownTrigger = parent &&
                parent.classList.contains('has-dropdown') &&
                parent.parentElement === nav;
            if (isMobileNav() && isTopLevelDropdownTrigger) {
                e.preventDefault();
                anchor.click();
            }
        });

        window.addEventListener('resize', () => {
            syncMobileCloseButton();
            if (!isMobileNav()) {
                closeAllMobileSubmenus();
                nav.classList.remove('nav-active');
                if (burger) {
                    burger.classList.remove('toggle');
                    burger.setAttribute('aria-expanded', 'false');
                }
                toggleBodyScroll(false);
            }
        });
    };

    // --- 2. Unified Scroll Reveal ---
    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const targets = document.querySelectorAll('.reveal, section, .jewelry-card, .product-card, .pillar-item, .mosaic-card, .value-item');
        let staggerIndex = 0;
        targets.forEach(el => {
            if (!el.classList.contains('reveal')) el.classList.add('reveal');

            const isStaggerTarget = el.matches('.product-card, .jewelry-card, .value-card-home, .pillar-card, .advantage-card, .timeline-item, .process-step');
            if (isStaggerTarget) {
                const delay = Math.min(staggerIndex * 60, 360);
                el.style.setProperty('--reveal-delay', `${delay}ms`);
                staggerIndex += 1;
            } else {
                el.style.setProperty('--reveal-delay', '0ms');
            }

            observer.observe(el);
        });
    };

    // --- 2.5 Navbar Search (Products + Gemstones) ---
    const initNavSearch = () => {
        const input = document.getElementById('nav-search-input');
        const results = document.getElementById('nav-search-results');
        if (!input || !results) return;

        let searchCache = null;
        let loading = false;
        let debounceTimer = null;

        const buildIndex = async () => {
            if (searchCache) return searchCache;
            if (loading) return [];
            loading = true;
            try {
                const [productsRes, gemsRes] = await Promise.all([
                    fetch(dataFiles.products),
                    fetch(dataFiles.gemstones)
                ]);
                const [products, gemstones] = await Promise.all([
                    productsRes.json(),
                    gemsRes.json()
                ]);

                const mapItem = (item, kind) => {
                    const page = kind === 'gemstone' ? 'gemstones.html' : 'jewelry.html';
                    const searchText = [
                        item.name,
                        item.description,
                        item.category,
                        item.type,
                        item.material,
                        item.origin,
                        item.treatment,
                        item.certification
                    ].filter(Boolean).join(' ').toLowerCase();
                    return {
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        kind,
                        page,
                        searchText
                    };
                };

                searchCache = [
                    ...products.map(item => mapItem(item, 'jewelry')),
                    ...gemstones.map(item => mapItem(item, 'gemstone'))
                ];
                return searchCache;
            } catch (err) {
                console.error('Search index load failed:', err);
                return [];
            } finally {
                loading = false;
            }
        };

        const clearResults = () => {
            results.innerHTML = '';
            results.classList.remove('is-active');
        };

        const renderResults = (items) => {
            results.innerHTML = '';
            if (!items.length) {
                const empty = document.createElement('div');
                empty.className = 'nav-search-empty';
                empty.textContent = 'No results found.';
                results.appendChild(empty);
                results.classList.add('is-active');
                return;
            }

            items.forEach((item) => {
                const link = document.createElement('a');
                link.className = 'nav-search-result';
                link.href = `${item.page}?open=${encodeURIComponent(item.id)}&kind=${encodeURIComponent(item.kind)}`;

                const img = document.createElement('img');
                img.className = 'nav-search-thumb';
                img.src = item.image;
                img.alt = item.name;

                const meta = document.createElement('div');
                meta.className = 'nav-search-meta';
                const title = document.createElement('h5');
                title.textContent = item.name;
                const label = document.createElement('span');
                label.textContent = item.kind === 'gemstone' ? 'Gemstone' : 'Jewelry';

                meta.appendChild(title);
                meta.appendChild(label);
                link.appendChild(img);
                link.appendChild(meta);
                results.appendChild(link);
            });

            results.classList.add('is-active');
        };

        const runSearch = async () => {
            const query = input.value.trim().toLowerCase();
            if (query.length < 2) {
                clearResults();
                return;
            }
            const index = await buildIndex();
            if (!index.length) {
                clearResults();
                return;
            }
            const terms = query.split(/\s+/).filter(Boolean);
            const matches = index.filter(item =>
                terms.every(term => item.searchText.includes(term))
            );
            renderResults(matches.slice(0, 6));
        };

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runSearch, 120);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) {
                runSearch();
            }
        });

        document.addEventListener('click', (e) => {
            if (!results.contains(e.target) && e.target !== input) {
                clearResults();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                clearResults();
                input.blur();
            }
        });
    };

    // --- 3. Smart Filtering Logic ---
    const filterLogic = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const grid = document.getElementById('jewelry-grid') || document.getElementById('gem-grid');

        const applyFilter = (filterValue, isAutoScroll = false) => {
            const cards = document.querySelectorAll('.jewelry-card');
            
            filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === filterValue);
            });

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('active'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });

            if (isAutoScroll && window.innerWidth < 768 && grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        filterBtns.forEach(btn => {
            btn.onclick = () => applyFilter(btn.getAttribute('data-filter'), true);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) applyFilter(filterParam);
    };

    // --- 4. Detail Drawer Logic ---
    const drawerLogic = () => {
        const drawer = document.getElementById('detail-drawer');
        if (!drawer) return;

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.inquire-btn, .view-detail-btn');
            const cardTrigger = window.matchMedia('(max-width: 768px)').matches
                ? e.target.closest('.product-card[data-title]')
                : null;
            if (!trigger && !cardTrigger) return;

            // On mobile, hide button and open from card tap; avoid double-handling.
            if (cardTrigger && trigger && trigger.classList.contains('view-detail-btn')) return;

            const source = trigger || cardTrigger;
            const b = source.dataset;
            if (typeof openDetailDrawer === 'function') {
                openDetailDrawer({
                    name: b.title,
                    price: b.price,
                    description: b.desc,
                    image: b.img,
                    weight: b.weight,
                    origin: b.origin,
                    treatment: b.treatment,
                    certification: b.certification,
                    type: b.type,
                    category: b.category,
                    material: b.material
                });
                return;
            }
            // Defensive: ensure drawer opens and scroll locks if openDetailDrawer is missing.
            drawer.style.display = '';
            drawer.classList.add('active');
            drawer.setAttribute('aria-hidden', 'false');
            toggleBodyScroll(true);
        });

        const closeDrawer = () => {
            drawer.classList.remove('active');
            drawer.style.display = '';
            drawer.setAttribute('aria-hidden', 'true');
            toggleBodyScroll(false);
        };

        const closeBtn = document.querySelector('.drawer-close');
        if (closeBtn) {
            closeBtn.onclick = closeDrawer;
            closeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeDrawer();
                }
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target.id === 'detail-drawer') closeDrawer();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('active')) {
                closeDrawer();
            }
        });
    };

    // --- 5. Mobile Filter Collapse (Collections Pages) ---
    const mobileFilterToggle = () => {
        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
        const sidebars = document.querySelectorAll('.collection-sidebar');
        if (!sidebars.length) return;

        const setCollapsedState = (sidebar, toggleBtn, collapsed) => {
            sidebar.classList.toggle('mobile-filters-collapsed', collapsed);
            toggleBtn.setAttribute('aria-expanded', String(!collapsed));
            toggleBtn.textContent = collapsed ? 'Show Filters' : 'Hide Filters';
        };

        sidebars.forEach((sidebar) => {
            const toggleBtn = sidebar.querySelector('.filter-toggle-btn');
            if (!toggleBtn) return;

            if (isMobile()) {
                setCollapsedState(sidebar, toggleBtn, true);
            } else {
                setCollapsedState(sidebar, toggleBtn, false);
            }

            toggleBtn.addEventListener('click', () => {
                if (!isMobile()) return;
                const currentlyCollapsed = sidebar.classList.contains('mobile-filters-collapsed');
                setCollapsedState(sidebar, toggleBtn, !currentlyCollapsed);
            });
        });

        window.addEventListener('resize', () => {
            sidebars.forEach((sidebar) => {
                const toggleBtn = sidebar.querySelector('.filter-toggle-btn');
                if (!toggleBtn) return;
                if (!isMobile()) {
                    setCollapsedState(sidebar, toggleBtn, false);
                }
            });
        });
    };

    // --- INITIALIZATION ORCHESTRA ---
    navSlide(); 

    if (document.getElementById('detail-drawer')) {
        drawerLogic();
    }

    initNavSearch();
    mobileFilterToggle();
    initScrollReveal();
});
