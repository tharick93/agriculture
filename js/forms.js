/* ==========================================================================
   STACKLY AGRICULTURE WEBSITE - FORM VALIDATION & ACCORDION SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. FAQ Accordion Toggle Actions
    // ==========================================================================
    const faqHeaders = document.querySelectorAll('.faq-header');
    if (faqHeaders.length > 0) {
        faqHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isOpen = item.classList.contains('open');
                
                // Close all other items first for accordion effect
                document.querySelectorAll('.faq-item').forEach(i => {
                    i.classList.remove('open');
                    const content = i.querySelector('.faq-content');
                    if (content) content.style.maxHeight = null;
                });
                
                // Toggle current item
                if (!isOpen) {
                    item.classList.add('open');
                    const content = item.querySelector('.faq-content');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // ==========================================================================
    // 2. Common Form Validation Helpers
    // ==========================================================================
    const setError = (element, message) => {
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('has-error');
            let errorText = formGroup.querySelector('.error-msg');
            if (!errorText) {
                errorText = document.createElement('div');
                errorText.className = 'error-msg';
                formGroup.appendChild(errorText);
            }
            errorText.innerText = message;
            errorText.style.display = 'block';
        }
    };

    const clearError = (element) => {
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
            const errorText = formGroup.querySelector('.error-msg');
            if (errorText) {
                errorText.style.display = 'none';
            }
        }
    };

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const isValidPhone = (phone) => {
        // Standard digits check (accepts spaces, hyphens, and plus signs)
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(phone.trim());
    };

    // ==========================================================================
    // 3. Password Visibility Toggle
    // ==========================================================================
    const togglePasswordButtons = document.querySelectorAll('.password-toggle-btn');
    togglePasswordButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.previousElementSibling;
            if (input && (input.type === 'password' || input.type === 'text')) {
                const icon = btn.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });

    // ==========================================================================
    // 4. Contact Form Validations
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const successBanner = document.querySelector('.success-banner');

            // Name validation
            if (!name.value.trim()) {
                setError(name, "Full Name is required.");
                isFormValid = false;
            } else if (name.value.trim().length < 3) {
                setError(name, "Name must be at least 3 characters.");
                isFormValid = false;
            } else {
                clearError(name);
            }

            // Email validation
            if (!email.value.trim()) {
                setError(email, "Email Address is required.");
                isFormValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                setError(email, "Please enter a valid email address.");
                isFormValid = false;
            } else {
                clearError(email);
            }

            // Phone validation
            if (!phone.value.trim()) {
                setError(phone, "Phone Number is required.");
                isFormValid = false;
            } else if (!isValidPhone(phone.value.trim())) {
                setError(phone, "Please enter a valid phone number (10+ digits).");
                isFormValid = false;
            } else {
                clearError(phone);
            }

            // Subject validation
            if (!subject.value.trim()) {
                setError(subject, "Subject is required.");
                isFormValid = false;
            } else {
                clearError(subject);
            }

            // Message validation
            if (!message.value.trim()) {
                setError(message, "Message content is required.");
                isFormValid = false;
            } else if (message.value.trim().length < 10) {
                setError(message, "Message must be at least 10 characters.");
                isFormValid = false;
            } else {
                clearError(message);
            }

            if (isFormValid) {
                // Show success banner
                if (successBanner) {
                    successBanner.innerText = "Thank you! Your message has been sent successfully. We will get back to you shortly.";
                    successBanner.style.display = 'block';
                    contactForm.reset();
                    // Scroll to success banner
                    successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        successBanner.style.display = 'none';
                    }, 6000);
                }
            }
        });
    }

    // ==========================================================================
    // 5. Registration Form Validations (Sign Up)
    // ==========================================================================
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const locationInput = document.getElementById('location');
            const terms = document.getElementById('terms');
            const successBanner = document.querySelector('.success-banner');

            // Find selected user type (User vs Farmer)
            const userTypeRadio = document.querySelector('input[name="userType"]:checked');
            const userType = userTypeRadio ? userTypeRadio.value : 'user';

            // Full Name validation
            if (!fullname.value.trim()) {
                setError(fullname, "Full Name is required.");
                isFormValid = false;
            } else {
                clearError(fullname);
            }

            // Email validation
            if (!email.value.trim()) {
                setError(email, "Email is required.");
                isFormValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                setError(email, "Please enter a valid email address.");
                isFormValid = false;
            } else {
                clearError(email);
            }

            // Phone validation
            if (!phone.value.trim()) {
                setError(phone, "Phone Number is required.");
                isFormValid = false;
            } else if (!isValidPhone(phone.value.trim())) {
                setError(phone, "Please enter a valid phone number.");
                isFormValid = false;
            } else {
                clearError(phone);
            }

            // Password validation
            if (!password.value) {
                setError(password, "Password is required.");
                isFormValid = false;
            } else if (password.value.length < 6) {
                setError(password, "Password must be at least 6 characters.");
                isFormValid = false;
            } else {
                clearError(password);
            }

            // Confirm Password validation
            if (!confirmPassword.value) {
                setError(confirmPassword, "Please confirm your password.");
                isFormValid = false;
            } else if (confirmPassword.value !== password.value) {
                setError(confirmPassword, "Passwords do not match.");
                isFormValid = false;
            } else {
                clearError(confirmPassword);
            }

            // Location validation
            if (!locationInput.value.trim()) {
                setError(locationInput, "Location is required.");
                isFormValid = false;
            } else {
                clearError(locationInput);
            }

            // Terms validation
            if (terms && !terms.checked) {
                setError(terms, "You must accept the Terms & Conditions.");
                isFormValid = false;
            } else if (terms) {
                clearError(terms);
            }

            if (isFormValid) {
                const userData = {
                    fullName: fullname.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    password: password.value,
                    location: locationInput.value.trim(),
                    userType: userType
                };

                // Call registry function from auth.js
                const result = registerUser(userData);
                
                if (result.success) {
                    if (successBanner) {
                        successBanner.innerText = result.message + " Redirecting to login page...";
                        successBanner.style.display = 'block';
                        signupForm.reset();
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    }
                } else {
                    setError(email, result.message);
                }
            }
        });
    }

    // ==========================================================================
    // 6. Login Form Validations
    // ==========================================================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const errorAlert = document.getElementById('login-error-alert');

            // Clear previous errors
            clearError(email);
            clearError(password);
            if (errorAlert) errorAlert.style.display = 'none';

            // Find selected login-as type (user vs admin)
            const roleRadio = document.querySelector('input[name="loginAs"]:checked');
            const roleType = roleRadio ? roleRadio.value : 'user';

            // Email validation
            if (!email.value.trim()) {
                setError(email, "Email is required.");
                isFormValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                setError(email, "Please enter a valid email address.");
                isFormValid = false;
            }

            // Password validation
            if (!password.value) {
                setError(password, "Password is required.");
                isFormValid = false;
            }

            if (isFormValid) {
                // Call login authentication function from auth.js
                const result = loginUser(email.value.trim(), password.value, roleType);
                
                if (result.success) {
                    window.location.href = result.redirect;
                } else {
                    if (errorAlert) {
                        errorAlert.innerText = result.message;
                        errorAlert.style.display = 'block';
                    } else {
                        // Fallback
                        setError(password, result.message);
                    }
                }
            }
        });
    }
});
