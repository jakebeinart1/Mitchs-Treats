// Order management and UI logic with improved workflow

class OrderManager {
    constructor() {
        this.cart = [];
        this.cartIdCounter = 0; // Unique ID for each cart item
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    // Render all products on the page
    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        grid.innerHTML = '';

        PRODUCTS.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });
    }

    // Create a product card element
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.productId = product.id;

        const minNote = product.minQuantity > 1
            ? `<div class="min-quantity-note">Minimum order: ${product.minQuantity}</div>`
            : '';

        // Image gallery HTML
        const hasMultipleImages = product.images.length > 1;
        const imageGalleryHTML = `
            <div class="product-image-container">
                ${hasMultipleImages ? '<button class="image-nav image-nav-prev" data-product-id="' + product.id + '">‹</button>' : ''}
                <img src="${product.images[0]}" alt="${product.name}" class="product-image" data-product-id="${product.id}" data-current-index="0">
                ${hasMultipleImages ? '<button class="image-nav image-nav-next" data-product-id="' + product.id + '">›</button>' : ''}
                ${hasMultipleImages ? '<div class="image-dots" id="dots-' + product.id + '"></div>' : ''}
            </div>
        `;

        card.innerHTML = `
            ${imageGalleryHTML}
            <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)} ${product.isKit ? '' : 'each'}</div>
                <p class="product-description">${product.description}</p>
                ${minNote}
            </div>
            <div class="product-controls">
                <div class="form-group">
                    <label for="quantity-${product.id}">Quantity</label>
                    <select id="quantity-${product.id}" class="quantity-select" data-product-id="${product.id}">
                        <option value="0">Select Quantity</option>
                        ${product.quantityOptions.map(qty =>
                            `<option value="${qty}">${qty}</option>`
                        ).join('')}
                    </select>
                </div>
                ${product.hasFlavorOptions ? `
                    <div class="form-group flavor-group hidden" id="flavor-group-${product.id}">
                        <label for="flavor-${product.id}">Flavor</label>
                        <select id="flavor-${product.id}" class="flavor-select" data-product-id="${product.id}">
                            <option value="">Select Flavor</option>
                            ${product.flavors.map(flavor =>
                                `<option value="${flavor}">${flavor}</option>`
                            ).join('')}
                        </select>
                    </div>
                ` : ''}
                <div class="add-to-order-container hidden" id="add-btn-container-${product.id}">
                    <button class="btn btn-add-to-order" data-product-id="${product.id}">Add to Order</button>
                </div>
            </div>
        `;

        // Add image navigation dots if multiple images
        if (hasMultipleImages) {
            const dotsContainer = card.querySelector(`#dots-${CSS.escape(product.id)}`);
            product.images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = index === 0 ? 'dot active' : 'dot';
                dot.dataset.index = index;
                dot.dataset.productId = product.id;
                dotsContainer.appendChild(dot);
            });
        }

        return card;
    }

    // Set up all event listeners
    setupEventListeners() {
        // Image navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('image-nav-prev')) {
                this.navigateImage(e.target.dataset.productId, -1);
            } else if (e.target.classList.contains('image-nav-next')) {
                this.navigateImage(e.target.dataset.productId, 1);
            } else if (e.target.classList.contains('dot')) {
                const index = parseInt(e.target.dataset.index);
                this.setImage(e.target.dataset.productId, index);
            }
        });

        // Quantity selects
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-select')) {
                this.handleQuantityChange(e.target);
            }
        });

        // Flavor selects
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('flavor-select')) {
                this.handleFlavorChange(e.target);
            }
        });

        // Add to Order button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-to-order')) {
                this.handleAddToOrder(e.target.dataset.productId);
            }
        });

        // Form submission
        const form = document.getElementById('order-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitOrder();
            });
        }

        // Clear order button
        const clearBtn = document.getElementById('clear-order-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearOrder());
        }
    }

    // Navigate through product images
    navigateImage(productId, direction) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product || product.images.length <= 1) return;

        const img = document.querySelector(`.product-image[data-product-id="${productId}"]`);
        let currentIndex = parseInt(img.dataset.currentIndex);

        currentIndex += direction;

        // Loop around
        if (currentIndex < 0) currentIndex = product.images.length - 1;
        if (currentIndex >= product.images.length) currentIndex = 0;

        this.setImage(productId, currentIndex);
    }

    // Set specific image
    setImage(productId, index) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const img = document.querySelector(`.product-image[data-product-id="${productId}"]`);
        img.src = product.images[index];
        img.dataset.currentIndex = index;

        // Update dots
        const dots = document.querySelectorAll(`.dot[data-product-id="${productId}"]`);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Handle quantity selection
    handleQuantityChange(select) {
        const productId = select.dataset.productId;
        const quantity = parseInt(select.value);
        const product = PRODUCTS.find(p => p.id === productId);

        if (!product) return;

        const addBtnContainer = document.getElementById(`add-btn-container-${productId}`);

        if (quantity === 0) {
            // Hide flavor and add button
            if (product.hasFlavorOptions) {
                const flavorGroup = document.getElementById(`flavor-group-${productId}`);
                flavorGroup.classList.add('hidden');
                document.getElementById(`flavor-${productId}`).value = '';
            }
            addBtnContainer.classList.add('hidden');
            return;
        }

        // Validate minimum quantity
        if (quantity < product.minQuantity) {
            alert(`Minimum order for ${product.name} is ${product.minQuantity}`);
            select.value = '0';
            addBtnContainer.classList.add('hidden');
            return;
        }

        // Show flavor dropdown if needed
        if (product.hasFlavorOptions) {
            const flavorGroup = document.getElementById(`flavor-group-${productId}`);
            flavorGroup.classList.remove('hidden');
            // Don't show add button yet - wait for flavor selection
        } else {
            // No flavor needed, show add button
            addBtnContainer.classList.remove('hidden');
        }
    }

    // Handle flavor selection
    handleFlavorChange(select) {
        const productId = select.dataset.productId;
        const flavor = select.value;
        const addBtnContainer = document.getElementById(`add-btn-container-${productId}`);

        if (flavor) {
            // Flavor selected, show add button
            addBtnContainer.classList.remove('hidden');
        } else {
            // No flavor, hide add button
            addBtnContainer.classList.add('hidden');
        }
    }

    // Handle Add to Order button
    handleAddToOrder(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const quantitySelect = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantitySelect.value);

        if (quantity === 0) return;

        let flavor = product.defaultFlavor || '';
        if (product.hasFlavorOptions) {
            const flavorSelect = document.getElementById(`flavor-${productId}`);
            flavor = flavorSelect.value;
            if (!flavor) {
                alert('Please select a flavor');
                return;
            }
        }

        // Add to cart with unique ID
        this.cartIdCounter++;
        this.cart.push({
            cartItemId: this.cartIdCounter,
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            flavor: flavor,
            price: product.price
        });

        // Reset the product card
        this.resetProductCard(productId);

        // Update cart display
        this.updateOrderSummary();

        // Show success feedback with animation
        const addBtn = document.querySelector(`.btn-add-to-order[data-product-id="${productId}"]`);
        const originalText = addBtn.textContent;

        // Create success animation
        addBtn.textContent = '✓ Added to Order!';
        addBtn.style.background = 'linear-gradient(135deg, #34C759 0%, #28A745 100%)';
        addBtn.style.transform = 'scale(1.05)';

        // Create a simple "pop" effect
        const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.style.animation = 'none';
            setTimeout(() => {
                productCard.style.animation = 'successPulse 0.6s ease-out';
            }, 10);
        }

        setTimeout(() => {
            addBtn.textContent = originalText;
            addBtn.style.background = '';
            addBtn.style.transform = '';
        }, 1500);
    }

    // Reset product card to initial state
    resetProductCard(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        // Reset quantity
        const quantitySelect = document.getElementById(`quantity-${productId}`);
        quantitySelect.value = '0';

        // Reset flavor if applicable
        if (product.hasFlavorOptions) {
            const flavorGroup = document.getElementById(`flavor-group-${productId}`);
            const flavorSelect = document.getElementById(`flavor-${productId}`);
            flavorGroup.classList.add('hidden');
            flavorSelect.value = '';
        }

        // Hide add button
        const addBtnContainer = document.getElementById(`add-btn-container-${productId}`);
        addBtnContainer.classList.add('hidden');
    }

    // Update the order summary display
    updateOrderSummary() {
        const summaryDiv = document.getElementById('order-summary');
        const totalDiv = document.getElementById('order-total');
        const submitBtn = document.getElementById('submit-order-btn');

        if (this.cart.length === 0) {
            summaryDiv.innerHTML = '<p class="empty-cart">Your cart is empty. Select items above to get started!</p>';
            totalDiv.style.display = 'none';
            submitBtn.disabled = true;
            return;
        }

        // Build summary HTML
        let summaryHTML = '';
        let totalItems = 0;
        let totalPrice = 0;

        this.cart.forEach(item => {
            const itemTotal = item.quantity * item.price;
            totalItems += item.quantity;
            totalPrice += itemTotal;

            summaryHTML += `
                <div class="summary-item">
                    <div class="item-details">
                        <div class="item-name">${item.productName}</div>
                        <div class="item-specs">
                            Quantity: ${item.quantity}
                            ${item.flavor ? ` • Flavor: ${item.flavor}` : ''}
                        </div>
                    </div>
                    <div class="item-actions">
                        <div class="item-price">$${itemTotal.toFixed(2)}</div>
                        <button class="btn-remove-item" data-cart-item-id="${item.cartItemId}" title="Remove">×</button>
                    </div>
                </div>
            `;
        });

        summaryDiv.innerHTML = summaryHTML;
        totalDiv.style.display = 'block';
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
        submitBtn.disabled = false;

        // Add event listeners for remove buttons
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeCartItem(parseInt(btn.dataset.cartItemId));
            });
        });
    }

    // Remove item from cart
    removeCartItem(cartItemId) {
        this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
        this.updateOrderSummary();
    }

    // Clear the entire order
    clearOrder() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your entire order?')) {
            this.cart = [];
            this.updateOrderSummary();
        }
    }

    // Validate form
    validateForm() {
        // Must have at least one item selected
        if (this.cart.length === 0) {
            alert('Please select at least one item to order');
            return false;
        }

        // Validate email
        const email = document.getElementById('customer-email').value.trim();
        if (!email) {
            alert('Please provide your email address');
            document.getElementById('customer-email').focus();
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please provide a valid email address');
            document.getElementById('customer-email').focus();
            return false;
        }

        // Validate phone
        const phone = document.getElementById('customer-phone').value.trim();
        if (!phone) {
            alert('Please provide your phone number');
            document.getElementById('customer-phone').focus();
            return false;
        }

        // Validate pickup date
        const pickupDate = document.getElementById('pickup-date').value;
        if (!pickupDate) {
            alert('Please select a pickup date');
            document.getElementById('pickup-date').focus();
            return false;
        }

        return true;
    }

    // Submit the order
    async submitOrder() {
        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.getElementById('submit-order-btn');
        const messageDiv = document.getElementById('order-message');

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Gather form data
        const orderData = {
            customer: {
                name: document.getElementById('customer-name').value.trim(),
                email: document.getElementById('customer-email').value.trim(),
                phone: document.getElementById('customer-phone').value.trim(),
                pickupDate: document.getElementById('pickup-date').value
            },
            items: this.cart,
            specialInstructions: document.getElementById('special-instructions').value.trim(),
            totalItems: this.cart.reduce((sum, item) => sum + item.quantity, 0)
        };

        try {
            const response = await fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                // Success!
                messageDiv.className = 'order-message success';
                messageDiv.textContent = '✅ Order submitted successfully! You will receive confirmation shortly.';

                // Clear the form and cart
                setTimeout(() => {
                    this.clearOrderComplete();
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to submit order');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            messageDiv.className = 'order-message error';
            messageDiv.textContent = `❌ ${error.message}. Please try again or call 281.236.3047`;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Order';
        }
    }

    // Clear form after successful submission
    clearOrderComplete() {
        this.cart = [];
        this.cartIdCounter = 0;

        // Reset all form fields
        document.getElementById('order-form').reset();

        // Reset all product cards
        PRODUCTS.forEach(product => {
            this.resetProductCard(product.id);
        });

        this.updateOrderSummary();

        // Re-enable submit button
        const submitBtn = document.getElementById('submit-order-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Order';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Clear success message after 5 seconds
        setTimeout(() => {
            const messageDiv = document.getElementById('order-message');
            messageDiv.className = 'order-message';
            messageDiv.textContent = '';
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderManager();
});
