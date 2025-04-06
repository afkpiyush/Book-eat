document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    let cart = {};
    
    // DOM Elements
    const categoryItems = document.querySelectorAll('.category-item');
    const menuCategories = document.querySelectorAll('.menu-category');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartToggleBtn = document.querySelector('.cart-toggle-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartCount = document.querySelector('.cart-count');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    // Category navigation
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all categories
            categoryItems.forEach(cat => {
                cat.classList.remove('active');
            });
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Show corresponding menu category
            const category = this.getAttribute('data-category');
            menuCategories.forEach(menu => {
                menu.classList.remove('active');
            });
            
            const targetMenu = document.getElementById(`${category}-menu`);
            if (targetMenu) {
                targetMenu.classList.add('active');
            }
        });
    });
    
    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('₹', '').replace('$', ''));
            const itemImage = menuItem.querySelector('.menu-item-image img').src;
            
            // Add to cart object
            if (!cart[itemId]) {
                cart[itemId] = {
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    quantity: 0,
                    image: itemImage
                };
            }
            
            cart[itemId].quantity++;
            
            // Save cart to localStorage
            saveCart();
            
            // Update UI
            updateCartCount();
            updateCartSidebar();
            updateItemQuantityDisplay(itemId);
            
            // Animation for add to cart button
            animateElement(this);
            
            // Show toast notification
            showToast('Item added to cart', 'success');
        });
    });
    
    // Quantity buttons in menu
    if (quantityBtns) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const menuItem = this.closest('.menu-item');
                const itemName = menuItem.querySelector('h3').textContent;
                const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('₹', '').replace('$', ''));
                const itemImage = menuItem.querySelector('.menu-item-image img').src;
                
                if (this.classList.contains('plus-btn')) {
                    // Add to cart object
                    if (!cart[itemId]) {
                        cart[itemId] = {
                            id: itemId,
                            name: itemName,
                            price: itemPrice,
                            quantity: 0,
                            image: itemImage
                        };
                    }
                    
                    cart[itemId].quantity++;
                    showToast('Item added to cart', 'success');
                } else if (this.classList.contains('minus-btn')) {
                    if (cart[itemId] && cart[itemId].quantity > 1) {
                        cart[itemId].quantity--;
                    } else if (cart[itemId] && cart[itemId].quantity === 1) {
                        delete cart[itemId];
                        showToast('Item removed from cart', 'success');
                    }
                }
                
                // Save cart to localStorage
                saveCart();
                
                // Update UI
                updateCartCount();
                updateCartSidebar();
                updateItemQuantityDisplay(itemId);
                
                // Animation
                animateElement(this);
            });
        });
    }
    
    // Toggle cart sidebar
    cartToggleBtn.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        updateCartSidebar();
    });
    
    closeCartBtn.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (Object.keys(cart).length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });
    
    // Helper Functions
    function updateCartCount() {
        let count = 0;
        
        for (const item in cart) {
            count += cart[item].quantity;
        }
        
        cartCount.textContent = count;
    }
    
    function updateCartSidebar() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const subtotalElement = document.querySelector('.subtotal-amount');
        const totalElement = document.querySelector('.total-amount');
        
        // Clear current items
        cartItemsContainer.innerHTML = '';
        
        // Calculate totals
        let subtotal = 0;
        
        // Add items to cart UI
        for (const itemId in cart) {
            const item = cart[itemId];
            subtotal += item.price * item.quantity;
            
            const cartItemHTML = `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="quantity-control">
                            <button class="quantity-btn minus-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus-btn" onclick="increaseQuantity('${item.id}')">+</button>
                            <span class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</span>
                        </div>
                    </div>
                    <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            
            cartItemsContainer.innerHTML += cartItemHTML;
        }
        
        // Calculate discount (10%)
        const discount = subtotal * 0.1;
        const total = subtotal - discount;
        
        // Update summary
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${total.toFixed(2)}`;
        
        // Show empty cart message if needed
        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            subtotalElement.textContent = '₹0.00';
            totalElement.textContent = '₹0.00';
        }
    }
    
    function updateItemQuantityDisplay(itemId) {
        const quantityElements = document.querySelectorAll(`.item-quantity[data-item-id="${itemId}"]`);
        
        if (quantityElements.length > 0) {
            const quantity = cart[itemId] ? cart[itemId].quantity : 0;
            
            quantityElements.forEach(element => {
                element.textContent = quantity;
            });
        }
    }
    
    function animateElement(element) {
        element.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    }
    
    // Define cart functions in global scope for the onclick handlers
    window.increaseQuantity = function(itemId) {
        if (cart[itemId]) {
            cart[itemId].quantity++;
            saveCart();
            updateCartCount();
            updateCartSidebar();
            updateItemQuantityDisplay(itemId);
        }
    };
    
    window.decreaseQuantity = function(itemId) {
        if (cart[itemId] && cart[itemId].quantity > 1) {
            cart[itemId].quantity--;
            saveCart();
            updateCartCount();
            updateCartSidebar();
            updateItemQuantityDisplay(itemId);
        } else if (cart[itemId] && cart[itemId].quantity === 1) {
            // If quantity is 1, remove the item
            removeFromCart(itemId);
        }
    };
    
    window.removeFromCart = function(itemId) {
        if (cart[itemId]) {
            delete cart[itemId];
            saveCart();
            updateCartCount();
            updateCartSidebar();
            updateItemQuantityDisplay(itemId);
            showToast('Item removed from cart', 'success');
        }
    };
    
    function saveCart() {
        localStorage.setItem('bookEatCart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('bookEatCart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCartCount();
                
                // Update all item quantity displays
                for (const itemId in cart) {
                    updateItemQuantityDisplay(itemId);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                cart = {};
            }
        }
    }
    
    function showToast(message, type = 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
        // Set toast content
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type === 'success' ? 'Success' : 'Error'}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                
                if (searchTerm === '' || itemName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize
    loadCart();
    
    // Set first category as active if none is active
    if (!document.querySelector('.category-item.active')) {
        const firstCategory = document.querySelector('.category-item');
        if (firstCategory) {
            firstCategory.click();
        }
    }
});
