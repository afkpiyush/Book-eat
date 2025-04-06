document.addEventListener('DOMContentLoaded', function() {
    // Simulated database of users
    const usersDatabase = {
        "piyush.patil24@vit.edu": "12410626",
        "user@college.com": "securePass",
        "soham.hundlani24@vit.edu": "12412713"
    };

    // Password visibility toggle
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = passwordToggle.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('collegeEmail').value;
        const password = passwordInput.value;
        
        // Check credentials against the simulated database
        if (usersDatabase[email] && usersDatabase[email] === password) {
            // Redirect to choose-canteen.html on successful login
            window.location.href = 'choose-canteen.html';
        } else {
            // Show an error message for incorrect credentials
            alert('Invalid email or password. Please try again.');
        }
    });
    
    // Add animation effects
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('input-focused');
            }
        });
    });
});
