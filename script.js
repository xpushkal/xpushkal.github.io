/* ========================================
   JavaScript - Pushkal's Portfolio
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
});

/* ========================================
   Navigation Toggle (Mobile)
   ======================================== */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ========================================
   Navbar Scroll Effect
   ======================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Smooth Scroll for Navigation Links
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Scroll Reveal Animations
   ======================================== */
function initScrollAnimations() {
    // Add reveal class to elements we want to animate
    const animatedElements = document.querySelectorAll(
        '.section-title, .glass-card, .about-content, .about-stats, ' +
        '.skill-category, .timeline-item, .project-card, .education-card, ' +
        '.achievement-item, .contact-content'
    );

    animatedElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   Active Navigation Link Highlighting
   ======================================== */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   Typing Effect (Optional - for hero)
   ======================================== */
function initTypingEffect() {
    const text = "AIML Developer & Data Science Enthusiast";
    const element = document.querySelector('.hero-subtitle');

    if (!element) return;

    element.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }

    // Start typing after hero animation completes
    setTimeout(type, 1000);
}

/* ========================================
   Parallax Effect (Subtle)
   ======================================== */
function initParallax() {
    const heroGradient = document.querySelector('.hero-gradient');

    if (!heroGradient) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        heroGradient.style.transform = `rotate(${scrollY * 0.01}deg)`;
    });
}

// Initialize parallax
document.addEventListener('DOMContentLoaded', initParallax);
