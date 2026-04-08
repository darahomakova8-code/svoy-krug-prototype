let selectedFriends = [];

// Список доступных друзей
const availableFriends = [
    { id: 1, name: "Иван", avatar: "И", initial: "И" },
    { id: 2, name: "Анастасия", avatar: "А", initial: "А" },
    { id: 3, name: "Дмитрий", avatar: "Д", initial: "Д" },
    { id: 4, name: "Екатерина", avatar: "Е", initial: "Е" },
    { id: 5, name: "Сергей", avatar: "С", initial: "С" },
    { id: 6, name: "Ольга", avatar: "О", initial: "О" }
];

function renderFriendsList() {
    const container = document.getElementById('friendList');
    if (!container) return;
    
    container.innerHTML = availableFriends.map(friend => `
        <div class="friend-option" onclick="toggleFriend(${friend.id})">
            <div class="avatar">${friend.avatar}</div>
            <div class="info">
                <div class="name">${friend.name}</div>
                <div class="status">${selectedFriends.some(f => f.id === friend.id) ? 'Уже в чате' : 'Пригласить'}</div>
            </div>
            ${selectedFriends.some(f => f.id === friend.id) ? '<div class="check"><i class="bi bi-check-circle-fill"></i></div>' : ''}
        </div>
    `).join('');
}

function toggleFriend(friendId) {
    const friend = availableFriends.find(f => f.id === friendId);
    const index = selectedFriends.findIndex(f => f.id === friendId);
    
    if (index === -1) {
        selectedFriends.push(friend);
    } else {
        selectedFriends.splice(index, 1);
    }
    
    renderFriendsList();
    updateParticipantsList();
    // Убираем вызов updateInvitedFriendsList()
}

function updateParticipantsList() {
    const container = document.getElementById('participantsList');
    if (!container) return;
    
    let html = `
        <div class="participant-item">
            <div class="participant-left">
                <div class="participant-avatar">И</div>
                <div class="participant-info">
                    <div class="participant-name">Ирина</div>
                    <div class="participant-role admin">администратор</div>
                </div>
            </div>
        </div>
    `;
    
    selectedFriends.forEach(friend => {
        html += `
            <div class="participant-item">
                <div class="participant-left">
                    <div class="participant-avatar">${friend.avatar}</div>
                    <div class="participant-info">
                        <div class="participant-name">${friend.name}</div>
                        <div class="participant-role member">участник</div>
                    </div>
                </div>
                <div class="remove-participant" onclick="removeFriend(${friend.id})">
                    <i class="bi bi-x"></i>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function removeFriend(friendId) {
    selectedFriends = selectedFriends.filter(f => f.id !== friendId);
    updateParticipantsList();
    renderFriendsList();
}

function openFriendsModal() {
    document.getElementById('friendsModal').classList.add('show');
    document.getElementById('modalOverlay').style.display = 'block';
    renderFriendsList();
}

function closeFriendsModal() {
    document.getElementById('friendsModal').classList.remove('show');
    document.getElementById('modalOverlay').style.display = 'none';
}

function createNewChat() {
    const groupName = document.getElementById('groupName').value.trim();
    if (!groupName) {
        alert('Введите название группы');
        return;
    }
    
    // Сохраняем чат в localStorage
    const existingChats = localStorage.getItem('chooseTogetherChats');
    let chats = existingChats ? JSON.parse(existingChats) : [];
    
    const newChat = {
        id: Date.now(),
        name: groupName,
        participants: selectedFriends.length + 1,
        avatar: groupName.substring(0, 2).toUpperCase(),
        createdAt: new Date().toISOString().split('T')[0],
        members: [
            { id: 'current', name: 'Ирина', role: 'admin' },
            ...selectedFriends.map(f => ({ id: f.id, name: f.name, role: 'member' }))
        ]
    };
    
    chats.unshift(newChat);
    localStorage.setItem('chooseTogetherChats', JSON.stringify(chats));
    
    alert(`Чат "${groupName}" успешно создан!`);
    window.location.href = 'choose-together.html'; // Возврат на страницу со списком чатов
}

function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

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
                    <span>Сообщества</span>
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

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-icon-item');
    navItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === 1) item.classList.add('active');
    });
});