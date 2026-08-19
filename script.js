/* ============================================
   Digital Life Archive — Erfan Tajian
   Interactions & Behaviors
   ============================================ */

(function () {
    'use strict';

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorCircle = cursor?.querySelector('.cursor-circle');
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        circleX += (mouseX - circleX) * 0.12;
        circleY += (mouseY - circleY) * 0.12;

        if (cursorDot) {
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
        }
        if (cursorCircle) {
            cursorCircle.style.left = circleX + 'px';
            cursorCircle.style.top = circleY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }

    if (cursor && cursorDot && cursorCircle) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover effects
        const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-tag, .achievement-item, .focus-tag, .contact-link');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('cursor--hover');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('cursor--hover');
            });
        });

        animateCursor();
    }

    // --- Header Scroll State ---
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }

    // --- Mobile Menu ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Language Dropdown ---
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    document.querySelectorAll('.nav-langs').forEach(function (wrapper) {
        const btn = wrapper.querySelector('.nav-lang-btn');
        const dropdown = wrapper.querySelector('.lang-dropdown');
        if (!btn || !dropdown) return;

        function open() {
            wrapper.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }

        function close() {
            wrapper.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) {
                close();
            } else {
                open();
            }
        });

        // Open on hover (desktop only)
        if (canHover) {
            wrapper.addEventListener('mouseenter', open);
            wrapper.addEventListener('mouseleave', close);
        }

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) {
                close();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                close();
            }
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');

    function handleReveal() {
        const windowHeight = window.innerHeight;

        revealElements.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const revealPoint = windowHeight * 0.88;

            if (rect.top < revealPoint) {
                el.classList.add('revealed');
            }
        });
    }

    // --- Active Chapter Detection ---
    const chapters = document.querySelectorAll('.chapter');
    const progressChapter = document.getElementById('progressChapter');
    const chapterLabels = ['ROBOTICS', 'GAME DEV', 'WEB & ART', 'TEAMS', 'RECOVERY', 'AI'];

    function handleActiveChapter() {
        const windowHeight = window.innerHeight;

        chapters.forEach(function (chapter, index) {
            const rect = chapter.getBoundingClientRect();
            const chapterCenter = rect.top + rect.height / 2;

            if (chapterCenter > 0 && chapterCenter < windowHeight) {
                chapter.classList.add('active');
                if (progressChapter && chapterLabels[index]) {
                    progressChapter.textContent = chapterLabels[index];
                }
            } else {
                chapter.classList.remove('active');
            }
        });
    }

    // --- Progress Indicator ---
    const progressIndicator = document.getElementById('progressIndicator');
    const progressFill = document.getElementById('progressFill');
    const progressDot = document.getElementById('progressDot');
    const storySection = document.getElementById('story');

    function handleProgress() {
        if (!storySection || !progressFill || !progressDot || !progressIndicator) return;

        const storyRect = storySection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Show/hide based on story visibility
        if (storyRect.top < windowHeight && storyRect.bottom > 0) {
            progressIndicator.classList.add('visible');
        } else {
            progressIndicator.classList.remove('visible');
        }

        // Calculate progress
        const totalScroll = storyRect.height;
        const scrolled = Math.max(0, -storyRect.top);
        const progress = Math.min(1, Math.max(0, scrolled / totalScroll));

        progressFill.style.height = (progress * 100) + '%';
        progressDot.style.top = (progress * 100) + '%';
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Placeholder links like href="#" — nothing to scroll to
            if (href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Handler (throttled) ---
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                handleHeaderScroll();
                handleReveal();
                handleActiveChapter();
                handleProgress();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Initial calls ---
    handleReveal();
    handleHeaderScroll();
    handleActiveChapter();
    handleProgress();

    // --- Nav active link on scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

})();
