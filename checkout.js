document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = {};
    const savedCart = localStorage.getItem('bookEatCart');
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            populateOrderSummary(cart);
        } catch (error) {
            console.error('Error loading cart:', error);
            showEmptyState();
        }
    } else {
        showEmptyState();
    }
    
    // Generate random order number
    const orderNumber = document.getElementById('order-number');
    orderNumber.textContent = 'VIT' + Math.floor(Math.random() * 10000);
    
    // Handle Pay Now button click
    const payNowBtn = document.getElementById('pay-now-btn');
    payNowBtn.addEventListener('click', function() {
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get total amount
        const totalAmount = parseFloat(document.querySelector('.total-amount').textContent.replace('₹', ''));
        
        // Initialize Razorpay
        initRazorpay(totalAmount);
    });
    
    // Function to populate order summary
    function populateOrderSummary(cart) {
        const orderItemsContainer = document.querySelector('.order-items');
        const subtotalElement = document.querySelector('.subtotal-amount');
        const discountElement = document.querySelector('.discount-amount');
        const taxElement = document.querySelector('.tax-amount');
        const totalElement = document.querySelector('.total-amount');
        const payAmountElement = document.querySelector('.pay-amount');
        
        // Clear current items
        orderItemsContainer.innerHTML = '';
        
        // Calculate totals
        let subtotal = 0;
        
        // Add items to order summary
        for (const itemId in cart) {
            const item = cart[itemId];
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItemHTML = `
                <div class="order-item">
                    <div class="item-quantity">${item.quantity}</div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
                    </div>
                    <div class="item-total">₹${itemTotal.toFixed(2)}</div>
                </div>
            `;
            
            orderItemsContainer.innerHTML += orderItemHTML;
        }
        
        // Calculate additional charges
        const discount = subtotal * 0.1;
        const deliveryFee = 1.50;
        const tax = (subtotal - discount + deliveryFee) * 0.05;
        const total = subtotal - discount + deliveryFee + tax;
        
        // Update summary
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        discountElement.textContent = `-₹${discount.toFixed(2)}`;
        taxElement.textContent = `₹${tax.toFixed(2)}`;
        totalElement.textContent = `₹${total.toFixed(2)}`;
        payAmountElement.textContent = `₹${total.toFixed(2)}`;
        
        // Show empty state if needed
        if (Object.keys(cart).length === 0) {
            showEmptyState();
        }
    }
    
    // Function to show empty state
    function showEmptyState() {
        const orderItemsContainer = document.querySelector('.order-items');
        orderItemsContainer.innerHTML = `
            <div class="empty-state">
                <p>Your cart is empty. Please add items to your cart before checkout.</p>
                <a href="vit-menu.html" class="back-to-menu-btn">Back to Menu</a>
            </div>
        `;
        
        // Disable pay now button
        const payNowBtn = document.getElementById('pay-now-btn');
        payNowBtn.disabled = true;
        payNowBtn.style.opacity = '0.5';
        payNowBtn.style.cursor = 'not-allowed';
    }
    
    // Function to validate form
    function validateForm() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        
        if (!name || !phone || !email || !address) {
            alert('Please fill in all required fields');
            return false;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        // Simple phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }
        
        return true;
    }
    
    // Function to initialize Razorpay
    function initRazorpay(amount) {
        // Convert amount to paise (Razorpay uses smallest currency unit)
        const amountInPaise = Math.round(amount * 100);
        
        // Get customer details
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Razorpay options
        const options = {
            key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
            amount: amountInPaise,
            currency: 'INR',
            name: 'Book-Eat',
            description: 'Food Order Payment',
            image: 'images/vit-logo.png',
            handler: function(response) {
                // Payment successful
                alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                
                // Clear cart
                localStorage.removeItem('bookEatCart');
                
                // Redirect to success page
                window.location.href = 'payment-success.html';
            },
            prefill: {
                name: name,
                email: email,
                contact: phone
            },
            theme: {
                color: '#00C853'
            }
        };
        
        // Create Razorpay instance
        const rzp = new Razorpay(options);
        rzp.open();
    }
    
    // Add animation to payment option
    const paymentOption = document.querySelector('.payment-option');
    paymentOption.addEventListener('click', function() {
        this.classList.add('selected');
    });
});