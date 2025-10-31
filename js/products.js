// Products Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Optimized Image Loading with Progressive Enhancement
    const images = document.querySelectorAll('img[loading="lazy"], img[loading="eager"]');
    const imageContainers = document.querySelectorAll('.product-image, .featured-image');
    
    // Create low-quality placeholder effect
    const createPlaceholder = (container) => {
        if (!container.classList.contains('has-placeholder')) {
            container.style.backgroundColor = '#f0f0f0';
            container.classList.add('has-placeholder');
        }
    };
    
    // Image load handler with fade-in effect
    const handleImageLoad = (img) => {
        img.classList.add('loaded');
        const container = img.closest('.product-image, .featured-image, .gallery-item');
        if (container) {
            container.classList.add('loaded');
            container.style.backgroundColor = 'transparent';
        }
    };
    
    // Handle images that are already loaded (cached)
    const checkImageLoaded = (img) => {
        // Check if image is complete AND has dimensions
        if (img.complete && img.naturalWidth > 0) {
            handleImageLoad(img);
            return true;
        }
        return false;
    };
    
    // Set up Intersection Observer for better lazy loading with priority queue
    if ('IntersectionObserver' in window) {
        // Aggressive preloading for first 6 images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const container = img.closest('.product-image, .featured-image, .gallery-item');
                    
                    if (container) {
                        createPlaceholder(container);
                    }
                    
                    // Check if already loaded
                    if (!checkImageLoaded(img)) {
                        // Add load and error listeners
                        img.addEventListener('load', () => handleImageLoad(img), { once: true });
                        img.addEventListener('error', () => {
                            console.warn('Image failed to load:', img.src);
                            // Make visible anyway to show broken image icon
                            img.style.opacity = '1';
                            if (container) {
                                container.classList.add('error');
                                container.classList.add('loaded');
                            }
                        }, { once: true });
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px', // Load images 100px before they come into view
            threshold: 0.01
        });
        
        images.forEach((img, index) => {
            const container = img.closest('.product-image, .featured-image, .gallery-item');
            if (container) {
                createPlaceholder(container);
            }
            
            // Check if image is already loaded (from cache)
            if (!checkImageLoaded(img)) {
                imageObserver.observe(img);
            }
        });
    } else {
        // Fallback for browsers without Intersection Observer
        images.forEach(img => {
            const container = img.closest('.product-image, .featured-image, .gallery-item');
            if (container) {
                createPlaceholder(container);
            }
            
            if (!checkImageLoaded(img)) {
                img.addEventListener('load', () => handleImageLoad(img), { once: true });
                img.addEventListener('error', () => {
                    img.style.opacity = '1';
                    if (container) {
                        container.classList.add('error');
                        container.classList.add('loaded');
                    }
                }, { once: true });
            }
        });
    }
    
    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Check URL parameters for category
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        const categoryButton = document.querySelector(`[data-category="${category}"]`);
        if (categoryButton) {
            categoryButton.click();
        }
    }
    
    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    
    zoomButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const imgSrc = btn.getAttribute('data-image');
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
