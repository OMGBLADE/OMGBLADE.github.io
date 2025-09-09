// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize animated icons
    initAnimatedIcons();
    
    // Initialize typewriter effect
    initTypewriterEffect();
    
    // Initialize animations
    initScrollAnimations();
    
    // Initialize portfolio filters
    initPortfolioFilters();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize stats counter
    initStatsCounter();
    
    // Initialize skill bars
    initSkillBars();
}

// Smooth Scrolling with Lenis
function initSmoothScrolling() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Animated Icons (CSS-based replacement for 3D)
function initAnimatedIcons() {
    const icons = document.querySelectorAll('.icon-item');
    
    // Add pulsing glow effect
    icons.forEach((icon, index) => {
        let pulsePhase = index * Math.PI / 2; // Different phase for each icon
        
        function animatePulse() {
            const scale = 1 + Math.sin(Date.now() * 0.002 + pulsePhase) * 0.1;
            const glow = 0.3 + Math.sin(Date.now() * 0.003 + pulsePhase) * 0.2;
            
            // Get the icon's color
            const computedStyle = window.getComputedStyle(icon);
            const color = computedStyle.color;
            
            // Apply pulsing scale and glow
            icon.style.transform = `scale(${scale})`;
            icon.style.boxShadow = `0 8px 25px rgba(${color.match(/\d+/g).join(', ')}, ${glow})`;
            
            requestAnimationFrame(animatePulse);
        }
        
        animatePulse();
        
        // Enhanced hover effects
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(360deg)';
            icon.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transition = 'transform 0.4s ease';
            icon.style.transform = 'scale(1)';
        });
    });
    
    console.log('Enhanced animated icons initialized:', icons.length, 'icons found');
}

// Typewriter Effect for Hero Subtitle
function initTypewriterEffect() {
    const typewriterElement = document.querySelector('.typewriter-text');
    if (!typewriterElement) return;
    
    const professions = [
        'Video Editor',
        'Graphic Designer',
        'Colour Grader',
        'Videographer',
        'Motion Graphics Artist',
        'Creative Director'
    ];
    
    let currentProfessionIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const currentProfession = professions[currentProfessionIndex];
        
        if (isDeleting) {
            // Deleting characters
            typewriterElement.textContent = currentProfession.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50; // Faster deletion
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentProfessionIndex = (currentProfessionIndex + 1) % professions.length;
                typeSpeed = 500; // Pause before typing next word
            }
        } else {
            // Typing characters
            typewriterElement.textContent = currentProfession.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100; // Normal typing speed
            
            if (currentCharIndex === currentProfession.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause before deleting
            }
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start the typewriter effect
    typeWriter();
    
    console.log('Typewriter effect initialized with', professions.length, 'professions');
}

// Scroll Animations with GSAP
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Fade in elements on scroll
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.fromTo(element, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Service cards animation
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.fromTo(card, {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Portfolio items animation
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
        gsap.fromTo(item, {
            opacity: 0,
            scale: 0.8,
            rotation: 5
        }, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title, {
            opacity: 0,
            y: 30,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// Portfolio Filters
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    item.style.display = 'block';
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Enhanced Testimonial slider with creative animations
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const navDots = document.querySelectorAll('.nav-dot');
const testimonialTrack = document.querySelector('.testimonial-track');
const progressBar = document.querySelector('.progress-bar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateSlider(index, direction = 'next') {
    currentTestimonial = index;
    
    // Update track position with smooth animation
    const translateX = -index * 20; // 20% per slide
    if (testimonialTrack) {
        testimonialTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update active states
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
    
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Update progress bar
    if (progressBar) {
        const progressWidth = ((index + 1) / testimonials.length) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }
}

function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % testimonials.length;
    updateSlider(nextIndex, 'next');
}

function prevTestimonial() {
    const prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateSlider(prevIndex, 'prev');
}

// Button event listeners
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetAutoSlide();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetAutoSlide();
    });
}

// Navigation dots
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const direction = index > currentTestimonial ? 'next' : 'prev';
        updateSlider(index, direction);
        resetAutoSlide();
    });
});

// Auto-advance testimonials
let autoSlideInterval = setInterval(nextTestimonial, 6000);

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextTestimonial, 6000);
}

// Initialize slider
updateSlider(0);

// Add hover effects for testimonial cards
testimonials.forEach((card, index) => {
    const content = card.querySelector('.testimonial-content');
    
    if (content) {
        content.addEventListener('mouseenter', () => {
            content.style.transform = 'translateY(-5px) scale(1.02)';
            content.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.2)';
        });
        
        content.addEventListener('mouseleave', () => {
            content.style.transform = 'translateY(0) scale(1)';
            content.style.boxShadow = 'none';
        });
    }
});

// Add touch/swipe support for mobile
let startX = 0;
let endX = 0;

if (testimonialTrack) {
    testimonialTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    testimonialTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextTestimonial();
        } else {
            prevTestimonial();
        }
        resetAutoSlide();
    }
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        }, 2000);
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current);
                    }, 16);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                
                gsap.to(bar, {
                    width: width,
                    duration: 1.5,
                    ease: "power2.out",
                    delay: 0.2
                });
                
                observer.unobserve(bar);
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Cursor Effects (Optional Enhancement)
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #ffd700, transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Initialize cursor effects on desktop only
if (window.innerWidth > 768) {
    initCursorEffects();
}

// Parallax Effect for Background Elements
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

initParallaxEffects();

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Any scroll-based animations or effects
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://via.placeholder.com/300x300/1a1a1a/gold?text=Your+Photo',
        'https://via.placeholder.com/400x300/1a1a1a/gold?text=Video+Project+1',
        'https://via.placeholder.com/400x300/1a1a1a/4A90E2?text=Design+Project+1'
        // Add more image URLs as needed
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();
