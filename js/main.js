/* ============================================
   MILÚ Eventos - JavaScript Interactivo
============================================ */

// ========== Inicialización AOS (Animate On Scroll) ==========
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });
});

// ========== Navbar Scroll Effect ==========
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========== Smooth Scroll para Links de Navegación ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Evitar procesamiento si el href es solo "#"
        if (href === '#') {
            return;
        }
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Cerrar el menú móvil si está abierto
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                navbarToggler.click();
            }
        }
    });
});

// ========== Active Link Highlighting ==========
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== Validación del Formulario de Contacto ==========
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const tipoEvento = document.getElementById('evento').value;
        const mensaje = document.getElementById('mensaje').value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        // Validar nombre
        if (nombre.length < 3) {
            isValid = false;
            errorMessage += 'Por favor ingresa un nombre válido (mínimo 3 caracteres).\n';
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            errorMessage += 'Por favor ingresa un email válido.\n';
        }
        
        // Validar teléfono (formato mexicano básico)
        const telefonoRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!telefonoRegex.test(telefono)) {
            isValid = false;
            errorMessage += 'Por favor ingresa un teléfono válido (mínimo 10 dígitos).\n';
        }
        
        // Validar tipo de evento
        if (!tipoEvento) {
            isValid = false;
            errorMessage += 'Por favor selecciona un tipo de evento.\n';
        }
        
        // Validar mensaje
        if (mensaje.length < 10) {
            isValid = false;
            errorMessage += 'Por favor ingresa un mensaje más detallado (mínimo 10 caracteres).\n';
        }
        
        if (!isValid) {
            e.preventDefault();
            alert(errorMessage);
        }
    });
    
    // Feedback visual en tiempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else if (this.hasAttribute('required')) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        });
        
        input.addEventListener('focus', function() {
            this.classList.remove('is-invalid');
        });
    });
}

// ========== Animación de Números (Contador) ==========
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Activar contador cuando sea visible
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-counter]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-counter'));
                animateCounter(counter, target);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// ========== Efecto Parallax en Hero ==========
window.addEventListener('scroll', function() {
    const scrolled = window.scrollY;
    const heroElements = document.querySelectorAll('.floating-element');
    
    heroElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ========== Lazy Loading para Imágenes ==========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== Modal de Galería (Lightbox) ==========
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
            // Crear modal simple
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="gallery-modal-backdrop"></div>
                <div class="gallery-modal-content">
                    <button class="gallery-modal-close">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            
            // Agregar estilos al modal
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;
            
            const backdrop = modal.querySelector('.gallery-modal-backdrop');
            backdrop.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
            `;
            
            const content = modal.querySelector('.gallery-modal-content');
            content.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90vh;
                z-index: 10000;
            `;
            
            const closeBtn = modal.querySelector('.gallery-modal-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: -40px;
                background: #FF85C8;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            const modalImg = content.querySelector('img');
            modalImg.style.cssText = `
                max-width: 100%;
                max-height: 90vh;
                border-radius: 10px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Cerrar modal
            const closeModal = () => {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeModal);
            backdrop.addEventListener('click', closeModal);
            
            // Hover effect en botón cerrar
            closeBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(90deg)';
                this.style.background = '#FFA726';
            });
            
            closeBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.background = '#FF85C8';
            });
            
            // Cerrar con tecla ESC
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }
    });
});

// ========== Animación de Entrada para Cards ==========
const cards = document.querySelectorAll('.service-card, .testimonial-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    cardObserver.observe(card);
});

// ========== Tracking de Clics en WhatsApp ==========
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
        // Google Analytics Event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'Click en botón WhatsApp',
                'value': 1
            });
        }
        
        // Google Tag Manager Event
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                'event': 'whatsapp_click',
                'button_location': this.closest('section')?.id || 'unknown'
            });
        }
    });
});

// ========== Tracking de Envío de Formulario ==========
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        // Google Analytics Event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'submit', {
                'event_category': 'Formulario',
                'event_label': 'Formulario de Contacto Enviado',
                'value': 1
            });
        }
        
        // Google Tag Manager Event
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                'event': 'form_submission',
                'form_name': 'contacto'
            });
        }
    });
}

// ========== Back to Top Button ==========
const createBackToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #FF85C8 0%, #FFA726 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) translateY(-5px)';
        this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
        this.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
    });
};

createBackToTop();

// ========== Preload Critical Images ==========
const preloadImages = () => {
    const criticalImages = [
        'img/logo.png'
        // Agregar más imágenes críticas aquí
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
};

preloadImages();

// ========== Animación de Tipeo para Hero Title ==========
const typeEffect = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
};

// ========== Easter Egg - Confetti en Logo Click ==========
const logo = document.querySelector('.navbar-brand');
let clickCount = 0;

if (logo) {
    logo.addEventListener('click', function(e) {
        clickCount++;
        
        if (clickCount >= 5) {
            // Crear efecto de confetti
            for (let i = 0; i < 50; i++) {
                createConfetti(e.clientX, e.clientY);
            }
            clickCount = 0;
        }
    });
}

function createConfetti(x, y) {
    const colors = ['#FF85C8', '#FFA726', '#4DD4FF', '#B8D548'];
    const confetti = document.createElement('div');
    
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
    `;
    
    document.body.appendChild(confetti);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 5;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 5;
    let posX = x;
    let posY = y;
    
    const animate = () => {
        vy += 0.5; // Gravedad
        posX += vx;
        posY += vy;
        
        confetti.style.left = posX + 'px';
        confetti.style.top = posY + 'px';
        confetti.style.transform = `rotate(${posX + posY}deg)`;
        
        if (posY < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    };
    
    animate();
}

// ========== Console Message ==========
console.log('%c💙 MILÚ Eventos 💙', 'color: #FF85C8; font-size: 24px; font-weight: bold;');
console.log('%c🎉 Creadores de espacios de diversión 🎉', 'color: #FFA726; font-size: 16px;');
console.log('%cDesarrollado con ❤️ para crear experiencias mágicas', 'color: #4DD4FF; font-size: 12px;');

// ========== Performance Optimization ==========
// Debounce para eventos de scroll
function debounce(func, wait) {
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

// Aplicar debounce a eventos de scroll pesados
const debouncedScroll = debounce(() => {
    // Operaciones pesadas aquí
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ========== Log de Inicialización ==========
console.log('✅ MILÚ Eventos - JavaScript cargado exitosamente');