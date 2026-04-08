// Навигация
function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.location.href = '../../index.html';
}

function tryItNow() {
    window.location.href = '../community/feed.html';
}

// Показ всплывающей плашки
let floatingTimeout;

function showFloatingCard() {
    const card = document.getElementById('floatingCard');
    const overlay = document.getElementById('floatingOverlay');
    if (card) {
        if (floatingTimeout) {
            clearTimeout(floatingTimeout);
        }
        floatingTimeout = setTimeout(() => {
            card.classList.add('show');
            overlay.classList.add('show');
        }, 3000);
    }
}

function closeFloatingCard() {
    const card = document.getElementById('floatingCard');
    const overlay = document.getElementById('floatingOverlay');
    if (card) {
        card.classList.remove('show');
        overlay.classList.remove('show');
        if (floatingTimeout) {
            clearTimeout(floatingTimeout);
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    showFloatingCard();
    console.log('Страница инструкции "Создать мероприятие" загружена');
});