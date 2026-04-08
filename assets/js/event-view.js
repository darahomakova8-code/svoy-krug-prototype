// Данные о мероприятии
let currentEvent = null;
let hasApplied = false;

// Загрузка данных мероприятия
function loadEventData() {
    const eventId = localStorage.getItem('viewEventId');
    if (!eventId) {
        alert('Мероприятие не найдено');
        window.location.href = 'feed.html';
        return;
    }
    
    // Тестовые данные мероприятия Ивана Иванова
    currentEvent = {
        id: parseInt(eventId),
        eventTitle: "Просмотр \"Аватар\"",
        description: "Предлагаю сходить в кино на 3-ю часть Аватара, после поделиться впечатлением в кафе",
        date: "2026-03-10",
        location: "Мираж",
        availableSeats: 5,
        author: "Иван Иванов",
        authorInitial: "И",
        participants: [
            { name: "Иван Иванов", role: "Организатор", initial: "И" },
            { name: "Анна Смирнова", role: "Участник", initial: "А" },
            { name: "Дмитрий Петров", role: "Участник", initial: "Д" }
        ]
    };
    
    checkAppliedStatus();
}

// Проверка статуса заявки
function checkAppliedStatus() {
    const appliedEvents = JSON.parse(localStorage.getItem('appliedEvents') || '[]');
    hasApplied = appliedEvents.includes(currentEvent.id);
    console.log('🔍 Проверка заявки:', { 
        eventId: currentEvent.id, 
        appliedEvents: appliedEvents, 
        hasApplied: hasApplied 
    });
    renderEventPage();
}

// Рендер страницы
function renderEventPage() {
    document.getElementById('eventTitle').textContent = currentEvent.eventTitle;
    document.getElementById('eventDescription').textContent = currentEvent.description;
    document.getElementById('eventDate').innerHTML = `<i class="bi bi-calendar"></i> ${formatDate(currentEvent.date)}`;
    document.getElementById('eventLocation').innerHTML = `<i class="bi bi-geo-alt"></i> ${currentEvent.location}`;
    document.getElementById('eventSeats').innerHTML = `<i class="bi bi-people"></i> ${currentEvent.availableSeats} доступных места`;
    
    renderParticipants();
    renderApplyButton();
}

// Рендер участников
function renderParticipants() {
    const participants = currentEvent.participants || [];
    const container = document.getElementById('participantsList');
    
    if (participants.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bi bi-person-plus"></i><p>Пока нет участников</p></div>';
        return;
    }
    
    container.innerHTML = participants.map(p => `
        <div class="member-item">
            <div class="member-left">
                <div class="member-avatar-gray">${p.initial}</div>
                <div class="member-info">
                    <div class="member-name">${escapeHtml(p.name)}</div>
                    ${p.role ? `<div class="member-role">${escapeHtml(p.role)}</div>` : ''}
                </div>
            </div>
            <div class="member-right">
                <div class="view-profile" onclick="viewProfile('${p.name}')">
                    <i class="bi bi-arrow-right"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// Рендер кнопки подачи заявки
function renderApplyButton() {
    const btn = document.getElementById('applyButton');
    if (!btn) return;
    
    if (hasApplied) {
        btn.textContent = '✓ Заявка отправлена';
        btn.classList.add('applied');
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.textContent = 'Подать заявку';
        btn.classList.remove('applied');
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

// Подать заявку - переход на страницу заполнения
function applyForEvent() {
    if (hasApplied) {
        alert('Вы уже подали заявку на это мероприятие');
        return;
    }
    
    // Переходим на страницу заполнения заявки
    window.location.href = 'apply-form.html';
}

// Просмотр профиля участника (заглушка)
function viewProfile(userName) {
    alert(`Просмотр профиля пользователя ${userName} (будет реализовано позже)`);
}

// Поделиться (заглушка)
function shareEvent() {
    alert(`Поделиться мероприятием "${currentEvent.eventTitle}" (будет реализовано позже)`);
}

// Форматирование даты
function formatDate(dateStr) {
    if (!dateStr) return 'Дата не указана';
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Экранирование HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Возврат
function goBack() {
    window.location.href = 'feed.html';
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

function navigateTo(page) {
    window.location.href = page;
}

// Инициализация
function initEventViewPage() {
    loadEventData();
}

document.addEventListener('DOMContentLoaded', initEventViewPage);