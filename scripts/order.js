// Order management and UI logic with improved workflow

class OrderManager {
    constructor() {
        this.cart = [];
        this.cartIdCounter = 0; // Unique ID for each cart item
        this.cookieSelections = {}; // Track cookie selections for Cookie Gift Box
        this.designDescriptions = {}; // Track design descriptions for cakes
        this.fillingSelections = {}; // Track filling selections for Hamantaschen
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
    }

    // Get current holiday context
    getHoliday() {
        return typeof HOLIDAY !== 'undefined' ? HOLIDAY : 'General';
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

        // Cookie selection HTML for Cookie Gift Box
        let cookieSelectionHTML = '';
        if (product.hasCookieSelection && product.cookieOptions) {
            this.cookieSelections[product.id] = [];
            cookieSelectionHTML = `
                <div class="cookie-selection hidden" id="cookie-selection-${product.id}">
                    <div class="cookie-selection-title">Select 4 Cookie Types</div>
                    <div class="cookie-selection-count" id="cookie-count-${product.id}">0 of 4 selected</div>
                    <div class="cookie-options">
                        ${product.cookieOptions.map((option, index) => `
                            <div class="cookie-option" data-product-id="${product.id}" data-cookie="${option}">
                                <input type="checkbox" id="cookie-${product.id}-${index}" data-product-id="${product.id}" data-cookie="${option}">
                                <label for="cookie-${product.id}-${index}">${option}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Design description HTML for cakes
        let designDescriptionHTML = '';
        if (product.hasDesignDescription) {
            designDescriptionHTML = `
                <div class="design-description-group hidden" id="design-group-${product.id}">
                    <label for="design-${product.id}">Describe Your Design</label>
                    <textarea id="design-${product.id}" placeholder="Describe the design you'd like for your cake..." rows="3"></textarea>
                </div>
            `;
        }

        // Filling selection HTML for Hamantaschen (products with hasFillingSelection)
        let fillingSelectionHTML = '';
        if (product.hasFillingSelection && product.fillingOptions) {
            this.fillingSelections[product.id] = [];
            fillingSelectionHTML = `
                <div class="filling-selection hidden" id="filling-selection-${product.id}">
                    <div class="filling-selection-title">Select Up to 4 Fillings</div>
                    <div class="filling-selection-count" id="filling-count-${product.id}">0 of 4 selected</div>
                    <div class="filling-options">
                        ${product.fillingOptions.map((option, index) => `
                            <div class="filling-option" data-product-id="${product.id}" data-filling="${option}">
                                <input type="checkbox" id="filling-${product.id}-${index}" data-product-id="${product.id}" data-filling="${option}">
                                <label for="filling-${product.id}-${index}">${option}</label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            ${imageGalleryHTML}
            <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)} ${product.isKit ? '' : 'each'}</div>
                <p class="product-description">${product.description}</p>
                ${minNote}
            </div>
            <div class="product-controls">
                ${product.hasFlavorOptions ? `
                    <div class="form-group flavor-group" id="flavor-group-${product.id}">
                        <label for="flavor-${product.id}">Flavor</label>
                        <select id="flavor-${product.id}" class="flavor-select" data-product-id="${product.id}">
                            <option value="">Select Flavor</option>
                            ${product.flavors.map(flavor =>
                                `<option value="${flavor}">${flavor}</option>`
                            ).join('')}
                        </select>
                    </div>
                ` : ''}
                <div class="form-group ${product.hasFlavorOptions ? 'hidden' : ''}" id="quantity-group-${product.id}">
                    <label for="quantity-${product.id}">Quantity</label>
                    <select id="quantity-${product.id}" class="quantity-select" data-product-id="${product.id}">
                        <option value="0">Select Quantity</option>
                        ${product.quantityOptions.map(qty =>
                            `<option value="${qty}">${qty}</option>`
                        ).join('')}
                    </select>
                </div>
                ${cookieSelectionHTML}
                ${designDescriptionHTML}
                ${fillingSelectionHTML}
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

        // Cookie selection checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.cookie) {
                this.handleCookieSelectionChange(e.target);
            }
        });

        // Filling selection checkboxes (for Hamantaschen)
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.dataset.filling) {
                this.handleFillingSelectionChange(e.target);
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

    // Handle flavor selection (for products with flavor options)
    handleFlavorChange(select) {
        const productId = select.dataset.productId;
        const flavor = select.value;
        const quantityGroup = document.getElementById(`quantity-group-${productId}`);
        const product = PRODUCTS.find(p => p.id === productId);

        if (flavor) {
            // Flavor selected, show quantity dropdown
            quantityGroup.classList.remove('hidden');

            // Show/hide filling selection based on fillingTrigger
            if (product && product.hasFillingSelection && product.fillingTrigger) {
                const fillingSelection = document.getElementById(`filling-selection-${productId}`);
                if (fillingSelection) {
                    if (flavor === product.fillingTrigger) {
                        fillingSelection.classList.remove('hidden');
                    } else {
                        fillingSelection.classList.add('hidden');
                        // Reset filling selections when hidden
                        this.resetFillingSelection(productId);
                    }
                }
            }
        } else {
            // No flavor, hide quantity and add button
            quantityGroup.classList.add('hidden');
            const addBtnContainer = document.getElementById(`add-btn-container-${productId}`);
            addBtnContainer.classList.add('hidden');
            document.getElementById(`quantity-${productId}`).value = '0';

            // Hide filling selection
            if (product && product.hasFillingSelection) {
                const fillingSelection = document.getElementById(`filling-selection-${productId}`);
                if (fillingSelection) {
                    fillingSelection.classList.add('hidden');
                    this.resetFillingSelection(productId);
                }
            }
        }
    }

    // Reset filling selection for a product
    resetFillingSelection(productId) {
        this.fillingSelections[productId] = [];
        const fillingSelection = document.getElementById(`filling-selection-${productId}`);
        if (fillingSelection) {
            const checkboxes = fillingSelection.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            const options = fillingSelection.querySelectorAll('.filling-option');
            options.forEach(opt => opt.classList.remove('selected', 'disabled'));
            const countEl = document.getElementById(`filling-count-${productId}`);
            if (countEl) {
                countEl.textContent = '0 of 4 selected';
                countEl.classList.remove('valid', 'invalid');
            }
        }
    }

    // Handle cookie selection for Cookie Gift Box
    handleCookieSelectionChange(checkbox) {
        const productId = checkbox.dataset.productId;
        const cookieName = checkbox.dataset.cookie;
        const product = PRODUCTS.find(p => p.id === productId);

        if (!product || !product.hasCookieSelection) return;

        if (!this.cookieSelections[productId]) {
            this.cookieSelections[productId] = [];
        }

        if (checkbox.checked) {
            if (this.cookieSelections[productId].length < 4) {
                this.cookieSelections[productId].push(cookieName);
            } else {
                checkbox.checked = false;
                return;
            }
        } else {
            this.cookieSelections[productId] = this.cookieSelections[productId].filter(c => c !== cookieName);
        }

        // Update count display
        const countEl = document.getElementById(`cookie-count-${productId}`);
        const count = this.cookieSelections[productId].length;
        countEl.textContent = `${count} of 4 selected`;
        countEl.classList.remove('valid', 'invalid');
        if (count === 4) {
            countEl.classList.add('valid');
        } else if (count > 0) {
            countEl.classList.add('invalid');
        }

        // Update checkbox visual states
        const cookieOptions = document.querySelectorAll(`.cookie-option[data-product-id="${productId}"]`);
        cookieOptions.forEach(option => {
            const cb = option.querySelector('input[type="checkbox"]');
            option.classList.toggle('selected', cb.checked);
            option.classList.toggle('disabled', !cb.checked && count >= 4);
        });

        // Update add button visibility
        this.updateAddButtonVisibility(productId);
    }

    // Handle filling selection for Hamantaschen
    handleFillingSelectionChange(checkbox) {
        const productId = checkbox.dataset.productId;
        const fillingName = checkbox.dataset.filling;
        const product = PRODUCTS.find(p => p.id === productId);

        if (!product || !product.hasFillingSelection) return;

        if (!this.fillingSelections[productId]) {
            this.fillingSelections[productId] = [];
        }

        if (checkbox.checked) {
            if (this.fillingSelections[productId].length < 4) {
                this.fillingSelections[productId].push(fillingName);
            } else {
                checkbox.checked = false;
                return;
            }
        } else {
            this.fillingSelections[productId] = this.fillingSelections[productId].filter(f => f !== fillingName);
        }

        // Update count display
        const countEl = document.getElementById(`filling-count-${productId}`);
        const count = this.fillingSelections[productId].length;
        countEl.textContent = `${count} of 4 selected`;
        countEl.classList.remove('valid', 'invalid');
        if (count >= 1 && count <= 4) {
            countEl.classList.add('valid');
        }

        // Update checkbox visual states
        const fillingOptions = document.querySelectorAll(`.filling-option[data-product-id="${productId}"]`);
        fillingOptions.forEach(option => {
            const cb = option.querySelector('input[type="checkbox"]');
            option.classList.toggle('selected', cb.checked);
            option.classList.toggle('disabled', !cb.checked && count >= 4);
        });

        // Update add button visibility
        this.updateAddButtonVisibility(productId);
    }

    // Handle quantity selection
    handleQuantityChange(select) {
        const productId = select.dataset.productId;
        const quantity = parseInt(select.value);
        const product = PRODUCTS.find(p => p.id === productId);

        if (!product) return;

        const addBtnContainer = document.getElementById(`add-btn-container-${productId}`);

        if (quantity === 0) {
            addBtnContainer.classList.add('hidden');
            // Hide cookie selection and design description
            const cookieSelection = document.getElementById(`cookie-selection-${productId}`);
            const designGroup = document.getElementById(`design-group-${productId}`);
            if (cookieSelection) cookieSelection.classList.add('hidden');
            if (designGroup) designGroup.classList.add('hidden');
            return;
        }

        // Validate minimum quantity
        if (quantity < product.minQuantity) {
            alert(`Minimum order for ${product.name} is ${product.minQuantity}`);
            select.value = '0';
            addBtnContainer.classList.add('hidden');
            return;
        }

        // For products with flavors, check if flavor is selected
        if (product.hasFlavorOptions) {
            const flavorSelect = document.getElementById(`flavor-${productId}`);
            if (!flavorSelect.value) {
                alert('Please select a flavor first');
                select.value = '0';
                return;
            }
        }

        // Show cookie selection for Cookie Gift Box
        if (product.hasCookieSelection) {
            const cookieSelection = document.getElementById(`cookie-selection-${productId}`);
            if (cookieSelection) {
                cookieSelection.classList.remove('hidden');
            }
        }

        // Show design description for cakes
        if (product.hasDesignDescription) {
            const designGroup = document.getElementById(`design-group-${productId}`);
            if (designGroup) {
                designGroup.classList.remove('hidden');
            }
        }

        // Show filling selection for products with no trigger (like Hamantaschen Box)
        if (product.hasFillingSelection && product.fillingTrigger === null) {
            const fillingSelection = document.getElementById(`filling-selection-${productId}`);
            if (fillingSelection) {
                fillingSelection.classList.remove('hidden');
            }
        }

        // Update add button visibility
        this.updateAddButtonVisibility(productId);
    }

    // Update add button visibility based on all requirements
    updateAddButtonVisibility(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const addBtnContainer = document.getElementById(`add-btn-container-${productId}`);
        const quantitySelect = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantitySelect.value);

        if (quantity === 0) {
            addBtnContainer.classList.add('hidden');
            return;
        }

        // Check cookie selection requirement
        if (product.hasCookieSelection) {
            const count = this.cookieSelections[productId]?.length || 0;
            if (count !== 4) {
                addBtnContainer.classList.add('hidden');
                return;
            }
        }

        // Check filling selection requirement
        if (product.hasFillingSelection) {
            // Check if filling selection should be visible
            const fillingSelection = document.getElementById(`filling-selection-${productId}`);
            if (fillingSelection && !fillingSelection.classList.contains('hidden')) {
                const count = this.fillingSelections[productId]?.length || 0;
                if (count < 1) {
                    addBtnContainer.classList.add('hidden');
                    return;
                }
            }
        }

        // All requirements met
        addBtnContainer.classList.remove('hidden');
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

        // Get cookie selections for Cookie Gift Box
        let cookieSelection = null;
        if (product.hasCookieSelection) {
            cookieSelection = this.cookieSelections[productId] || [];
            if (cookieSelection.length !== 4) {
                alert('Please select exactly 4 cookie types');
                return;
            }
        }

        // Get design description for cakes
        let designDescription = null;
        if (product.hasDesignDescription) {
            const designTextarea = document.getElementById(`design-${productId}`);
            designDescription = designTextarea?.value.trim() || '';
        }

        // Get filling selections for Hamantaschen
        let fillingSelection = null;
        if (product.hasFillingSelection) {
            const fillingSelectionEl = document.getElementById(`filling-selection-${productId}`);
            if (fillingSelectionEl && !fillingSelectionEl.classList.contains('hidden')) {
                fillingSelection = this.fillingSelections[productId] || [];
                if (fillingSelection.length < 1) {
                    alert('Please select at least 1 filling');
                    return;
                }
            }
        }

        // Add to cart with unique ID
        this.cartIdCounter++;
        const cartItem = {
            cartItemId: this.cartIdCounter,
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            flavor: flavor,
            price: product.price
        };

        if (cookieSelection) {
            cartItem.cookieSelection = cookieSelection;
        }

        if (designDescription) {
            cartItem.designDescription = designDescription;
        }

        if (fillingSelection && fillingSelection.length > 0) {
            cartItem.fillingSelection = fillingSelection;
        }

        this.cart.push(cartItem);

        // Reset the product card
        this.resetProductCard(productId);

        // Update cart display
        this.updateOrderSummary();

        // Show success feedback with animation
        const addBtn = document.querySelector(`.btn-add-to-order[data-product-id="${productId}"]`);
        const originalText = addBtn.textContent;

        // Create success animation
        addBtn.textContent = 'Added!';
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
        const quantityGroup = document.getElementById(`quantity-group-${productId}`);
        quantitySelect.value = '0';

        // Reset flavor if applicable
        if (product.hasFlavorOptions) {
            const flavorSelect = document.getElementById(`flavor-${productId}`);
            flavorSelect.value = '';
            quantityGroup.classList.add('hidden');
        }

        // Reset cookie selection
        if (product.hasCookieSelection) {
            this.cookieSelections[productId] = [];
            const cookieSelection = document.getElementById(`cookie-selection-${productId}`);
            if (cookieSelection) {
                cookieSelection.classList.add('hidden');
                const checkboxes = cookieSelection.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = false);
                const options = cookieSelection.querySelectorAll('.cookie-option');
                options.forEach(opt => opt.classList.remove('selected', 'disabled'));
                const countEl = document.getElementById(`cookie-count-${productId}`);
                if (countEl) {
                    countEl.textContent = '0 of 4 selected';
                    countEl.classList.remove('valid', 'invalid');
                }
            }
        }

        // Reset design description
        if (product.hasDesignDescription) {
            const designGroup = document.getElementById(`design-group-${productId}`);
            const designTextarea = document.getElementById(`design-${productId}`);
            if (designGroup) designGroup.classList.add('hidden');
            if (designTextarea) designTextarea.value = '';
        }

        // Reset filling selection
        if (product.hasFillingSelection) {
            const fillingSelection = document.getElementById(`filling-selection-${productId}`);
            if (fillingSelection) {
                fillingSelection.classList.add('hidden');
                this.resetFillingSelection(productId);
            }
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

            let specsHTML = `Quantity: ${item.quantity}`;
            if (item.flavor) {
                specsHTML += ` • ${item.flavor}`;
            }
            if (item.cookieSelection && item.cookieSelection.length > 0) {
                specsHTML += `<br>Cookies: ${item.cookieSelection.join(', ')}`;
            }
            if (item.fillingSelection && item.fillingSelection.length > 0) {
                specsHTML += `<br>Fillings: ${item.fillingSelection.join(', ')}`;
            }
            if (item.designDescription) {
                specsHTML += `<br>Design: ${item.designDescription}`;
            }

            summaryHTML += `
                <div class="summary-item">
                    <div class="item-details">
                        <div class="item-name">${item.productName}</div>
                        <div class="item-specs">${specsHTML}</div>
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

        // Validate pickup time for Valentines
        const pickupTimeEl = document.getElementById('pickup-time');
        if (pickupTimeEl && !pickupTimeEl.value) {
            alert('Please select a pickup time');
            pickupTimeEl.focus();
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

        // Get pickup time if available
        const pickupTimeEl = document.getElementById('pickup-time');
        const pickupTime = pickupTimeEl ? pickupTimeEl.value : null;

        // Gather form data
        const orderData = {
            customer: {
                name: document.getElementById('customer-name').value.trim(),
                email: document.getElementById('customer-email').value.trim(),
                phone: document.getElementById('customer-phone').value.trim(),
                pickupDate: document.getElementById('pickup-date').value,
                pickupTime: pickupTime
            },
            items: this.cart,
            specialInstructions: document.getElementById('special-instructions').value.trim(),
            totalItems: this.cart.reduce((sum, item) => sum + item.quantity, 0),
            holiday: this.getHoliday()
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
                messageDiv.textContent = 'Order submitted successfully! You will receive confirmation shortly.';

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
            messageDiv.textContent = `${error.message}. Please try again or call 281.236.3047`;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Order';
        }
    }

    // Clear form after successful submission
    clearOrderComplete() {
        this.cart = [];
        this.cartIdCounter = 0;
        this.cookieSelections = {};
        this.designDescriptions = {};
        this.fillingSelections = {};

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
