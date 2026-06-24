document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Signature Landing Page (The Intro Reveal)
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        document.fonts.ready.then(() => {
            // Let the signature draw (3.5s) and settle, then fade out
            setTimeout(() => {
                introOverlay.classList.add('fade-out');
                document.body.classList.remove('intro-active');
                document.documentElement.classList.remove('intro-active');
            }, 4200);
        });
    } else {
        document.body.classList.remove('intro-active');
        document.documentElement.classList.remove('intro-active');
    }

    // 2. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('mobile-active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinksContainer.classList.contains('mobile-active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 4. Scroll Progress Indicator & Sticky Header States
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        
        if (totalScrollHeight > 0) {
            const scrollPercentage = (currentScroll / totalScrollHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = `${scrollPercentage}%`;
            }
        }

        // Add subtle style to header on scroll
        if (header) {
            if (currentScroll > 50) {
                header.style.background = 'rgba(0, 0, 0, 0.98)';
                header.style.borderBottomColor = '#222';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.85)';
                header.style.borderBottomColor = 'var(--border-color)';
            }
        }
    });

    // 5. Typewriter Effect (Tech-Athlete & Audio Rhythm Subtitles)
    const words = [
        "AI/ML Specialist", 
        "IoT Innovator", 
        "Volleyball Athlete", 
        "Sprinting Enthusiast", 
        "Rhythm-Driven Engineer"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typewriterEl = document.getElementById('typewriter');
    const typingSpeed = 100; // ms
    const deletingSpeed = 50; // ms
    const pauseTime = 2000; // ms

    function typeEffect() {
        if (!typewriterEl) return;
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            delay = pauseTime; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            delay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, delay);
    }

    typeEffect();

    // 6. Hero Background Tech SVGs Parallax Effect (Mouse Coordinate tracking)
    const parallaxContainer = document.getElementById('parallax-container');
    const floats = document.querySelectorAll('.tech-float');

    if (parallaxContainer && floats.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            floats.forEach(floatEl => {
                const depth = parseFloat(floatEl.getAttribute('data-depth')) || 0.2;
                
                // Shift positions
                const moveX = x * depth * 140; // max shift 140px
                const moveY = y * depth * 140;
                
                // Rotate tilt
                const rotateX = -y * 25 * depth;
                const rotateY = x * 25 * depth;

                floatEl.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });
    }

    // 7. Advanced Sectional Opening Animations
    // 7.1 Split Typography Headers
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        const text = title.textContent.trim();
        title.textContent = '';
        
        // Wrap each character in a reveal span
        for (let char of text) {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Keep non-breaking spaces
            span.classList.add('char-reveal');
            title.appendChild(span);
        }
    });

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                const chars = entry.target.querySelectorAll('.char-reveal');
                chars.forEach((char, idx) => {
                    char.style.transitionDelay = `${idx * 0.04}s`;
                });
                titleObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    titles.forEach(t => titleObserver.observe(t));

    // 7.2 Draw Section Borders Traced Dynamically on Scroll
    const borderLines = document.querySelectorAll('.section-border-line');
    const borderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                borderObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    borderLines.forEach(line => borderObserver.observe(line));

    // 7.3 General Viewport Fade & Slide-up Reveals
    const fadeElements = document.querySelectorAll('.fade-in');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe layout components programmatically
    const animateTargets = document.querySelectorAll(
        '.about-grid, .experience-row, .project-card, .project-visual-card, .cert-card, .curriculum-block, .contact-grid, .roster-row'
    );
    animateTargets.forEach(el => {
        el.classList.add('fade-in');
        revealObserver.observe(el);
    });

    // 8. Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navHighlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '-80px 0px -45% 0px'
    });

    sections.forEach(sec => {
        navHighlightObserver.observe(sec);
    });

    // 9. Contact Form Handling & Validation
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i data-lucide="loader"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Simulate AJAX
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                if (typeof lucide !== 'undefined') lucide.createIcons();

                formFeedback.textContent = "Transmission successfully broadcasted. Connecting soon.";
                formFeedback.className = "form-feedback success";
                contactForm.reset();

                // Clear message after 5 seconds
                setTimeout(() => {
                    formFeedback.textContent = "";
                    formFeedback.className = "form-feedback";
                }, 5000);
            }, 1200);
        });
    }

    // 10. Access Resume Mock Behavior Alert
    const resumeBtn = document.getElementById('resume-download-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            const notify = document.createElement('div');
            notify.style.position = 'fixed';
            notify.style.bottom = '30px';
            notify.style.right = '30px';
            notify.style.background = 'var(--accent-gradient)';
            notify.style.color = '#fff';
            notify.style.padding = '1rem 2rem';
            notify.style.borderRadius = '4px';
            notify.style.boxShadow = 'var(--glow-shadow-cyan)';
            notify.style.fontFamily = 'var(--font-heading)';
            notify.style.fontSize = '0.9rem';
            notify.style.zIndex = '1001';
            notify.style.transition = 'all 0.5s ease';
            notify.style.transform = 'translateY(100px)';
            notify.style.opacity = '0';
            notify.textContent = "Retrieving Resume: KRISHNA RAJEEV RESUME.pdf";
            
            document.body.appendChild(notify);
            
            setTimeout(() => {
                notify.style.transform = 'translateY(0)';
                notify.style.opacity = '1';
            }, 100);

            setTimeout(() => {
                notify.style.transform = 'translateY(100px)';
                notify.style.opacity = '0';
                setTimeout(() => {
                    notify.remove();
                }, 500);
            }, 4000);
        });
    }
});
