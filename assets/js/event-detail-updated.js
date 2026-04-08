// Данные о мероприятии (обновлённые)
let currentEvent = null;
let selectedFriendsToAdd = [];

// Список доступных друзей
let availableFriends = [
    { id: 1, name: "Анна", initial: "А", status: "Онлайн" },
    { id: 2, name: "Михаил", initial: "М", status: "Онлайн" },
    { id: 3, name: "Екатерина", initial: "Е", status: "Был(а) недавно" },
    { id: 4, name: "Дмитрий", initial: "Д", status: "Онлайн" },
    { id: 5, name: "Ольга", initial: "О", status: "Был(а) вчера" }
];

// Загрузка данных мероприятия
function loadEventData() {
    const eventId = localStorage.getItem('selectedEventId');
    if (!eventId) {
        alert('Мероприятие не найдено');
        window.location.href = 'my-anketas.html';
        return;
    }
    
    // Базовые данные
    currentEvent = {
        id: parseInt(eventId),
        eventTitle: "Просмотр фильма Аватар",
        description: "Предлагаю сходить в кино на 3-ю часть Аватара, после поделиться впечатлением в кафе",
        date: "2026-03-10",
        location: "Мираж",
        availableSeats: 5,
        invitedFriends: ["Анна", "Михаил"],
        participants: [
            { name: "Ирина", role: "Участник", initial: "И" },
            { name: "Иван", role: "Админ", initial: "И" },
            { name: "Анастасия", role: "Участник", initial: "А" }
        ],
        requests: [
            { name: "Коля", initial: "К" }
        ]
    };
    
    // Загружаем принятых участников из localStorage
    const acceptedParticipants = JSON.parse(localStorage.getItem('acceptedParticipants') || '[]');
    if (acceptedParticipants.length > 0) {
        acceptedParticipants.forEach(participant => {
            const exists = currentEvent.participants.some(p => p.name === participant.name);
            if (!exists) {
                currentEvent.participants.push({
                    name: participant.name,
                    role: "Участник",
                    initial: participant.initial
                });
                currentEvent.availableSeats++;
            }
        });
        localStorage.removeItem('acceptedParticipants');
    }
    
    renderEventPage();
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
    const participants = currentEvent.participants || [];
    const container = document.getElementById('participantsList');
    
    if (participants.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-person-plus"></i>
                <p>Пока нет участников</p>
            </div>
        `;
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
                <div class="delete-member" onclick="deleteParticipant(${index})">
                    <i class="bi bi-x-circle"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// Рендер запросов
function renderRequests() {
    const requests = currentEvent.requests || [];
    const container = document.getElementById('requestsList');
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-chat-dots"></i>
                <p>Нет активных запросов</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = requests.map(r => `
        <div class="request-item">
            <div class="request-left">
                <div class="request-avatar-gray">${r.initial}</div>
                <div class="request-name">${escapeHtml(r.name)}</div>
            </div>
            <div class="request-details" onclick="viewRequest('${r.name}')">
                Подробнее <i class="bi bi-arrow-right"></i>
            </div>
        </div>
    `).join('');
}

// Удаление участника
function deleteParticipant(index) {
    if (confirm('Удалить участника?')) {
        currentEvent.participants.splice(index, 1);
        renderParticipants();
        saveEventToLocalStorage();
    }
}

function saveEventToLocalStorage() {
    const savedAnketas = localStorage.getItem('userAnketas');
    if (savedAnketas) {
        let events = JSON.parse(savedAnketas);
        const eventIndex = events.findIndex(e => e.id === currentEvent.id);
        if (eventIndex !== -1) {
            events[eventIndex] = currentEvent;
            localStorage.setItem('userAnketas', JSON.stringify(events));
        }
    }
}

function openAddFriendsModal() {
    selectedFriendsToAdd = [];
    const modal = document.getElementById('friendsModal');
    renderFriendsModalList();
    modal.classList.add('show');
}

function closeFriendsModal() {
    const modal = document.getElementById('friendsModal');
    modal.classList.remove('show');
}

function renderFriendsModalList() {
    const container = document.getElementById('friendsModalList');
    if (!container) return;
    
    container.innerHTML = availableFriends.map(friend => `
        <div class="friend-item ${selectedFriendsToAdd.some(f => f.id === friend.id) ? 'selected' : ''}" onclick="toggleFriendSelection(${friend.id})">
            <div class="friend-avatar-gray">${friend.initial}</div>
            <div class="friend-info">
                <div class="friend-name">${escapeHtml(friend.name)}</div>
                <div class="friend-status">${friend.status}</div>
            </div>
            <div class="friend-check">
                ${selectedFriendsToAdd.some(f => f.id === friend.id) ? '<i class="bi bi-check-lg"></i>' : ''}
            </div>
        </div>
    `).join('');
}

function toggleFriendSelection(friendId) {
    const friend = availableFriends.find(f => f.id === friendId);
    const index = selectedFriendsToAdd.findIndex(f => f.id === friendId);
    
    if (index === -1) {
        selectedFriendsToAdd.push(friend);
    } else {
        selectedFriendsToAdd.splice(index, 1);
    }
    
    renderFriendsModalList();
}

function confirmAddFriends() {
    if (selectedFriendsToAdd.length === 0) {
        alert('Выберите хотя бы одного друга');
        return;
    }
    
    selectedFriendsToAdd.forEach(friend => {
        currentEvent.participants.push({
            name: friend.name,
            role: "Участник",
            initial: friend.initial
        });
        currentEvent.availableSeats++;
    });
    
    saveEventToLocalStorage();
    renderParticipants();
    closeFriendsModal();
    alert(`Добавлено ${selectedFriendsToAdd.length} участников`);
}

function openChat() {
    alert('Чат мероприятия (будет реализован позже)');
}

function viewRequest(requestName) {
    alert(`Просмотр запроса от ${requestName} (будет реализовано позже)`);
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
    window.location.href = 'my-anketas.html';
}

function initEventDetailPage() {
    loadEventData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventDetailPage);
} else {
    initEventDetailPage();
}