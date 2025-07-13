// Navbar scroll effect with modern transitions
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.boxShadow = 'none';
    }
});

// Mobile navigation with smooth transitions
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Add smooth transition
    navLinks.style.transition = 'all 0.3s ease';
    hamburger.style.transition = 'all 0.3s ease';
});

// Smooth scrolling with offset
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        const offset = 70; // Adjust based on navbar height
        
        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Optimized Intersection Observer with single trigger
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px' // Slightly larger rootMargin to trigger earlier
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Only add the class if it's not already animated
            if (!entry.target.classList.contains('animate')) {
                entry.target.classList.add('animate');
                
                // Add staggered animations
                if (entry.target.classList.contains('stagger')) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, index) => {
                        // Use requestAnimationFrame for better performance
                        requestAnimationFrame(() => {
                            item.style.willChange = 'opacity, transform';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        });
                    });
                }
                
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Add animation classes to elements
const animatedElements = document.querySelectorAll('[data-animate]');
animatedElements.forEach(el => {
    const animationType = el.dataset.animate;
    el.classList.add(`fade-${animationType}`);
    observer.observe(el);
});

// Enhanced parallax effect with multiple layers
const parallaxLayers = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxLayers.forEach(layer => {
        const speed = layer.dataset.speed || 0.5;
        const position = `center ${scrolled * speed}px`;
        layer.style.backgroundPosition = position;
    });
});

// Modern gallery interactions
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const img = item.querySelector('img');
        img.style.transform = 'scale(1.05) rotate(2deg)';
        img.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    item.addEventListener('mouseleave', () => {
        const img = item.querySelector('img');
        img.style.transform = 'scale(1) rotate(0)';
    });
});

// Gallery slider functionality has been removed as it's not being used

// Function to handle stat card animations
function initStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Add visible class with a slight delay for each card
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 150 * index);
    });

    // Initialize all counters
    initCounters();
}

// Function to animate a single counter
function animateCounter(counter, target, suffix = '') {
    const duration = 2000; // 2 seconds for counting
    const startTime = performance.now();
    let animationFrame;

    const updateCounter = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        // Format the number with proper thousands separators
        const formattedNumber = current > 1000 ? current.toLocaleString() : current;
        
        // Update the counter text with the suffix if provided
        counter.textContent = progress >= 1 ? 
            `${formattedNumber}${suffix}` : 
            `${formattedNumber}${suffix}`;
            
        if (progress < 1) {
            animationFrame = requestAnimationFrame(updateCounter);
        }
    };

    // Start the counter animation
    updateCounter(performance.now());
    
    // Mark as animated
    counter.dataset.animated = 'true';
    
    // Cleanup function
    return () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
}

// Function to initialize all counters
function initCounters() {
    // Initialize hero section guest counter
    const guestCounter = document.getElementById('guest-counter');
    if (guestCounter && !guestCounter.dataset.animated) {
        animateCounter(guestCounter, 6000, '+');
    }
    
    // Initialize event space counters
    const eventSpaceCounters = [
        { id: 'wedding-capacity', target: 6000, suffix: '+' },
        { id: 'conference-capacity', target: 200, suffix: '+' },
        { id: 'banquet-capacity', target: 300, suffix: '+' }
    ];
    
    eventSpaceCounters.forEach(counter => {
        const element = document.getElementById(counter.id);
        if (element && !element.dataset.animated) {
            animateCounter(element, counter.target, counter.suffix);
        }
    });
}

// Event Booking Form Handling
document.addEventListener('DOMContentLoaded', () => {
    initStatCards();
    
    const form = document.getElementById('eventBookingForm');
    const formDetails = document.getElementById('formDetails');
    const userDetails = document.getElementById('userDetails');
    let formSubmitted = false;
    
    if (form) {
        // Show details as user types
        form.addEventListener('input', () => {
            if (!formSubmitted) {
                updateFormDetails();
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset previous error states
            resetValidationErrors();
            
            // Validate all fields
            const isValid = validateForm();
            
            if (!isValid) {
                // Scroll to the first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            formSubmitted = true;
            
            // Get form values
            const formData = {
                name: form.fullName.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                eventType: form.eventType.options[form.eventType.selectedIndex].text,
                eventDate: form.eventDate.value,
                guestCount: form.guestCount.value,
                requirements: form.specialRequirements.value.trim()
            };
            
            // Update the details (for email only, not shown in UI)
            updateFormDetails();
            
            // Prepare email content to match userDetails format
            const subject = `BOOKING INQUIRY - ${formData.name.toUpperCase()}`;
            
            // Format the message to match userDetails section
            const userMessage = formData.requirements 
                ? formData.requirements 
                : 'No additional message provided.';
                
            const bookingDetails = [
                `Name: ${formData.name || 'Not provided'}`,
                `Email: ${formData.email || 'Not provided'}`,
                `Phone: ${formData.phone || 'Not provided'}`,
                `Event Type: ${formData.eventType || 'Not selected'}`,
                `Event Date: ${formData.eventDate || 'Not selected'}`,
                `Expected Guests: ${formData.guestCount || 'Not specified'}`
            ];
            
            // Create the email body with proper line breaks
            let body = userMessage + 
                      '%0D%0A%0D%0A----------------------------------------' +
                      '%0D%0A%0D%0ABOOKING DETAILS:' +
                      '%0D%0A----------------------------------------' +
                      '%0D%0A' + 
                      bookingDetails.join('%0D%0A%0D%0A');
            
            // Create and click an anchor element to match the REACH US section behavior
            const emailLink = document.createElement('a');
            emailLink.href = `mailto:info@aaryaconvention.com?subject=${subject}&body=${body}`;
            emailLink.className = 'email-link';
            emailLink.style.display = 'none';
            document.body.appendChild(emailLink);
            emailLink.click();
            document.body.removeChild(emailLink);
            
            // Keep the form data after submission
            formSubmitted = false;
            
            function validateForm() {
                let isValid = true;
                
                // Validate Full Name
                if (!form.fullName.value.trim()) {
                    showError(form.fullName, 'Please enter your full name');
                    isValid = false;
                }
                
                // Validate Email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!form.email.value.trim()) {
                    showError(form.email, 'Please enter your email address');
                    isValid = false;
                } else if (!emailRegex.test(form.email.value.trim())) {
                    showError(form.email, 'Please enter a valid email address');
                    isValid = false;
                }
                
                // Validate Phone
                const phoneRegex = /^[0-9]{10}$/;
                if (!form.phone.value.trim()) {
                    showError(form.phone, 'Please enter your phone number');
                    isValid = false;
                } else if (!phoneRegex.test(form.phone.value.trim().replace(/[^0-9]/g, ''))) {
                    showError(form.phone, 'Please enter a valid 10-digit phone number');
                    isValid = false;
                }
                
                // Validate Event Type
                if (!form.eventType.value) {
                    showError(form.eventType, 'Please select an event type');
                    isValid = false;
                }
                
                // Validate Event Date
                if (!form.eventDate.value) {
                    showError(form.eventDate, 'Please select an event date');
                    isValid = false;
                } else {
                    const selectedDate = new Date(form.eventDate.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        showError(form.eventDate, 'Please select a future date');
                        isValid = false;
                    }
                }
                
                // Validate Guest Count
                if (!form.guestCount.value) {
                    showError(form.guestCount, 'Please enter the number of guests');
                    isValid = false;
                } else if (parseInt(form.guestCount.value) <= 0) {
                    showError(form.guestCount, 'Number of guests must be greater than 0');
                    isValid = false;
                }
                
                return isValid;
            }
            
            function showError(input, message) {
                const formGroup = input.closest('.form-group');
                let errorElement = formGroup.querySelector('.error-message');
                
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    formGroup.appendChild(errorElement);
                }
                
                errorElement.textContent = message;
                input.classList.add('error');
            }
            
            function resetValidationErrors() {
                // Remove all error messages
                const errorMessages = form.querySelectorAll('.error-message');
                errorMessages.forEach(msg => msg.remove());
                
                // Remove error classes from inputs
                const errorInputs = form.querySelectorAll('.error');
                errorInputs.forEach(input => input.classList.remove('error'));
            }
        });
    }
    
    function updateFormDetails() {
        if (!form) return;
        
        // Still update the userDetails for email generation
        const userMessage = form.specialRequirements.value
            ? form.specialRequirements.value
            : 'No additional message provided.';
        
        const bookingDetails = [
            `Name: ${form.fullName.value || 'Not provided'}`,
            `Email: ${form.email.value || 'Not provided'}`,
            `Phone: ${form.phone.value || 'Not provided'}`,
            `Event Type: ${form.eventType.options[form.eventType.selectedIndex]?.text || 'Not selected'}`,
            `Event Date: ${form.eventDate.value || 'Not selected'}`,
            `Expected Guests: ${form.guestCount.value || 'Not specified'}`
        ];
        
        // Format for email (not displayed in UI)
        userDetails.innerHTML = 
            userMessage + 
            '\n\n----------------------------------------\n\n' +
            'BOOKING DETAILS:' +
            '\n----------------------------------------\n\n' +
            bookingDetails.join('\n\n');
            
        // Keep the form details hidden in the UI
        formDetails.style.display = 'none';
    }
});

// Video Section Click Handler
// Redesigned Virtual Tour Video Controls
const virtualTourVideo = document.getElementById('virtualTourVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

if (virtualTourVideo && playPauseBtn && fullscreenBtn) {
    // Ensure video is muted and plays inline for autoplay compatibility
    virtualTourVideo.muted = true;
    virtualTourVideo.playsInline = true;
    virtualTourVideo.autoplay = true;
    virtualTourVideo.loop = true;

    // Play/Pause toggle
    playPauseBtn.addEventListener('click', () => {
        if (virtualTourVideo.paused) {
            virtualTourVideo.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            virtualTourVideo.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Update icon if user uses native controls
    virtualTourVideo.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    virtualTourVideo.addEventListener('pause', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (virtualTourVideo.requestFullscreen) {
                virtualTourVideo.requestFullscreen();
            } else if (virtualTourVideo.webkitRequestFullscreen) {
                virtualTourVideo.webkitRequestFullscreen();
            } else if (virtualTourVideo.msRequestFullscreen) {
                virtualTourVideo.msRequestFullscreen();
            }
        }
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };
        
        // Prepare for submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send data to PHP backend
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.textContent = 'Message Sent!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            submitBtn.textContent = 'Error!';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
            console.error('Error:', error.message);
        }
    });
}

// Optimized scroll reveal with throttling and single trigger
let ticking = false;
const revealedElements = new Set();

function revealElements() {
    const elements = document.querySelectorAll('.reveal:not(.revealed)');
    if (!elements.length) return;
    
    elements.forEach(element => {
        if (revealedElements.has(element)) return;
        
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // Pixels from the bottom of the viewport
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active', 'revealed');
            revealedElements.add(element);
        }
    });
    
    // If all elements are revealed, remove the scroll listener
    if (revealedElements.size === document.querySelectorAll('.reveal').length) {
        window.removeEventListener('scroll', handleScroll);
    }
}

// Throttled scroll handler
function handleScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            revealElements();
            ticking = false;
        });
        ticking = true;
    }
}

// Initial reveal when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Run reveal once when page loads
    revealElements();
    
    // Set up scroll listener for future reveals
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run once more after a short delay to catch any elements that might have loaded late
    setTimeout(revealElements, 500);
});
