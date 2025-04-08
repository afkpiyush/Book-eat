document.addEventListener('DOMContentLoaded', function () {
    let usersDatabase = {};

    // Fetch the external JSON file
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            usersDatabase = data;
        })
        .catch(error => {
            console.error("Error loading users database:", error);
        });

    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('partnerGrn');

    passwordToggle.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const grn = document.getElementById('grnInput').value.trim();
        const partnerGrn = passwordInput.value.trim();

        if (usersDatabase[grn] && usersDatabase[grn] === partnerGrn) {
            window.location.href = 'choose-canteen.html';
        } else {
            alert('Invalid GRN or Partner GRN. Please try again.');
        }
    });

    const formControls = document.querySelectorAll('.form-control');

    formControls.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('input-focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('input-focused');
            }
        });
    });
});
