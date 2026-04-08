// Данные о мероприятии
let currentEvent = null;

// Загрузка данных мероприятия
function loadEventData() {
    const eventId = localStorage.getItem('selectedEventId');
    if (!eventId) {
        alert('Мероприятие не найдено');
        window.location.href = 'my-anketas.html';
        return;
    }
    
    const savedAnketas = localStorage.getItem('userAnketas');
    if (savedAnketas) {
        const events = JSON.parse(savedAnketas);
        currentEvent = events.find(e => e.id == eventId);
    }
    
    if (!currentEvent) {
        currentEvent = {
            id: parseInt(eventId),
            eventTitle: "Просмотр фильма Аватар",
            description: "Предлагаю сходить в кино на 3-ю часть Аватара, после поделиться впечатлением в кафе",
            date: "2026-03-10",
            location: "Мираж",
            availableSeats: 5,
            participants: [
                { name: "Ирина", role: "Участник", initial: "И" },
                { name: "Иван", role: "Админ", initial: "И" }
            ],
            requests: [
                { name: "Надя", initial: "Н" },
                { name: "Коля", initial: "К" }
            ]
        };
        saveEventToLocalStorage();
    }
    
    renderEventPage();
}

// Сохранение в localStorage
function saveEventToLocalStorage() {
    let events = JSON.parse(localStorage.getItem('userAnketas') || '[]');
    const eventIndex = events.findIndex(e => e.id == currentEvent.id);
    if (eventIndex !== -1) {
        events[eventIndex] = currentEvent;
    } else {
        events.push(currentEvent);
    }
    localStorage.setItem('userAnketas', JSON.stringify(events));
}

// Рендер страницы
function renderEventPage() {
    document.getElementById('eventTitle').textContent = currentEvent.eventTitle;
    document.getElementById('eventDescription').textContent = currentEvent.description;
    document.getElementById('eventDate').innerHTML = `<i class="bi bi-calendar"></i> ${formatDate(currentEvent.date)}`;
    document.getElementById('eventLocation').innerHTML = `<i class="bi bi-geo-alt"></i> ${currentEvent.location}`;
    document.getElementById('eventSeats').innerHTML = `<i class="bi bi-people"></i> ${currentEvent.availableSeats} участников`;
    
    renderParticipants();
    renderRequests();
}

// Рендер участников
function renderParticipants() {
    const container = document.getElementById('participantsList');
    const participants = currentEvent.participants || [];
    
    if (participants.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bi bi-person-plus"></i><p>Пока нет участников</p></div>';
        return;
    }
    
    container.innerHTML = participants.map((p, index) => `
        <div class="member-item">
            <div class="member-left">
                <div class="member-avatar-gray">${p.initial}</div>
                <div class="member-info">
                    <div class="member-name">${escapeHtml(p.name)}</div>
                    ${p.role ? `<div class="member-role">${escapeHtml(p.role)}</div>` : ''}
                </div>
            </div>
            <div class="member-right">
                <div class="delete-member" onclick="deleteParticipant(${index})"><i class="bi bi-x-circle"></i></div>
            </div>
        </div>
    `).join('');
}

// Рендер запросов
function renderRequests() {
    const container = document.getElementById('requestsList');
    const requests = currentEvent.requests || [];
    
    if (requests.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bi bi-chat-dots"></i><p>Нет активных запросов</p></div>';
        return;
    }
    
    container.innerHTML = requests.map(r => `
        <div class="request-item">
            <div class="request-left">
                <div class="request-avatar-gray">${r.initial}</div>
                <div class="request-name">${escapeHtml(r.name)}</div>
            </div>
            <div class="request-details" onclick="viewRequest('${r.name}')">Подробнее <i class="bi bi-arrow-right"></i></div>
        </div>
    `).join('');
}

// Удаление участника
function deleteParticipant(index) {
    if (confirm('Удалить участника?')) {
        currentEvent.participants.splice(index, 1);
        saveEventToLocalStorage();
        renderParticipants();
    }
}

// Добавление друга в мероприятие
function addFriendToEvent(friend) {
    currentEvent.participants.push({
        name: friend.name,
        role: "Участник",
        initial: friend.initial
    });
    currentEvent.availableSeats++;
    saveEventToLocalStorage();
    renderParticipants();
}

// Открытие модального окна добавления друзей
function openAddFriendsModal() {
    const friends = [
        { id: 1, name: "Анна", initial: "А", status: "Онлайн" },
        { id: 2, name: "Михаил", initial: "М", status: "Онлайн" },
        { id: 3, name: "Екатерина", initial: "Е", status: "Был(а) недавно" },
        { id: 4, name: "Дмитрий", initial: "Д", status: "Онлайн" },
        { id: 5, name: "Ольга", initial: "О", status: "Был(а) вчера" }
    ];
    
    let selectedIds = [];
    
    const modalHtml = `
        <div class="friends-modal-overlay" id="friendModalOverlay">
            <div class="friends-modal-content">
                <div class="friends-modal-header">
                    <h3>Выберите друзей</h3>
                    <i class="bi bi-x-lg" onclick="closeFriendModal()"></i>
                </div>
                <div class="friends-modal-list" id="friendModalList">
                    ${friends.map(f => `
                        <div class="friend-item" data-id="${f.id}">
                            <div class="friend-avatar-gray">${f.initial}</div>
                            <div class="friend-info">
                                <div class="friend-name">${f.name}</div>
                                <div class="friend-status">${f.status}</div>
                            </div>
                            <div class="friend-check"></div>
                        </div>
                    `).join('')}
                </div>
                <button class="modal-confirm-btn" onclick="confirmAddFriendsFromModal()">Добавить выбранных</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    window.selectedFriendsData = friends;
    window.selectedFriendsIds = selectedIds;
    
    document.querySelectorAll('.friend-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            if (window.selectedFriendsIds.includes(id)) {
                window.selectedFriendsIds = window.selectedFriendsIds.filter(i => i !== id);
                this.classList.remove('selected');
                this.querySelector('.friend-check').innerHTML = '';
            } else {
                window.selectedFriendsIds.push(id);
                this.classList.add('selected');
                this.querySelector('.friend-check').innerHTML = '<i class="bi bi-check-lg"></i>';
            }
        });
    });
}

// Подтверждение добавления друзей
window.confirmAddFriendsFromModal = function() {
    const selected = window.selectedFriendsData.filter(f => window.selectedFriendsIds.includes(f.id));
    if (selected.length === 0) {
        alert('Выберите хотя бы одного друга');
        return;
    }
    selected.forEach(f => addFriendToEvent(f));
    closeFriendModal();
    alert(`✅ Добавлено ${selected.length} участников`);
};

// Закрытие модального окна
function closeFriendModal() {
    const modal = document.getElementById('friendModalOverlay');
    if (modal) modal.remove();
}

// Просмотр запроса
function viewRequest(requestName) {
    localStorage.setItem('selectedProfileName', requestName);
    window.location.href = 'profile-view.html';
}

// Удаление мероприятия
function deleteEvent() {
    if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        let events = JSON.parse(localStorage.getItem('userAnketas') || '[]');
        events = events.filter(e => e.id != currentEvent.id);
        localStorage.setItem('userAnketas', JSON.stringify(events));
        alert('Мероприятие удалено');
        window.location.href = 'my-anketas.html';
    }
}

// Чат (заглушка)
function openChat() {
    alert('💬 Чат мероприятия (будет реализован позже)');
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

// Возврат на страницу моих анкет
function goBack() {
    window.location.href = 'my-anketas.html';
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
function initEventDetailPage() {
    loadEventData();
}

document.addEventListener('DOMContentLoaded', initEventDetailPage);
