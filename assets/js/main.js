// ========== НАВИГАЦИЯ ==========
function navigateTo(page) {
    window.location.href = page;
}

// ========== БОКОВОЕ МЕНЮ ==========
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// ========== СТОРИС ==========
function showStory(storyId) {
    const stories = {
        1: () => window.location.href = 'pages/instruction.html',
        2: () => window.location.href = 'pages/community/create-event-instruction.html',
        3: () => window.location.href = 'pages/community/find-friend-instruction.html',
        4: () => alert('Челленджи: Выполняйте задания и получайте бонусы!')
    };
    
    const story = stories[storyId];
    if (story) story();
}

// ========== ПЛАШКА-ПРИВЕТСТВИЕ ==========
function showWelcomeToast() {
    const toast = document.getElementById('welcomeToast');
    // Убираем проверку на sessionStorage - показываем при каждом заходе на главную
    if (toast && !localStorage.getItem('welcomeToastShown')) {
        setTimeout(() => toast.classList.add('show'), 3000); // 3 секунды
    }
}

function closeWelcomeToast() {
    const toast = document.getElementById('welcomeToast');
    if (toast) {
        toast.classList.remove('show');
        // Сохраняем в localStorage, чтобы плашка не показывалась снова у этого пользователя
        localStorage.setItem('welcomeToastShown', 'true');
    }
}

// Функция для сброса плашки (если нужно показать снова)
function resetWelcomeToast() {
    localStorage.removeItem('welcomeToastShown');
    location.reload();
}

function highlightStories() {
    closeWelcomeToast();
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach((item, index) => {
        if (index < 3) item.classList.add('highlight');
    });
    setTimeout(() => storyItems.forEach(item => item.classList.remove('highlight')), 2000);
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ========== ОТОБРАЖЕНИЕ МОИХ СОБЫТИЙ ==========
function renderMyEvents() {
    const container = document.getElementById('homeEventsContainer');
    if (!container) return;
    
    const myEvents = JSON.parse(localStorage.getItem('userAnketas') || '[]');
    const myApplications = JSON.parse(localStorage.getItem('myApplications') || '[]');
    
    let html = '';
    let hasContent = false;
    
    // Мои мероприятия (я организатор)
    const sortedEvents = [...myEvents].sort((a, b) => b.id - a.id).slice(0, 3);
    sortedEvents.forEach(event => {
        hasContent = true;
        const day = event.date ? new Date(event.date).getDate() : '?';
        const month = event.date ? new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '') : '';
        html += `
            <div class="home-event-card" onclick="navigateTo('pages/community/event-detail.html?id=${event.id}')">
                <div class="home-event-header">
                    <span class="home-event-title">${escapeHtml(event.eventTitle)}</span>
                    <span class="home-event-badge organizer">Организатор</span>
                </div>
                <div class="home-event-meta">
                    <span><i class="bi bi-calendar"></i> ${day} ${month}</span>
                    <span><i class="bi bi-people"></i> ${event.availableSeats || 0} мест</span>
                </div>
            </div>
        `;
    });
    
    // Мои заявки на чужие мероприятия
    const remainingSlots = 3 - sortedEvents.length;
    if (remainingSlots > 0) {
        const myApps = [...myApplications]
            .filter(app => app.status === 'pending' || app.status === 'accepted')
            .reverse()
            .slice(0, remainingSlots);
        
        myApps.forEach(app => {
            hasContent = true;
            const day = '10';
            const month = 'мая';
            const organizer = 'Иван';
            const statusText = app.status === 'pending' ? 'Ожидает' : 'Одобрено';
            const statusClass = app.status === 'pending' ? 'pending' : 'participant';
            
            html += `
                <div class="home-event-card" onclick="navigateTo('pages/community/my-anketas.html?tab=requests')">
                    <div class="home-event-header">
                        <span class="home-event-title">${escapeHtml(app.eventTitle)}</span>
                        <span class="home-event-badge ${statusClass}">${statusText}</span>
                    </div>
                    <div class="home-event-meta">
                        <span><i class="bi bi-calendar"></i> ${day} ${month}</span>
                        <span><i class="bi bi-person"></i> Орг: ${organizer}</span>
                    </div>
                </div>
            `;
        });
    }
    
    if (!hasContent) {
        html = `<div class="home-empty-events"><p>У вас пока нет активных событий</p></div>`;
    }
    
    container.innerHTML = html;
}

// ========== РЕКОМЕНДАЦИИ ==========
const recommendedEvents = [
    { id: 101, title: 'Неаполитанская карусель', category: 'Концерт', date: '28 марта', time: '19:00', price: '1500 ₽', imageIcon: 'bi-music-note-beamed' },
    { id: 102, title: 'Вечер джаза', category: 'Концерт', date: '29 марта', time: '20:00', price: '1200 ₽', imageIcon: 'bi-vinyl' },
    { id: 103, title: 'Арт-выставка «Импрессионизм»', category: 'Искусство', date: '30 марта', time: '11:00', price: '800 ₽', imageIcon: 'bi-palette' },
    { id: 104, title: 'Мастер-класс по гончарному делу', category: 'Творчество', date: '31 марта', time: '15:00', price: '2000 ₽', imageIcon: 'bi-cup' }
];

function renderRecommendations() {
    const container = document.getElementById('recommendationsGrid');
    if (!container) return;
    
    container.innerHTML = recommendedEvents.map(event => `
        <div class="recommendation-card">
            <div class="recommendation-image" onclick="viewRecommendation(${event.id})">
                <i class="bi ${event.imageIcon}"></i>
                <span class="recommendation-category">${event.category}</span>
            </div>
            
            <div class="recommendation-info" onclick="viewRecommendation(${event.id})">
                <div class="recommendation-title">${event.title}</div>
                <div class="recommendation-meta">
                    <span><i class="bi bi-calendar"></i> ${event.date}</span>
                    <span><i class="bi bi-clock"></i> ${event.time}</span>
                </div>
                <div class="recommendation-meta">
                    <span><i class="bi bi-wallet2"></i> ${event.price}</span>
                </div>
            </div>
            
            <button class="rec-dislike-btn" onclick="event.stopPropagation(); dislikeRecommendation(${event.id})" title="Скрыть">
                <i class="bi bi-x"></i>
            </button>
            
            <div class="rec-actions-right">
                <button class="rec-action-btn rec-chat-btn" onclick="event.stopPropagation(); openEventChat(${event.id})" title="Чат мероприятия">
                    <i class="bi bi-chat-dots"></i>
                </button>
                <button class="rec-action-btn rec-like-btn" onclick="event.stopPropagation(); likeRecommendation(${event.id})" title="Нравится">
                    <i class="bi bi-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openEventChat(eventId) {
    localStorage.setItem('selectedChatEventId', eventId);
    window.location.href = 'pages/community/event-chat.html';
}

function viewRecommendation(id) {
    const event = recommendedEvents.find(e => e.id === id);
    if (event) alert(`${event.title}\n${event.date} в ${event.time}\n${event.price}`);
}

function likeRecommendation(id) {
    const event = recommendedEvents.find(e => e.id === id);
    if (event) {
        alert(`"${event.title}" добавлено в избранное`);
    }
}

function dislikeRecommendation(id) {
    const index = recommendedEvents.findIndex(e => e.id === id);
    if (index !== -1) {
        const event = recommendedEvents[index];
        recommendedEvents.splice(index, 1);
        renderRecommendations();
        alert(`✕ "${event.title}" скрыто`);
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Закрытие меню при клике на пункты
    document.querySelectorAll('.side-menu-item').forEach(item => {
        item.addEventListener('click', () => setTimeout(() => toggleSideMenu(), 150));
    });
    
    // Активный пункт нижнего меню
    const navItems = document.querySelectorAll('.nav-icon-item');
    const currentPage = window.location.pathname.split('/').pop();
    navItems.forEach(item => item.classList.remove('active'));
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        if (navItems[1]) navItems[1].classList.add('active');
    }
    
    const homeNavItem = navItems[1];
    if (homeNavItem) {
        homeNavItem.removeAttribute('onclick');
        homeNavItem.addEventListener('click', () => {
            navItems.forEach(item => item.classList.remove('active'));
            homeNavItem.classList.add('active');
            navigateTo('index.html');
        });
    }
    
    // ПЛАШКА-ПРИВЕТСТВИЕ - показываем при каждом заходе на главную
    // (но не чаще одного раза в 24 часа, если нужно - раскомментируйте localStorage проверку)
    showWelcomeToast();
    
    // Рендер
    renderMyEvents();
    renderRecommendations();
});