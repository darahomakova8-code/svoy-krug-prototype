// Данные мероприятия
let currentEvent = {
    id: 101,
    title: 'Неаполитанская карусель',
    date: '28 марта',
    time: '19:00',
    location: 'ул. Кушелевская дорога, 6',
    participants: 12
};

// Участники
let participants = [
    { id: 1, name: 'Анна', initial: 'А', role: 'Организатор' },
    { id: 2, name: 'Михаил', initial: 'М', role: 'Участник' },
    { id: 3, name: 'Елена', initial: 'Е', role: 'Участник' },
    { id: 4, name: 'Дмитрий', initial: 'Д', role: 'Участник' },
    { id: 5, name: 'Вы', initial: 'В', role: 'Участник', isMe: true }
];

// Сообщения
let messages = [
    { id: 1, type: 'system', text: 'Чат создан', time: '10:00' },
    { id: 2, type: 'message', sender: 'Анна', text: 'Всем привет! Кто был на чем-то похожем, как вам?', time: '10:15', isOwn: false },
    { id: 3, type: 'message', sender: 'Михаил', text: 'Интересно, рекомендую', time: '10:20', isOwn: false },
    { id: 4, type: 'message', sender: 'Вы', text: 'Хочу найти компанию, кто со мной? Предлагаю встретиться у входа', time: '10:25', isOwn: true }
];

// Загрузка данных
function loadEventData() {
    const eventId = localStorage.getItem('selectedChatEventId');
    if (eventId) {
        // Здесь можно загрузить данные из localStorage или с сервера
        const savedEvents = JSON.parse(localStorage.getItem('userAnketas') || '[]');
        const event = savedEvents.find(e => e.id == eventId);
        if (event) {
            currentEvent = {
                id: event.id,
                title: event.eventTitle,
                date: formatEventDate(event.date),
                time: event.time || '19:00',
                location: event.location,
                participants: (event.participants?.length || 0) + 1
            };
        }
    }
    updateHeader();
}

function formatEventDate(dateStr) {
    if (!dateStr) return '28 марта';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function updateHeader() {
    document.getElementById('eventTitle').textContent = currentEvent.title;
    document.getElementById('participantsCount').textContent = `${currentEvent.participants} участников`;
    document.getElementById('menuEventTitle').textContent = currentEvent.title;
    document.getElementById('menuEventDate').textContent = `${currentEvent.date}, ${currentEvent.time}`;
    document.getElementById('menuEventLocation').textContent = currentEvent.location;
    document.querySelector('.section-title').textContent = `Участники (${participants.length})`;
}

// Рендер сообщений
function renderMessages() {
    const container = document.getElementById('messagesContainer');
    let html = '';
    let lastDate = '';
    
    messages.forEach(msg => {
        if (msg.type === 'system') {
            html += `<div class="system-message">${msg.text}</div>`;
        } else {
            const messageClass = msg.isOwn ? 'message-own' : 'message-other';
            html += `
                <div class="message ${messageClass}">
                    ${!msg.isOwn ? `<div class="message-sender">${msg.sender}</div>` : ''}
                    <div class="message-bubble">${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    scrollToBottom();
}

// Рендер участников
function renderParticipants() {
    const container = document.getElementById('participantsList');
    container.innerHTML = participants.map(p => `
        <div class="participant-item">
            <div class="participant-avatar">${p.initial}</div>
            <div class="participant-info">
                <div class="participant-name">${p.name} ${p.isMe ? '(Вы)' : ''}</div>
                <div class="participant-role">${p.role}</div>
            </div>
        </div>
    `).join('');
}

// Отправка сообщения
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    messages.push({
        id: Date.now(),
        type: 'message',
        sender: 'Вы',
        text: text,
        time: time,
        isOwn: true
    });
    
    renderMessages();
    input.value = '';
}

// Прокрутка вниз
function scrollToBottom() {
    const area = document.getElementById('messagesArea');
    setTimeout(() => area.scrollTop = area.scrollHeight, 50);
}

// Меню чата
function toggleChatMenu() {
    document.getElementById('chatMenu').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

// Панель вложений
function toggleAttachPanel() {
    document.getElementById('attachPanel').classList.toggle('show');
}

function sendPhoto() {
    alert('Фото будет отправлено');
    document.getElementById('attachPanel').classList.remove('show');
}

function sendLocation() {
    alert('Локация будет отправлена');
    document.getElementById('attachPanel').classList.remove('show');
}

// Покинуть чат
function leaveChat() {
    if (confirm('Вы уверены, что хотите покинуть чат?')) {
        alert('Вы покинули чат');
        goBack();
    }
}

// Навигация
function goBack() {
    window.history.back();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadEventData();
    renderMessages();
    renderParticipants();
    
    const input = document.getElementById('messageInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('attachPanel');
        const attachBtn = document.querySelector('.attach-btn');
        if (panel && !panel.contains(e.target) && !attachBtn.contains(e.target)) {
            panel.classList.remove('show');
        }
    });
});