// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p style="color: var(--text-light); font-weight: 500;">Loading...</p>
    `;
    document.body.prepend(loadingOverlay);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => loadingOverlay.remove(), 500);
        }, 800);
    });

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(scrollProgress);
    const progressBar = scrollProgress.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.trust-item, .featured-card, .value-card, .product-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Parallax Effect on Hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Sticky Header
    const mainHeader = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            mainHeader.style.boxShadow = '0 5px 30px rgba(255, 182, 193, 0.3)';
        } else {
            mainHeader.style.boxShadow = '0 2px 20px rgba(255, 182, 193, 0.2)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#whatsapp') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Fade In on Scroll Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.testimonial-card').forEach(el => {
        observer.observe(el);
    });
    
    // Ripple Effect on Buttons
    document.querySelectorAll('.btn, .filter-btn').forEach(button => {
        button.classList.add('ripple');
    });

    // Smooth Image Loading
    const images = document.querySelectorAll('img[loading]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    const parent = img.closest('.product-image, .featured-image, .gallery-item');
                    if (parent) parent.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    const parent = img.closest('.product-image, .featured-image, .gallery-item');
                    if (parent) parent.classList.add('error');
                });
                if (img.complete) {
                    img.classList.add('loaded');
                    const parent = img.closest('.product-image, .featured-image, .gallery-item');
                    if (parent) parent.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    images.forEach(img => imageObserver.observe(img));
    
    // WhatsApp Button Click Handling
    document.querySelectorAll('.whatsapp-btn, .whatsapp-float').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href') === '#whatsapp') {
                e.preventDefault();
                window.open('https://wa.me/212XXXXXXXXX?text=Hello%20RawaqIntissar,%20I\'m%20interested%20in%20your%20products', '_blank');
            }
        });
    });
    
    // Update active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Add floating animation to trust icons
    document.querySelectorAll('.trust-icon, .value-icon').forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
        icon.classList.add('floating');
    });

    // Scroll to Top Button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Enhanced scroll behavior for mobile
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                mainHeader.style.transform = 'translateY(-100%)';
            } else {
                mainHeader.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });

    // Enhanced Newsletter Form with validation
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.style.border = '2px solid #ff4444';
                setTimeout(() => {
                    emailInput.style.border = '';
                }, 2000);
                return;
            }
            
            // Success animation
            const submitBtn = newsletterForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            submitBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                newsletterForm.reset();
            }, 3000);
        });
        
        // Real-time validation feedback
        emailInput.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#4CAF50';
            } else if (emailInput.value) {
                emailInput.style.borderColor = '#ff4444';
            } else {
                emailInput.style.borderColor = '';
            }
        });
    }
});
