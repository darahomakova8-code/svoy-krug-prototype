// Данные чата (с плашкой анкеты)
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
    },
    {
        id: 8,
        type: 'poll_created',
        creator: 'Ирина',
        text: 'Ирина создала анкету для выбора мероприятия',
        timestamp: '2026-03-11T12:40:00',
        pollId: 1
    }
];

// Состояние голосования
let pollStatus = 'waiting'; // waiting, voted, results
let pollVotes = {
    pollId: 1,
    voters: [],
    totalParticipants: 3,
    hasCurrentUserVoted: false
};

let resultsTimeout = null;

function loadVotingResults() {
    // Получаем текущий чат
    const currentChat = JSON.parse(localStorage.getItem('currentChat') || '{}');
    const chatId = currentChat.id || 1;
    
    const hasVoted = localStorage.getItem('hasVoted');
    const savedVoters = localStorage.getItem('pollVoters');
    const savedStatus = localStorage.getItem(`pollStatus_${chatId}`);
    
    if (savedStatus === 'voted') {
        pollStatus = 'voted';
        pollVotes.hasCurrentUserVoted = true;
    } else if (savedStatus === 'results') {
        pollStatus = 'results';
        // Когда статус "results", все участники проголосовали
        pollVotes.voters = ['Ирина', 'Анастасия', 'Иван'];
        pollVotes.hasCurrentUserVoted = true;
    } else {
        pollStatus = 'waiting';
    }
    
    if (hasVoted === 'true') {
        pollVotes.hasCurrentUserVoted = true;
    }
    
    if (savedVoters) {
        pollVotes.voters = JSON.parse(savedVoters);
    }
    
    // Если статус "results", убеждаемся что счетчик показывает 3/3
    if (pollStatus === 'results') {
        pollVotes.voters = ['Ирина', 'Анастасия', 'Иван'];
    }
    
    // Если статус "voted", запускаем таймер для переключения на "results"
    if (pollStatus === 'voted' && !resultsTimeout) {
        resultsTimeout = setTimeout(() => {
            const chatId = JSON.parse(localStorage.getItem('currentChat') || '{}').id || 1;
            localStorage.setItem(`pollStatus_${chatId}`, 'results');
            pollStatus = 'results';
            pollVotes.voters = ['Ирина', 'Анастасия', 'Иван'];
            renderMessages();
            resultsTimeout = null;
        }, 3000);
    }
}

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
        } else if (message.type === 'poll_created') {
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
    
    // Добавляем карточку анкеты в зависимости от статуса
    const votersCount = pollStatus === 'results' ? 3 : pollVotes.voters.length;
    const totalCount = pollVotes.totalParticipants;
    
    let buttonHtml = '';
    
    if (pollStatus === 'results') {
        buttonHtml = `
            <button class="poll-button poll-results-btn" onclick="showResults()">
                Результаты опроса
            </button>
        `;
    } else if (pollStatus === 'voted') {
        buttonHtml = `
            <button class="poll-button poll-disabled-btn" disabled>
                Вы прошли опрос ✓
            </button>
        `;
    } else {
        buttonHtml = `
            <button class="poll-button" onclick="openPollVote()">
                Пройти опрос
            </button>
        `;
    }
    
    html += `
        <div class="poll-card">
            <div class="poll-content">
                <div class="poll-title">
                    Ирина создала анкету для выбора мероприятия
                </div>
                ${buttonHtml}
                <div class="poll-stats">
                    <i class="bi bi-people"></i> ${votersCount}/${totalCount} участников проголосовало
                </div>
            </div>
        </div>
    `;
    
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

function openPollVote() {
    window.location.href = 'vote.html';
}

function showResults() {
    window.location.href = 'match-results.html';
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
    alert('Анкета уже создана!');
    closeChatSideMenu();
}

function createSurvey() {
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

function showMonth() {
    alert('Календарь мероприятий будет доступен в следующей версии');
    closeChatSideMenu();
}

function showSearch() {
    alert('Поиск по чату будет доступен в следующей версии');
    closeChatSideMenu();
}

function toggleAttachPanel() {
    alert('Прикрепить файл\n\nФункция будет доступна в следующей версии');
}

function goBack() {
    // Возврат к списку всех чатов
    window.location.href = 'choose-together.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadVotingResults();
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