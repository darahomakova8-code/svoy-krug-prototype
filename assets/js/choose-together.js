// Данные чатов (хранятся в localStorage)
let chats = [];

// Загрузка чатов из localStorage
function loadChats() {
    const saved = localStorage.getItem('chooseTogetherChats');
    if (saved) {
        chats = JSON.parse(saved);
    } else {
        // Пример данных для демонстрации
        chats = [
            {
                id: 1,
                name: "Пасха",
                participants: 3,
                avatar: "ПC",
                createdAt: "2026-03-28"
            }
        ];
        saveChats();
    }
    renderChats();
}

// Сохранение чатов
function saveChats() {
    localStorage.setItem('chooseTogetherChats', JSON.stringify(chats));
}

// Отображение чатов
function renderChats() {
    const container = document.getElementById('chatsList');
    if (!container) return;
    
    if (chats.length === 0) {
        container.innerHTML = `
            <div class="empty-chats">
                <i class="bi bi-chat-dots"></i>
                <p>У вас пока нет чатов</p>
                <p style="font-size: 12px;">Создайте первый чат, чтобы начать выбирать мероприятия вместе!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = chats.map(chat => `
        <div class="chat-card">
            <div class="chat-avatar" onclick="openChat(${chat.id})">${escapeHtml(chat.avatar)}</div>
            <div class="chat-info" onclick="openChat(${chat.id})">
                <h3>${escapeHtml(chat.name)}</h3>
                <div class="chat-meta">
                    <span><i class="bi bi-people"></i> ${chat.participants} ${getParticipantsText(chat.participants)}</span>
                </div>
                <span class="chat-action">Выберите мероприятия <i class="bi bi-arrow-right"></i></span>
            </div>
            <button class="delete-chat-btn" onclick="event.stopPropagation(); confirmDeleteChat(${chat.id})" title="Удалить чат">
                <i class="bi bi-trash3"></i>
            </button>
        </div>
    `).join('');
}

function getParticipantsText(count) {
    if (count === 1) return 'участник';
    if (count >= 2 && count <= 4) return 'участника';
    return 'участников';
}

// Защита от XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Подтверждение удаления чата
function confirmDeleteChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (chat && confirm(`Вы уверены, что хотите удалить чат "${chat.name}"?`)) {
        deleteChat(chatId);
    }
}

// Удаление чата
function deleteChat(chatId) {
    chats = chats.filter(chat => chat.id !== chatId);
    saveChats();
    renderChats();
}

// Открытие чата
function openChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
        // Сохраняем выбранный чат в localStorage
        localStorage.setItem('currentChat', JSON.stringify(chat));
        
        // Проверяем, есть ли активная анкета для этого чата
        const pollCreated = localStorage.getItem(`pollCreated_${chatId}`);
        
        if (pollCreated === 'true') {
            // Если анкета уже создана, переходим в чат с плашкой
            window.location.href = 'chat-with-poll.html';
        } else {
            // Если анкета не создана, переходим в обычный чат
            window.location.href = 'chat.html';
        }
    }
}

// Навигация - ВСЕГДА на главную страницу
function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    // Возврат на главную страницу
    window.location.href = '../index.html';
}

// Открытие бокового меню
function openSideMenu() {
    let sideMenu = document.getElementById('globalSideMenu');
    let overlay = document.getElementById('globalOverlay');
    
    if (!sideMenu) {
        sideMenu = document.createElement('div');
        sideMenu.id = 'globalSideMenu';
        sideMenu.className = 'side-menu';
        sideMenu.innerHTML = `
            <div class="side-menu-header">
                <div class="close-menu" onclick="closeGlobalSideMenu()">
                    <i class="bi bi-x-lg"></i>
                </div>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="user-name">Гость</div>
                </div>
            </div>
            <nav class="side-menu-nav">
                <div class="side-menu-item" onclick="navigateTo('../pages/community/feed.html')">
                    <i class="bi bi-people-fill"></i>
                    <span>Найти компанию</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('../pages/community/feed.html')">
                    <i class="bi bi-person-heart"></i>
                    <span>Друзья</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('../pages/community/profile.html')">
                    <i class="bi bi-file-text-fill"></i>
                    <span>Мои анкеты</span>
                </div>
                <div class="side-menu-divider"></div>
                <div class="side-menu-section-title">
                    <span>Выбираем вместе</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('choose-together.html')">
                    <i class="bi bi-plus-circle"></i>
                    <span>Создать чат</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('choose-together.html')">
                    <i class="bi bi-chat-text"></i>
                    <span>Мои чаты</span>
                </div>
                <div class="side-menu-divider"></div>
                <div class="side-menu-item" onclick="alert('🏆 Челленджи скоро!')">
                    <i class="bi bi-trophy-fill"></i>
                    <span>Челленджи</span>
                </div>
                <div class="side-menu-item" onclick="alert('🎡 Колесо удачи скоро!')">
                    <i class="bi bi-suit-club-fill"></i>
                    <span>Колесо удачи</span>
                </div>
            </nav>
        `;
        document.body.appendChild(sideMenu);
        
        overlay = document.createElement('div');
        overlay.id = 'globalOverlay';
        overlay.className = 'overlay';
        overlay.onclick = closeGlobalSideMenu;
        document.body.appendChild(overlay);
        
        const style = document.createElement('style');
        style.textContent = `
            .side-menu {
                position: fixed; top: 0; left: -300px; width: 280px; height: 100%;
                background: white; z-index: 1000; transition: left 0.3s ease;
                box-shadow: 2px 0 20px rgba(0,0,0,0.1); overflow-y: auto;
            }
            .side-menu.open { left: 0; }
            .side-menu-header { padding: 20px; border-bottom: 1px solid #f0f0f0; background: linear-gradient(135deg, #f5f9ff 0%, #eef3fc 100%); }
            .close-menu { text-align: right; font-size: 24px; cursor: pointer; margin-bottom: 20px; color: #F41D91; }
            .user-info { display: flex; align-items: center; gap: 12px; }
            .user-avatar { font-size: 48px; color: #F41D91; }
            .user-name { font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #F41D91 0%, #F2711E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
            .side-menu-nav { padding: 20px; }
            .side-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; cursor: pointer; border-radius: 12px; transition: all 0.2s; }
            .side-menu-item i { font-size: 22px; color: #F41D91; width: 32px; }
            .side-menu-item span { font-size: 16px; color: #333; }
            .side-menu-item:active { background: #eef3fc; transform: translateX(4px); }
            .side-menu-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(244, 29, 145, 0.2), transparent); margin: 16px 0; }
            .side-menu-section-title { padding: 8px 0 4px 0; margin-bottom: 4px; }
            .side-menu-section-title span { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; background: linear-gradient(135deg, #F41D91 0%, #F2711E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
            .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; display: none; }
            .overlay.show { display: block; }
        `;
        document.head.appendChild(style);
    }
    
    sideMenu.classList.add('open');
    overlay.classList.add('show');
}

function closeGlobalSideMenu() {
    const sideMenu = document.getElementById('globalSideMenu');
    const overlay = document.getElementById('globalOverlay');
    if (sideMenu) sideMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadChats();
    
    // Активная кнопка в нижнем меню (домик)
    const navItems = document.querySelectorAll('.nav-icon-item');
    navItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === 1) item.classList.add('active');
    });
});