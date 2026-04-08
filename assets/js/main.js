// Навигация
function navigateTo(page) {
    window.location.href = page;
}

// Боковое меню
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// Сторис
function showStory(storyId) {
    const stories = {
        1: () => window.location.href = 'pages/instruction.html',
        2: () => window.location.href = 'pages/community/create-event-instruction.html',
        3: () => window.location.href = 'pages/community/find-friend-instruction.html',
        4: () => alert('Челленджи: Выполняйте задания и получайте бонусы!')
    };
    
    const story = stories[storyId];
    if (story) {
        story();
    }
}

// Плашка-приветствие
let toastTimeout;

function showWelcomeToast() {
    const toast = document.getElementById('welcomeToast');
    // Проверяем, что это прямой вход на index.html (не через навигацию внутри приложения)
    // и что плашка еще не показывалась
    if (toast && !localStorage.getItem('welcomeToastShown') && !sessionStorage.getItem('appNavigated')) {
        setTimeout(() => {
            toast.classList.add('show');
        }, 5000);
    }
}

function closeWelcomeToast() {
    const toast = document.getElementById('welcomeToast');
    if (toast) {
        toast.classList.remove('show');
        localStorage.setItem('welcomeToastShown', 'true');
    }
}

function highlightStories() {
    // Закрываем плашку
    closeWelcomeToast();
    
    // Подсвечиваем первые ТРИ сторис (индексы 0, 1, 2)
    const storyItems = document.querySelectorAll('.story-item');
    
    storyItems.forEach((item, index) => {
        if (index === 0 || index === 1 || index === 2) {
            item.classList.add('highlight');
        }
    });
    
    // Через 2 секунды убираем подсветку
    setTimeout(() => {
        storyItems.forEach(item => {
            item.classList.remove('highlight');
        });
    }, 2000);
}

// Закрытие меню при клике на ссылки внутри бокового меню
document.addEventListener('DOMContentLoaded', () => {
    // Закрываем меню при клике на любой пункт внутри бокового меню
    const menuItems = document.querySelectorAll('.side-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            setTimeout(() => {
                toggleSideMenu();
            }, 150);
        });
    });
    
    // Обновляем активный пункт нижнего меню
    const navItems = document.querySelectorAll('.nav-icon-item');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Убираем активный класс у всех
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Индекс 1 - это домик (второй элемент)
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        if (navItems[1]) {
            navItems[1].classList.add('active');
        }
    }
    
    // Домик (вторая иконка)
    const homeNavItem = navItems[1];
    if (homeNavItem) {
        homeNavItem.removeAttribute('onclick');
        homeNavItem.addEventListener('click', () => {
            // Устанавливаем флаг, что это навигация внутри приложения
            sessionStorage.setItem('appNavigated', 'true');
            navItems.forEach(item => item.classList.remove('active'));
            homeNavItem.classList.add('active');
            navigateTo('index.html');
        });
    }
    
    // Проверяем, был ли переход на главную из другого места
    // Если да, то не показываем плашку
    if (sessionStorage.getItem('appNavigated')) {
        // Не показываем плашку
    } else {
        // Показываем плашку только при первом открытии
        showWelcomeToast();
    }
    
    console.log('СвойКруг готов!');
});