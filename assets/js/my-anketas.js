let myEvents = [];
let myApplications = [];
let currentTab = 'events';

// Загрузка данных
function loadMyAnketas() {
    // Загружаем созданные мероприятия
    const saved = localStorage.getItem('userAnketas');
    myEvents = saved ? JSON.parse(saved) : [];
    
    // Загружаем поданные заявки
    const savedApps = localStorage.getItem('myApplications');
    myApplications = savedApps ? JSON.parse(savedApps) : [];
    
    // Проверяем параметр в URL для открытия нужной вкладки
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'requests') {
        currentTab = 'requests';
    }
    
    // Обновляем UI вкладок
    const eventsTabBtn = document.getElementById('eventsTabBtn');
    const requestsTabBtn = document.getElementById('requestsTabBtn');
    const eventsContainer = document.getElementById('eventsContainer');
    const requestsContainer = document.getElementById('requestsContainer');
    
    if (currentTab === 'requests') {
        if (eventsTabBtn) eventsTabBtn.classList.remove('active');
        if (requestsTabBtn) requestsTabBtn.classList.add('active');
        if (eventsContainer) eventsContainer.style.display = 'none';
        if (requestsContainer) requestsContainer.style.display = 'block';
    } else {
        if (eventsTabBtn) eventsTabBtn.classList.add('active');
        if (requestsTabBtn) requestsTabBtn.classList.remove('active');
        if (eventsContainer) eventsContainer.style.display = 'block';
        if (requestsContainer) requestsContainer.style.display = 'none';
    }
    
    renderCurrentTab();
}

function renderCurrentTab() {
    if (currentTab === 'events') {
        renderEvents();
    } else {
        renderRequests();
    }
}

function renderEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    if (myEvents.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="bi bi-calendar-x"></i><p>У вас пока нет созданных мероприятий</p><p class="small-text">Создайте анкету в сообществе</p></div>`;
        return;
    }
    
    container.innerHTML = myEvents.map(event => {
        const invitedFriends = event.invitedFriends || [];
        const avatarsHtml = invitedFriends.slice(0, 3).map(f => `<div class="participant-avatar">${f.charAt(0)}</div>`).join('');
        const moreHtml = invitedFriends.length > 3 ? `<div class="participant-avatar">+${invitedFriends.length - 3}</div>` : '';
        
        return `
            <div class="event-card" onclick="continueEvent(${event.id})">
                <div class="event-header">
                    <div class="event-title">${escapeHtml(event.eventTitle)}</div>
                    <div class="event-status">● Active</div>
                </div>
                <div class="participants-row">
                    <div class="participants-avatars">${avatarsHtml}${moreHtml}</div>
                    <div class="participants-count">${event.availableSeats} участников</div>
                </div>
                <div class="event-footer">
                    <div class="event-date"><i class="bi bi-calendar"></i><span>${formatDate(event.date)}</span></div>
                    <div class="continue-btn"><span>Продолжить</span><i class="bi bi-arrow-right"></i></div>
                </div>
            </div>
        `;
    }).join('');
}

function renderRequests() {
    const container = document.getElementById('requestsContainer');
    if (!container) return;
    
    if (myApplications.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="bi bi-chat-dots"></i><p>У вас пока нет активных запросов</p><p class="small-text">Откликнитесь на мероприятие в сообществе</p></div>`;
        return;
    }
    
    // Сортируем по дате (новые сверху)
    const sortedApps = [...myApplications].reverse();
    
    container.innerHTML = sortedApps.map(app => `
        <div class="request-card" data-app-id="${app.id}">
            <div class="request-header">
                <div class="event-title">${escapeHtml(app.eventTitle)}</div>
                <div class="delete-request-btn" onclick="event.stopPropagation(); deleteRequest(${app.id})">
                    <i class="bi bi-trash3"></i>
                </div>
            </div>
            <div class="participants-row">
                <div class="participants-avatars">
                    <div class="participant-avatar">${escapeHtml(app.firstName.charAt(0))}</div>
                </div>
                <div class="participants-count">${escapeHtml(app.fullName)}</div>
            </div>
            <div class="event-footer">
                <div class="event-date"><i class="bi bi-calendar"></i><span>${formatDate(app.appliedAt.split('T')[0])}</span></div>
                <div class="request-btn ${app.status === 'pending' ? 'pending-btn' : 'chat-btn'}" id="requestBtn-${app.id}" onclick="event.stopPropagation(); handleRequestAction(${app.id})">
                    ${app.status === 'pending' ? 'Ожидайте' : 'Зайти в чат'}
                </div>
            </div>
        </div>
    `).join('');
    
    // Запускаем таймеры для кнопок "Ожидайте"
    sortedApps.forEach(app => {
        if (app.status === 'pending') {
            setTimeout(() => {
                updateRequestStatus(app.id);
            }, 3000);
        }
    });
}

// Удаление заявки
function deleteRequest(appId) {
    if (confirm('Удалить эту заявку? Вы сможете подать новую заявку на это мероприятие.')) {
        // Находим заявку перед удалением
        const appToDelete = myApplications.find(a => a.id === appId);
        const eventId = appToDelete ? appToDelete.eventId : null;
        
        // Удаляем заявку из массива
        myApplications = myApplications.filter(a => a.id !== appId);
        localStorage.setItem('myApplications', JSON.stringify(myApplications));
        
        // Удаляем из appliedEvents, чтобы можно было подать заявку заново
        if (eventId) {
            let appliedEvents = JSON.parse(localStorage.getItem('appliedEvents') || '[]');
            appliedEvents = appliedEvents.filter(id => id != eventId);
            localStorage.setItem('appliedEvents', JSON.stringify(appliedEvents));
            console.log('🗑️ Удалён eventId из appliedEvents:', eventId);
            console.log('📋 Теперь appliedEvents:', appliedEvents);
        }
        
        // Обновляем отображение
        renderRequests();
        alert('Заявка удалена. Вы можете подать новую заявку.');
        
        // Если мы на странице мероприятия, обновим её
        if (window.location.pathname.includes('event-view.html')) {
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }
}

// Обновление статуса заявки (через 3 секунды)
function updateRequestStatus(appId) {
    const appIndex = myApplications.findIndex(a => a.id === appId);
    if (appIndex !== -1 && myApplications[appIndex].status === 'pending') {
        myApplications[appIndex].status = 'accepted';
        localStorage.setItem('myApplications', JSON.stringify(myApplications));
        
        // Обновляем кнопку на странице
        const btn = document.getElementById(`requestBtn-${appId}`);
        if (btn) {
            btn.textContent = 'Зайти в чат';
            btn.classList.remove('pending-btn');
            btn.classList.add('chat-btn');
        }
    }
}

// Обработка нажатия на кнопку запроса
function handleRequestAction(appId) {
    const app = myApplications.find(a => a.id === appId);
    if (!app) return;
    
    if (app.status === 'pending') {
        alert('Ваша заявка ещё рассматривается. Пожалуйста, подождите.');
    } else {
        alert(`Чат мероприятия "${app.eventTitle}" (будет реализован позже)`);
    }
}

function continueEvent(eventId) {
    localStorage.setItem('selectedEventId', eventId);
    window.location.href = 'event-detail.html';
}

function switchTab(tab) {
    currentTab = tab;
    const eventsTabBtn = document.getElementById('eventsTabBtn');
    const requestsTabBtn = document.getElementById('requestsTabBtn');
    const eventsContainer = document.getElementById('eventsContainer');
    const requestsContainer = document.getElementById('requestsContainer');
    
    if (tab === 'events') {
        if (eventsTabBtn) eventsTabBtn.classList.add('active');
        if (requestsTabBtn) requestsTabBtn.classList.remove('active');
        if (eventsContainer) eventsContainer.style.display = 'block';
        if (requestsContainer) requestsContainer.style.display = 'none';
    } else {
        if (eventsTabBtn) eventsTabBtn.classList.remove('active');
        if (requestsTabBtn) requestsTabBtn.classList.add('active');
        if (eventsContainer) eventsContainer.style.display = 'none';
        if (requestsContainer) requestsContainer.style.display = 'block';
    }
    
    renderCurrentTab();
}

function formatDate(dateStr) {
    if (!dateStr) return 'Дата не указана';
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function goBack() {
    window.location.href = 'feed.html';
}

function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', loadMyAnketas);