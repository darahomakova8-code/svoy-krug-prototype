// Карусель с идеальным перелистыванием
let currentIndex = 0;
let slides = [];
let dots = [];
let autoInterval;
let isAnimating = false;

function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slidesContainer = document.querySelector('.carousel-slides');
    
    if (!slidesContainer) return;
    
    // Получаем все слайды
    slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dotsContainer = document.getElementById('carouselDots');
    
    if (slides.length === 0) return;
    
    // Создаем точки
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (!isAnimating) {
                stopAutoSlide();
                goToSlide(i);
                startAutoSlide();
            }
        });
        dotsContainer.appendChild(dot);
    });
    
    dots = document.querySelectorAll('.dot');
    
    // Устанавливаем начальную позицию
    updateSlidePosition();
}

function goToSlide(index) {
    if (isAnimating) return;
    if (index === currentIndex) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    isAnimating = true;
    currentIndex = index;
    
    // Обновляем позицию слайдов
    updateSlidePosition();
    
    // Обновляем активную точку
    updateDots();
    
    // Снимаем блокировку после анимации
    setTimeout(() => {
        isAnimating = false;
    }, 400);
}

function updateSlidePosition() {
    const slidesContainer = document.querySelector('.carousel-slides');
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
}

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function nextSlide() {
    if (!isAnimating) {
        goToSlide(currentIndex + 1);
    }
}

function prevSlide() {
    if (!isAnimating) {
        goToSlide(currentIndex - 1);
    }
}

function startAutoSlide() {
    if (autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(() => {
        nextSlide();
    }, 10000);
}

function stopAutoSlide() {
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    }
}

// Свайпы для мобильных устройств
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    stopAutoSlide();
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
    
    setTimeout(() => {
        startAutoSlide();
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    startAutoSlide();
    
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        carousel.addEventListener('touchstart', handleTouchStart);
        carousel.addEventListener('touchend', handleTouchEnd);
    }
});