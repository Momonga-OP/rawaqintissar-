// Contact Form Functionality
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Here you would normally send data to backend
            console.log('Form submitted:', formData);
            
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.classList.add('active');
            
            // Reset form after 3 seconds and show it again
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'block';
                formSuccess.classList.remove('active');
            }, 3000);
        });
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.style.borderColor = '#ff4444';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            input.addEventListener('focus', () => {
                input.style.borderColor = '';
            });
        });
    }
});
