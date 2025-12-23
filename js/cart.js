// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.attachEventListeners();
        this.addProductAttributes();
    }

    // Add product attributes to all product cards
    addProductAttributes() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            if (!card.hasAttribute('data-product-id')) {
                const img = card.querySelector('img');
                const category = card.getAttribute('data-category') || 'product';
                const imgSrc = img ? img.getAttribute('src') : '';
                const altText = img ? img.getAttribute('alt') : `Product ${index + 1}`;
                
                // Set product attributes
                card.setAttribute('data-product-id', index + 1);
                card.setAttribute('data-product-name', this.generateProductName(category, index + 1));
                card.setAttribute('data-product-image', imgSrc);
                
                // Add cart button if not exists
                if (!card.querySelector('.product-actions')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'product-actions';
                    actionsDiv.innerHTML = `
                        <button class="btn-add-cart" data-translate="add_to_cart">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    `;
                    card.appendChild(actionsDiv);
                }
            }
        });
    }

    generateProductName(category, number) {
        const categoryNames = {
            'womens': 'Women\'s Pajama',
            'lingeries': 'Lingerie Set',
            'towels': 'Towel'
        };
        return `${categoryNames[category] || 'Product'} #${number}`;
    }

    attachEventListeners() {
        // Cart button click
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Cart close button
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Cart overlay
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Add to cart buttons (event delegation)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-cart')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            }

            // Remove from cart
            if (e.target.closest('.cart-item-remove')) {
                const productId = e.target.closest('.cart-item-remove').getAttribute('data-product-id');
                this.removeFromCart(productId);
            }

            // Quantity change
            if (e.target.closest('.qty-btn')) {
                const btn = e.target.closest('.qty-btn');
                const productId = btn.getAttribute('data-product-id');
                const action = btn.getAttribute('data-action');
                this.updateQuantity(productId, action);
            }
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.showOrderConfirmation());
        }
    }

    showOrderConfirmation() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'order-confirm-modal';
        modal.innerHTML = `
            <div class="order-confirm-content">
                <div class="order-confirm-header">
                    <i class="fas fa-clipboard-check"></i>
                    <h2>Confirm Your Order</h2>
                    <p style="color: var(--text-light); font-size: 14px;">Review your order before sending</p>
                </div>
                <div class="order-confirm-body">
                    ${this.cart.map((item, index) => `
                        <div class="order-summary-item">
                            <div class="order-summary-details">
                                <h4>${index + 1}. ${item.name}</h4>
                                <p>Size: <strong>${item.size}</strong> | Quantity: <strong>${item.quantity}</strong></p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Total Items: ${this.cart.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
                <div class="order-confirm-actions">
                    <button class="btn btn-secondary" id="cancel-order">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn btn-primary" id="confirm-order">
                        <i class="fab fa-whatsapp"></i> Send to WhatsApp
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Add event listeners
        const cancelBtn = modal.querySelector('#cancel-order');
        const confirmBtn = modal.querySelector('#confirm-order');
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };
        
        cancelBtn.addEventListener('click', closeModal);
        confirmBtn.addEventListener('click', () => {
            closeModal();
            this.sendToWhatsApp();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    addToCart(productCard) {
        const productId = productCard.getAttribute('data-product-id');
        const productName = productCard.getAttribute('data-product-name');
        const productImage = productCard.getAttribute('data-product-image');

        // Check if product already in cart
        const existingProduct = this.cart.find(item => item.id === productId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                image: productImage,
                quantity: 1,
                size: 'M' // Default size
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('Product added to cart!');
        
        // Open cart sidebar
        this.openCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, action) {
        const product = this.cart.find(item => item.id === productId);
        if (product) {
            if (action === 'increase') {
                product.quantity += 1;
            } else if (action === 'decrease') {
                product.quantity = Math.max(1, product.quantity - 1);
            }
            this.saveCart();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        // Update cart count
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart items
        const cartItems = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartFooter = document.getElementById('cart-footer');

        if (this.cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartItems) cartItems.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartItems) cartItems.style.display = 'block';
            if (cartFooter) cartFooter.style.display = 'block';

            // Render cart items
            if (cartItems) {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <div class="cart-item-size">
                                <label>Size:</label>
                                <select class="size-select" data-product-id="${item.id}">
                                    <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
                                    <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
                                    <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
                                    <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                                    <option value="XXL" ${item.size === 'XXL' ? 'selected' : ''}>XXL</option>
                                </select>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="qty-btn" data-product-id="${item.id}" data-action="decrease">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" data-product-id="${item.id}" data-action="increase">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-product-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');

                // Add event listeners for size selects
                const sizeSelects = cartItems.querySelectorAll('.size-select');
                sizeSelects.forEach(select => {
                    select.addEventListener('change', (e) => {
                        const productId = e.target.getAttribute('data-product-id');
                        const newSize = e.target.value;
                        this.updateSize(productId, newSize);
                    });
                });
            }

            // Update total count
            const totalCount = document.getElementById('cart-total-count');
            if (totalCount) {
                totalCount.textContent = totalItems;
            }
        }
    }

    updateSize(productId, newSize) {
        const product = this.cart.find(item => item.id === productId);
        if (product) {
            product.size = newSize;
            this.saveCart();
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            const isOpen = cartSidebar.classList.contains('active');
            if (isOpen) {
                this.closeCart();
            } else {
                this.openCart();
            }
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar) cartSidebar.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    sendToWhatsApp() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const phoneNumber = '212614866647';
        const websiteURL = window.location.origin;
        
        // Create formatted order message
        let message = '═══════════════════════\n';
        message += '🛍️ *NEW ORDER - RAWAQINTISSAR*\n';
        message += '═══════════════════════\n\n';
        
        message += '📅 *Order Date:* ' + new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + '\n\n';
        
        message += '━━━━━━━━━━━━━━━━━━━━━\n';
        message += '📦 *ORDER DETAILS*\n';
        message += '━━━━━━━━━━━━━━━━━━━━━\n\n';

        this.cart.forEach((item, index) => {
            message += `*${index + 1}. ${item.name}*\n`;
            message += `   👗 Product: ${item.name}\n`;
            message += `   📏 Size: ${item.size}\n`;
            message += `   🔢 Quantity: ${item.quantity}\n`;
            if (item.image) {
                const fullImageURL = item.image.startsWith('http') ? item.image : `${websiteURL}/${item.image}`;
                message += `   🖼️ Image: ${fullImageURL}\n`;
            }
            message += `\n`;
        });

        message += '━━━━━━━━━━━━━━━━━━━━━\n';
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        message += `✨ *TOTAL ITEMS:* ${totalItems}\n`;
        message += '━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        message += '📍 *Customer Information Needed:*\n';
        message += '• Full Name:\n';
        message += '• Phone Number:\n';
        message += '• Delivery Address:\n';
        message += '• City:\n\n';
        
        message += '💬 *Additional Notes:*\n';
        message += '(Please add any special requests here)\n\n';
        
        message += '═══════════════════════\n';
        message += '🌐 Visit: rawaqintissar.shop\n';
        message += '📧 Email: rawaqintissar@gmail.com\n';
        message += '═══════════════════════\n';

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
        
        // Show success message
        this.showNotification('Order sent to WhatsApp! 🎉');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    saveCart() {
        localStorage.setItem('rawaqintissar_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('rawaqintissar_cart');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});
