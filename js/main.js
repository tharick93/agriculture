/* ==========================================================================
   STACKLY AGRICULTURE WEBSITE - COMMON SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navbar.classList.toggle('open');
            // Disable scroll when mobile menu is open
            if (navbar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close navbar when nav links are clicked (useful for anchors)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navbar.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Sticky Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    // 3. Scroll Reveal Animations (Scroll Observer)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                // Reveal when element is 150px within the viewport
                if (elementTop < windowHeight - 100) {
                    el.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Trigger initial check
    }

    // 4. Counter Animation for Statistics
    const counterElements = document.querySelectorAll('.stat-number');
    if (counterElements.length > 0) {
        const animateCounters = () => {
            counterElements.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // ~60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current).toLocaleString() + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target.toLocaleString() + suffix;
                    }
                };
                
                updateCounter();
            });
        };

        // Trigger counters when they come into view
        const statsSection = document.querySelector('.stats-bar');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.unobserve(statsSection);
                }
            }, { threshold: 0.5 });
            observer.observe(statsSection);
        } else {
            // Fallback: run immediately if stats section is not structured as .stats-bar
            animateCounters();
        }
    }

    // 5. Testimonial Carousel/Slider
    const track = document.querySelector('.testimonials-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const dotsContainer = document.querySelector('.slider-dots');

    if (track && slides.length > 0 && dotsContainer) {
        // Clear existing dots first
        dotsContainer.innerHTML = '';
        
        // Create dots dynamically
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
        let currentSlideIndex = 0;

        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots[currentSlideIndex].classList.remove('active');
            dots[index].classList.add('active');
            currentSlideIndex = index;
        };

        // Auto play testimonial slider every 5 seconds
        let autoPlayTimer = setInterval(() => {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        }, 5000);

        // Pause autoplay on hover
        const wrapper = document.querySelector('.testimonials-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            wrapper.addEventListener('mouseleave', () => {
                autoPlayTimer = setInterval(() => {
                    let nextIndex = (currentSlideIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                }, 5000);
            });
        }
    }
});
