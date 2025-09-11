// Test function to verify video loading
function testVideoLoading() {
	return new Promise((resolve) => {
		const testVideo = document.createElement('video');
		testVideo.src = 'Data/videos/Videoedit1.mp4';
		testVideo.muted = false;
		testVideo.playsInline = true;
		testVideo.preload = 'metadata';
		testVideo.autoplay = false;
		testVideo.setAttribute('playsinline', '');
		testVideo.setAttribute('webkit-playsinline', '');
		testVideo.style.display = 'none';
		
		testVideo.addEventListener('loadedmetadata', () => {
			console.log('Video metadata loaded successfully');
			resolve(true);
			testVideo.remove();
		});
		
		testVideo.addEventListener('error', (e) => {
			console.error('Video loading error:', e);
			resolve(false);
			testVideo.remove();
		});
		
		document.body.appendChild(testVideo);
	});
}

// Initialize everything when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM loaded, initializing website...');
	
	// Initialize the website
	initializeWebsite();
	
	// Test if videos can be loaded
	testVideoLoading().then(success => {
		console.log('Video loading test:', success ? 'Success' : 'Failed');
	});
});

function initializeWebsite() {
	// Initialize all components
	initSmoothScrolling();
	initLoadingScreen();
	initNavigation();
	initAnimatedIcons();
	initTypewriterEffect();
	initScrollAnimations();
	initProgressBars();
	initPortfolioFilters();
	initVideoHandling();
	
	// Initialize portfolio videos after the page is fully loaded
	window.addEventListener('load', function() {
		initPortfolioVideos();
		initVideoJsPlayer();
	});
}

// Portfolio Video Controls
function initPortfolioVideos() {
	console.log('Initializing portfolio videos...');
	const portfolioItems = document.querySelectorAll('.portfolio-item');
	
	// Configure all videos
	document.querySelectorAll('.portfolio-video').forEach((video, index) => {
		// Basic video setup
		video.autoplay = false;
		video.preload = 'metadata';
		video.muted = true; // Start muted
		video.controls = false;
		video.playsInline = true;
		
		// Ensure video is not preloaded too early
		video.load();
		
		// Log video source for debugging
		console.log(`Video ${index + 1} source:`, video.querySelector('source')?.src);
	});
	
	// Helper: update play button state
	function updatePlayButton(button, isPaused) {
		if (!button) return;
		const icon = button.querySelector('i');
		if (icon) icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
	}
	
	// Helper: update sound icon based on mute state
	function updateSoundButton(button, muted) {
		if (!button) return;
		const icon = button.querySelector('i');
		if (icon) icon.className = muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
	}
	
	// Function to handle video play/pause
	function toggleVideoPlayback(video, playButton) {
		if (video.paused) {
			// Pause all other videos
			document.querySelectorAll('.portfolio-video').forEach(v => {
				if (v !== video && !v.paused) {
					v.pause();
					v.currentTime = 0;
					v.classList.remove('playing');
					const btn = v.closest('.portfolio-item')?.querySelector('.video-play-btn');
					if (btn) updatePlayButton(btn, true);
				}
			});
			
			// Play the clicked video
			video.play().then(() => {
				video.classList.add('playing');
				if (playButton) updatePlayButton(playButton, false);
			}).catch(error => {
				console.error('Error playing video:', error);
				// Fallback: Show native controls if playback fails
				video.controls = true;
			});
		} else {
			video.pause();
			video.currentTime = 0;
			video.classList.remove('playing');
			if (playButton) updatePlayButton(playButton, true);
		}
	}
	
	// Wire events for each portfolio item
	portfolioItems.forEach(item => {
		const video = item.querySelector('.portfolio-video');
		const playBtn = item.querySelector('.video-play-btn');
		const soundBtn = item.querySelector('.video-sound-btn');
		if (!video) return;
		
		// Initial sound icon state
		updateSoundButton(soundBtn, video.muted);
		
		// Play button
		if (playBtn) {
			playBtn.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				// Allow unmute on user gesture
				if (video.muted) video.muted = false;
				updateSoundButton(soundBtn, video.muted);
				toggleVideoPlayback(video, playBtn);
			});
		}
		
		// Sound toggle button
		if (soundBtn) {
			soundBtn.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				video.muted = !video.muted;
				updateSoundButton(soundBtn, video.muted);
			});
		}
		
		// Sync buttons on playback events
		video.addEventListener('play', () => {
			video.classList.add('playing');
			updatePlayButton(playBtn, false);
		});
		video.addEventListener('pause', () => {
			video.classList.remove('playing');
			updatePlayButton(playBtn, true);
		});
		video.addEventListener('ended', () => {
			video.currentTime = 0;
			video.classList.remove('playing');
			updatePlayButton(playBtn, true);
		});
		video.addEventListener('error', () => {
			console.error('Video error:', video.error);
		});
	});
}

// Global Media Player with Playlist
function initVideoJsPlayer() {
    const overlay = document.getElementById('media-player-overlay');
    const closeBtn = document.getElementById('mpClose');
    const vjsEl = document.getElementById('mpVjs');
    const playlistContainer = document.getElementById('vjsPlaylist');
    if (!overlay || !vjsEl) return;

    // Collect sources: prefer YouTube IDs via data attribute, fallback to local mp4
    const items = Array.from(document.querySelectorAll('.portfolio-item'));
    const videos = items.map((item) => {
        const title = item.querySelector('.portfolio-content h4')?.textContent?.trim() || 'Untitled';
        const ytId = item.getAttribute('data-youtube-id');
        if (ytId) {
            return {
                name: title,
                poster: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
                sources: [{ src: `https://www.youtube.com/watch?v=${ytId}`, type: 'video/youtube' }]
            };
        }
        const source = item.querySelector('.portfolio-video source');
        const src = source?.getAttribute('src');
        return src ? { name: title, sources: [{ src, type: 'video/mp4' }] } : null;
    }).filter(Boolean);

    if (videos.length === 0) return;

    // Initialize player
    const player = window.videojs(vjsEl, {
        controls: true,
        preload: 'metadata',
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        techOrder: ['youtube', 'html5']
    });

    if (window.videojsPlaylist) {
        player.playlist(videos);
        if (playlistContainer && window.videojsPlaylistUi) {
            player.playlistUi({ el: playlistContainer });
        }
    }

    function openOverlay(index) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (player.playlist && typeof index === 'number') {
            player.playlist.currentItem(index);
        }
        player.play();
    }

    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        player.pause();
    }

    // Wire open triggers
    items.forEach((item, idx) => {
        const triggerEls = item.querySelectorAll('.video-container, .portfolio-image');
        triggerEls.forEach(el => el.addEventListener('click', (e) => {
            e.preventDefault();
            openOverlay(idx);
        }));
    });

    // Close
    closeBtn?.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });

    // Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeOverlay();
    });
}

// Global delegated handlers as a safety net for play/sound buttons
document.addEventListener('click', (e) => {
	const playBtn = e.target.closest && e.target.closest('.video-play-btn');
	if (playBtn) {
		e.preventDefault();
		e.stopPropagation();
		const item = playBtn.closest('.portfolio-item');
		const video = item && item.querySelector && item.querySelector('.portfolio-video');
		const soundBtn = item && item.querySelector && item.querySelector('.video-sound-btn');
		if (!video) return;
		if (video.paused) {
			// Allow sound on user gesture
			if (video.muted) video.muted = false;
			if (typeof updateSoundButton === 'function') {
				updateSoundButton(soundBtn, video.muted);
			} else if (soundBtn) {
				const sIcon = soundBtn.querySelector('i');
				if (sIcon) sIcon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
			}
			video.play().then(() => {
				video.classList.add('playing');
				if (typeof updatePlayButton === 'function') {
					updatePlayButton(playBtn, false);
				} else {
					const icon = playBtn.querySelector('i');
					if (icon) icon.className = 'fas fa-pause';
				}
			}).catch(() => {
				video.controls = true;
			});
		} else {
			video.pause();
			video.currentTime = 0;
			video.classList.remove('playing');
			const icon = playBtn.querySelector('i');
			if (icon) icon.className = 'fas fa-play';
		}
		return;
	}
	const soundBtn = e.target.closest && e.target.closest('.video-sound-btn');
	if (soundBtn) {
		e.preventDefault();
		e.stopPropagation();
		const item = soundBtn.closest('.portfolio-item');
		const video = item && item.querySelector && item.querySelector('.portfolio-video');
		if (!video) return;
		video.muted = !video.muted;
		if (typeof updateSoundButton === 'function') {
			updateSoundButton(soundBtn, video.muted);
		} else {
			const icon = soundBtn.querySelector('i');
			if (icon) icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
		}
		return;
	}
	const videoEl = e.target.closest && e.target.closest('.portfolio-video');
	if (videoEl) {
		e.preventDefault();
		e.stopPropagation();
		const item = videoEl.closest('.portfolio-item');
		const playButton = item && item.querySelector && item.querySelector('.video-play-btn');
		if (videoEl.paused) {
			videoEl.play().then(() => {
				videoEl.classList.add('playing');
				if (playButton) {
					const icon = playButton.querySelector('i');
					if (icon) icon.className = 'fas fa-pause';
				}
			}).catch(() => {
				videoEl.controls = true;
			});
		} else {
			videoEl.pause();
			videoEl.currentTime = 0;
			videoEl.classList.remove('playing');
			if (playButton) {
				const icon = playButton.querySelector('i');
				if (icon) icon.className = 'fas fa-play';
			}
		}
	}
});

// Lazy load and video handling
function initVideoHandling() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                container.classList.add('visible');
                observer.unobserve(container);
            }
        });
    }, {
        rootMargin: '200px', // Start loading when within 200px of viewport
        threshold: 0.1
    });

    // Initialize video containers
    videoContainers.forEach(container => {
        // Observe each container
        observer.observe(container);
        
        // Click handler for video playback
        container.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-src');
            if (!videoSrc) return;
            
            // Create video element if it doesn't exist
            if (!this.querySelector('video')) {
                const video = document.createElement('video');
                video.src = videoSrc;
                video.controls = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.preload = 'metadata'; // Only load metadata initially
                
                // Replace thumbnail with video
                const thumbnail = this.querySelector('.video-thumbnail');
                const playIcon = this.querySelector('.play-icon');
                if (thumbnail) thumbnail.style.display = 'none';
                if (playIcon) playIcon.style.display = 'none';
                
                this.appendChild(video);
                
                // Play video
                video.play().catch(error => {
                    console.error('Video playback failed:', error);
                });
            }
        });
        
        // Pause video when it's out of view
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (video) {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log('Autoplay prevented:', e));
                    } else {
                        video.pause();
                    }
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(container);
    });
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    function toggleMenu() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }
    
    // Close mobile menu
    function closeMenu() {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Initialize hamburger button
    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.hamburger')) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Run once on load
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Send email using EmailJS
            emailjs.sendForm('service_b5h88wi', 'template_dmnf8kz', this, 'eSpbNKt_ONfqAu42u')
                .then((result) => {
                    // Show success message
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                }, (error) => {
                    // Show error message
                    showNotification('Failed to send message. Please try again.', 'error');
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }
});

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.3s ease-in-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification.success {
                background: #4CAF50;
            }
            .notification.error {
                background: #F44336;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Fallback to native smooth scrolling if Lenis is not available
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    } else {
        // Native smooth scrolling as fallback
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                if (target !== '#') {
                    document.querySelector(target)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
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
        'Social Media Manager',
        'Photographer'
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

    // Filter function
    function filterPortfolio(category) {
        portfolioItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.classList.remove('hide');
                setTimeout(() => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                    item.classList.add('hide');
                }, 300);
            }
        });
    }

    // Add click event to filter buttons
    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter items
            filterPortfolio(button.getAttribute('data-filter'));
        });
    });

    // Portfolio hover effect
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.02)';
            item.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.2)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
            item.style.boxShadow = 'none';
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
        const progressWidth = ((index + 1) / testimonials.length) * 50;
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

// Progress Bars Animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (!progressBars.length) return;

    // Reset all progress bars to 0 initially
    progressBars.forEach(bar => {
        bar.style.width = '0';
        bar.style.setProperty('--progress-width', bar.getAttribute('data-level') + '%');
    });

    // Create an Intersection Observer to detect when the tools section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each progress bar with a slight delay between them
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, index * 200); // Stagger the animations
                });
                
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Adjust this value as needed
    });

    // Observe the tools section
    const toolsSection = document.querySelector('.tools-section');
    if (toolsSection) {
        observer.observe(toolsSection);
    }
    
    // Fallback in case IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate');
            }, index * 200);
        });
    }
}

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
    }
}

// Scroll event listener for any future scroll-based animations
window.addEventListener('scroll', () => {
    // Add scroll-based animations here if needed
});
