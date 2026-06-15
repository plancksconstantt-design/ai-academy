// DOM Elements
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const sliderTrack = document.querySelector('.features-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dots = document.querySelectorAll('.dot');
const statNumbers = document.querySelectorAll('.stat-number');
const featureItems = document.querySelectorAll('.feature-item');
const newsCards = document.querySelectorAll('.news-card');

let currentSlide = 0;
const totalSlides = 4;
const slideWidth = 100 / totalSlides;

// Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 26, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(15, 15, 26, 0.8)';
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Features Slider
function updateSlider() {
    if (sliderTrack) {
        const offset = -currentSlide * slideWidth;
        sliderTrack.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-play slider
setInterval(() => {
    if (sliderTrack && !document.querySelector('.feature-item:hover')) {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
}, 5000);

// Counter Animation
function animateCounter(element, target, suffix = '') {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            if (target >= 1000) {
                element.textContent = Math.floor(start / 1000) + 'K' + suffix;
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (target >= 1000) {
                element.textContent = (target / 1000) + 'K' + suffix;
            } else {
                element.textContent = target + suffix;
            }
        }
    }
    
    updateCounter();
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Animate stats if it's a stat card
            if (entry.target.classList.contains('stat-card')) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.animated) {
                    const count = parseInt(statNumber.dataset.count);
                    const suffix = statNumber.textContent.includes('%') ? '%' : '+';
                    if (!isNaN(count)) {
                        statNumber.dataset.animated = 'true';
                        animateCounter(statNumber, count, suffix);
                    }
                }
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
statNumbers.forEach(stat => {
    const parent = stat.closest('.stat-card');
    if (parent) observer.observe(parent);
});

newsCards.forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.feature-item, .about-content, .hero-content, .hero-image, .stats-content, .stats-grid, .news-header').forEach(el => {
    observer.observe(el);
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    if (heroImage && heroContent) {
        heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    // Parallax for shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.transform = `translateY(${scrolled * (0.05 * (index + 1))}px)`;
    });
});

// Menu Toggle with Animation
menuBtn.addEventListener('click', () => {
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    menuOverlay.innerHTML = `
        <div class="mobile-menu">
            <button class="close-menu">
                <i class="fas fa-times"></i>
            </button>
            <nav>
                <a href="#courses">Courses</a>
                <a href="#about">About Us</a>
                <a href="#stats">Results</a>
                <a href="#news">Blog</a>
                <a href="#enroll" class="btn-download">Enroll Now</a>
            </nav>
        </div>
    `;
    
    document.body.appendChild(menuOverlay);
    
    const style = document.createElement('style');
    style.id = 'mobile-menu-style';
    style.textContent = `
        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 2000;
            display: flex;
            justify-content: flex-end;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .mobile-menu {
            background: var(--dark-light);
            width: 320px;
            height: 100%;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            animation: slideIn 0.3s ease;
            border-left: 1px solid var(--glass-border);
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .close-menu {
            align-self: flex-end;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            color: var(--light);
            font-size: 1.5rem;
        }
        .mobile-menu nav {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .mobile-menu a {
            text-decoration: none;
            color: var(--light);
            font-size: 1.25rem;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 0.5rem 0;
        }
        .mobile-menu a:hover {
            color: var(--primary-purple);
            transform: translateX(10px);
        }
        .btn-download {
            background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
            color: white !important;
            padding: 1rem;
            border-radius: 50px;
            text-align: center;
            margin-top: 2rem;
        }
        .btn-download:hover {
            transform: translateX(0) scale(1.05) !important;
        }
    `;
    document.head.appendChild(style);
    
    const closeBtn = menuOverlay.querySelector('.close-menu');
    closeBtn.addEventListener('click', () => {
        menuOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            menuOverlay.remove();
            document.getElementById('mobile-menu-style').remove();
        }, 300);
    });
    
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                menuOverlay.remove();
                document.getElementById('mobile-menu-style').remove();
            }, 300);
        }
    });
});

// Ripple Effect for Buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-link, .social-link').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// Mouse Trail Effect
let mouseX = 0, mouseY = 0;
let trailElements = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trail effect on buttons only
    if (e.target.closest('button') || e.target.closest('.social-link')) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--primary-pink);
            border-radius: 50%;
            left: ${mouseX - 4}px;
            top: ${mouseY - 4}px;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 0.5s ease forwards;
        `;
        document.body.appendChild(trail);
        trailElements.push(trail);
        
        setTimeout(() => {
            trail.remove();
            trailElements = trailElements.filter(t => t !== trail);
        }, 500);
    }
});

const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% { opacity: 0.8; transform: scale(1); }
        100% { opacity: 0; transform: scale(2); }
    }
`;
document.head.appendChild(trailStyle);

// Log for debugging
console.log('Moana Academy Website Loaded Successfully! 🎨✨');