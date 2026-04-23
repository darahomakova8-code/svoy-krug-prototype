// Данные чата (только диалоги, без плашки)
let messages = [
    {
        id: 1,
        type: 'system',
        text: 'Вы создали чат: "Планы на выходные"',
        timestamp: '2026-03-10T00:00:00'
    },
    {
        id: 2,
        type: 'message',
        sender: 'Ирина',
        senderAvatar: 'И',
        text: 'Всем привет! Давайте решим куда мы в итоге пойдем?',
        timestamp: '2026-03-10T12:30:00',
        isOwn: true
    },
    {
        id: 3,
        type: 'system',
        text: 'Анастасия вступила в группу',
        timestamp: '2026-03-10T12:31:00'
    },
    {
        id: 4,
        type: 'system',
        text: 'Иван вступил в группу',
        timestamp: '2026-03-10T12:31:00'
    },
    {
        id: 5,
        type: 'message',
        sender: 'Анастасия',
        senderAvatar: 'А',
        text: 'Доброе утро! Давайте!',
        timestamp: '2026-03-11T12:31:00',
        isOwn: false
    },
    {
        id: 6,
        type: 'message',
        sender: 'Иван',
        senderAvatar: 'И',
        text: 'Привет! Я слышал, что в этом приложении есть быстрый способ выбрать мероприятие через функцию "Выбираем вместе"',
        timestamp: '2026-03-11T12:34:00',
        isOwn: false
    },
    {
        id: 7,
        type: 'message',
        sender: 'Ирина',
        senderAvatar: 'И',
        text: 'Хорошая мысль! Сейчас создам опрос',
        timestamp: '2026-03-11T12:37:00',
        isOwn: true
    }
];

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function renderMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    let lastDate = '';
    let html = '';
    
    messages.forEach(message => {
        const messageDate = formatDate(message.timestamp);
        
        if (messageDate !== lastDate) {
            html += `
                <div class="message-date">
                    <span>${messageDate}</span>
                </div>
            `;
            lastDate = messageDate;
        }
        
        if (message.type === 'system') {
            html += `
                <div class="system-message">
                    ${message.text}
                </div>
            `;
        } else if (message.type === 'message') {
            const messageClass = message.isOwn ? 'message-own' : 'message-other';
            html += `
                <div class="message ${messageClass}">
                    ${!message.isOwn ? `<div class="message-sender">${message.sender}</div>` : ''}
                    <div class="message-bubble">
                        ${message.text}
                    </div>
                    <div class="message-time">${formatTime(message.timestamp)}</div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    
    const messagesArea = document.getElementById('messagesArea');
    if (messagesArea) {
        setTimeout(() => {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }, 100);
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const newMessage = {
        id: Date.now(),
        type: 'message',
        sender: 'Ирина',
        senderAvatar: 'И',
        text: text,
        timestamp: new Date().toISOString(),
        isOwn: true
    };
    
    messages.push(newMessage);
    renderMessages();
    input.value = '';
}

// Функция "Выбираем вместе" — переход на фильтры
function chooseTogether() {
    // Получаем текущий чат
    const currentChat = JSON.parse(localStorage.getItem('currentChat') || '{}');
    const chatId = currentChat.id || 1;
    
    // Очищаем старые данные голосования
    localStorage.removeItem('votedEvents');
    localStorage.removeItem('hasVoted');
    localStorage.removeItem('pollVoters');
    
    // Переход на страницу фильтров
    window.location.href = 'filters.html';
}

// Функция-обёртка для вызова из панели вложений
function chooseTogetherFromAttach() {
    const panel = document.getElementById('attachPanel');
    if (panel) panel.classList.remove('show');
    chooseTogether();
}

// Функции для бокового меню
function toggleChatSideMenu() {
    const sideMenu = document.getElementById('chatSideMenu');
    const overlay = document.getElementById('chatOverlay');
    sideMenu.classList.toggle('open');
    overlay.classList.toggle('show');
}

function closeChatSideMenu() {
    const sideMenu = document.getElementById('chatSideMenu');
    const overlay = document.getElementById('chatOverlay');
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
}

function showSettings() {
    alert('Общие настройки будут доступны в следующей версии');
    closeChatSideMenu();
}

function createPoll() {
    alert('Создание опроса будет доступно в следующей версии');
    closeChatSideMenu();
}

function showNotifications() {
    alert('Уведомления будут доступны в следующей версии');
    closeChatSideMenu();
}

function showParticipants() {
    alert('Участники чата: Ирина, Анастасия, Иван');
    closeChatSideMenu();
}

function showSearch() {
    alert('Поиск по чату будет доступен в следующей версии');
    closeChatSideMenu();
}

function toggleAttachPanel() {
    const panel = document.getElementById('attachPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function attachPhoto() {
    alert('Выбрать фото\n\nФункция будет доступна в следующей версии');
    document.getElementById('attachPanel')?.classList.remove('show');
}

function attachVideo() {
    alert('Выбрать видео\n\nФункция будет доступна в следующей версии');
    document.getElementById('attachPanel')?.classList.remove('show');
}

function attachDocument() {
    alert('Выбрать документ\n\nФункция будет доступна в следующей версии');
    document.getElementById('attachPanel')?.classList.remove('show');
}

function attachLocation() {
    alert('Отправить локацию\n\nФункция будет доступна в следующей версии');
    document.getElementById('attachPanel')?.classList.remove('show');
}

function goBack() {
    window.location.href = 'choose-together.html';
}

// Закрытие панели при клике вне
document.addEventListener('click', function(e) {
    const panel = document.getElementById('attachPanel');
    const attachBtn = document.querySelector('.attach-btn');
    if (panel && attachBtn && !panel.contains(e.target) && !attachBtn.contains(e.target)) {
        panel.classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderMessages();
    
    const input = document.getElementById('messageInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});