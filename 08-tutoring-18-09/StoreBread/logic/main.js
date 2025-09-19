// ================================================
// PanyPan - JavaScript Functionality
// Carrusel y Promociones Dinámicas
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializePromotions();
    // El login ahora se maneja en login.js
});

// ================================================
// CARRUSEL DE PRODUCTOS
// ================================================
let currentSlideIndex = 0;
let carouselInterval;

function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    // Auto-play del carrusel
    startCarouselAutoPlay();
    
    // Pausar auto-play al hacer hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
    }
}

function startCarouselAutoPlay() {
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 4000); // Cambiar cada 4 segundos
}

function stopCarouselAutoPlay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    // Remover clase active de slide e indicador actual
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    // Calcular nuevo índice
    currentSlideIndex += direction;
    
    // Manejar overflow
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Activar nuevo slide e indicador
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function currentSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0 || index < 1 || index > slides.length) return;
    
    // Remover clases active
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    // Actualizar índice
    currentSlideIndex = index - 1;
    
    // Activar nuevo slide e indicador
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
    
    // Reiniciar auto-play
    stopCarouselAutoPlay();
    startCarouselAutoPlay();
}

// ================================================
// PROMOCIONES DINÁMICAS
// ================================================
let currentPromoIndex = 0;
let promoInterval;

function initializePromotions() {
    const promoSlides = document.querySelectorAll('.promotion-slide');
    
    if (promoSlides.length === 0) return;
    
    // Auto-play de las promociones
    startPromotionsAutoPlay();
    
    // Pausar auto-play al hacer hover
    const promosContainer = document.querySelector('.promotions-container');
    if (promosContainer) {
        promosContainer.addEventListener('mouseenter', stopPromotionsAutoPlay);
        promosContainer.addEventListener('mouseleave', startPromotionsAutoPlay);
    }
}

function startPromotionsAutoPlay() {
    promoInterval = setInterval(() => {
        changePromotion();
    }, 5000); // Cambiar cada 5 segundos
}

function stopPromotionsAutoPlay() {
    if (promoInterval) {
        clearInterval(promoInterval);
    }
}

function changePromotion() {
    const promoSlides = document.querySelectorAll('.promotion-slide');
    
    if (promoSlides.length === 0) return;
    
    // Remover clase active de promoción actual
    promoSlides[currentPromoIndex].classList.remove('active');
    
    // Calcular nuevo índice
    currentPromoIndex = (currentPromoIndex + 1) % promoSlides.length;
    
    // Activar nueva promoción
    promoSlides[currentPromoIndex].classList.add('active');
}

// ================================================
// FORMULARIO DE LOGIN (Movido a login.js)
// ================================================
// La funcionalidad de login ahora se maneja en logic/login.js
// Este archivo se enfoca en carrusel y promociones

// ================================================
// EFECTOS ADICIONALES
// ================================================

// Smooth scroll para enlaces internos
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Parallax suave para elementos
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
    });
});

// Animación de entrada para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observar elementos que tengan la clase 'animate-on-scroll'
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Prevenir envío de formularios con Enter si no están completos
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form && !form.checkValidity()) {
            e.preventDefault();
        }
    }
});

// ================================================
// UTILIDADES
// ================================================

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para formatear números como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(amount);
}

// Función para obtener fecha formateada
function getFormattedDate() {
    return new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Exportar funciones principales para uso global
window.PanyPan = {
    changeSlide,
    currentSlide,
    formatCurrency,
    getFormattedDate
};
