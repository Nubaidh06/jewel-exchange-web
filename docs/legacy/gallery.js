document.addEventListener('DOMContentLoaded', () => {
    const siteConfig = window.JE_CONFIG || {};
    const whatsappNumber = siteConfig.whatsappNumber || '94773534538';
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.jewelry-card');
    const drawer = document.getElementById('detail-drawer');
    const closeDrawer = document.querySelector('.drawer-close');

    // --- Filtering Logic ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // --- Drawer Logic ---
    const inquireBtns = document.querySelectorAll('.inquire-btn');
    const drawerImg = document.getElementById('drawer-img');
    const drawerTitle = document.getElementById('drawer-title');
    const drawerDesc = document.getElementById('drawer-desc');
    const whatsappLink = document.getElementById('whatsapp-link');

    inquireBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');
            const img = btn.getAttribute('data-img');

            drawerImg.src = img;
            drawerTitle.innerText = title;
            drawerDesc.innerText = desc;
            
            // Pre-filled WhatsApp link
            const message = encodeURIComponent(`Hi Jewel Exchange, I'm interested in the ${title}. Could you provide more details?`);
            whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${message}`;

            drawer.classList.add('active');
        });
    });

    closeDrawer.addEventListener('click', () => {
        drawer.classList.remove('active');
    });
});
