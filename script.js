document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;

    /* =====================================================
       1. STICKY HEADER — glass state on scroll
       ===================================================== */
    const updateHeader = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    /* =====================================================
       2. MOBILE HAMBURGER MENU
       ===================================================== */
    const menuIsOpen = () => header.classList.contains('menu-open');

    const closeMenu = () => {
        header.classList.remove('menu-open');
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Buka menu');
    };

    navToggle.addEventListener('click', () => {
        const willOpen = !menuIsOpen();

        header.classList.toggle('menu-open', willOpen);
        body.classList.toggle('nav-open', willOpen);
        navToggle.setAttribute('aria-expanded', String(willOpen));
        navToggle.setAttribute('aria-label', willOpen ? 'Tutup menu' : 'Buka menu');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuIsOpen()) closeMenu();
    });

    /* =====================================================
       3. SCROLL REVEAL — staggered fade-in on scroll
       ===================================================== */
    const revealItems = document.querySelectorAll('.reveal');

    document.querySelectorAll('.stagger-group').forEach((group) => {
        const children = Array.from(group.querySelectorAll(':scope > .reveal'));

        children.forEach((child, index) => {
            child.style.setProperty('--reveal-delay', `${Math.min(index * 90, 450)}ms`);
        });
    });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    /* =====================================================
       4. SCROLL SPY — highlight active nav link
       ===================================================== */
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navAnchors = Array.from(document.querySelectorAll('.nav-link'));

    if ('IntersectionObserver' in window && sections.length) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navAnchors.forEach((anchor) => {
                    const isMatch = anchor.getAttribute('href') === `#${entry.target.id}`;

                    if (isMatch) {
                        anchor.setAttribute('aria-current', 'page');
                    } else {
                        anchor.removeAttribute('aria-current');
                    }
                });
            });
        }, {
            rootMargin: '-45% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach((section) => spyObserver.observe(section));
    }

    /* =====================================================
       5. LIGHTBOX — DED & maket images
       ===================================================== */
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalCaption = document.getElementById('lightbox-caption');
    const closeBtn = modal.querySelector('.close-lightbox');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    let lastFocusedElement = null;

    const openLightbox = (image) => {
        lastFocusedElement = document.activeElement;

        modalImg.src = image.currentSrc || image.src;
        modalImg.alt = image.alt || '';
        modalCaption.textContent = image.dataset.caption || image.alt || '';

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        body.classList.add('lightbox-open');

        closeBtn.focus();
    };

    const closeLightbox = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        body.classList.remove('lightbox-open');

        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };

    triggers.forEach((image) => {
        image.setAttribute('role', 'button');
        image.setAttribute('tabindex', '0');

        image.addEventListener('click', () => openLightbox(image));

        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(image);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeLightbox();
    });

    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            closeBtn.focus();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeLightbox();
        }
    });
});
