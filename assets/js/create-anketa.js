let currentCommunity = { id: 1, name: "Киноклуб" };
let selectedGender = "any";
let selectedFriends = [];

// Список доступных друзей
let availableFriends = [
    { id: 1, name: "Анна", initial: "А", status: "Онлайн" },
    { id: 2, name: "Михаил", initial: "М", status: "Онлайн" },
    { id: 3, name: "Екатерина", initial: "Е", status: "Был(а) недавно" }
];

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

// ========== АВТОЗАПОЛНЕНИЕ ==========
function autoFillForm() {
    document.getElementById('eventTitle').value = 'Просмотр фильма Аватар';
    document.getElementById('description').value = 'Посмотрим фильм, а потом обсудим в кафе!';
    document.getElementById('location').value = 'Новая Галандия';
    document.getElementById('peopleCount').value = '4';
    document.getElementById('ageMin').value = '20';
    document.getElementById('ageMax').value = '45';
    
    // Выбираем пол "Неважно"
    document.querySelectorAll('.gender-option').forEach((btn, index) => {
        if (index === 2) {
            btn.classList.add('active');
            selectedGender = 'any';
        } else {
            btn.classList.remove('active');
        }
    });
}

function loadCommunityData() {
    const communityId = localStorage.getItem('selectedCommunityId');
    if (communityId) {
        const communities = {
            1: "Киноклуб", 2: "Беговой клуб", 3: "Книжный клуб"
        };
        currentCommunity.name = communities[communityId] || "Киноклуб";
    }
    document.getElementById('communityName').textContent = currentCommunity.name;
}

function selectGender(element, gender) {
    document.querySelectorAll('.gender-option').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    selectedGender = gender;
}

// Открытие модального окна выбора друзей
function openAddFriendsModal() {
    const modalHtml = `
        <div class="friends-modal-overlay" id="friendModalOverlay">
            <div class="friends-modal-content">
                <div class="friends-modal-header">
                    <h3>Выберите друзей</h3>
                    <i class="bi bi-x-lg" onclick="closeFriendModal()"></i>
                </div>
                <div class="friends-modal-list" id="friendModalList">
                    ${availableFriends.map(f => `
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
                <button class="modal-confirm-btn" onclick="confirmAddFriends()">Добавить выбранных</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    window.selectedFriendsIds = [];
    
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

function closeFriendModal() {
    const modal = document.getElementById('friendModalOverlay');
    if (modal) modal.remove();
}

function confirmAddFriends() {
    selectedFriends = availableFriends.filter(f => window.selectedFriendsIds.includes(f.id));
    closeFriendModal();
    updateFriendsPreview();
}

function updateFriendsPreview() {
    const container = document.getElementById('selectedFriendsPreview');
    const countSpan = document.getElementById('selectedFriendsCount');
    
    if (!container) return;
    
    if (selectedFriends.length === 0) {
        container.innerHTML = '';
        if (countSpan) countSpan.textContent = '0';
        return;
    }
    
    container.innerHTML = selectedFriends.map(f => `
        <div class="selected-friend-avatar" onclick="event.stopPropagation(); removeFriend(${f.id})">
            ${f.initial}
            <div class="remove-friend">
                <i class="bi bi-x"></i>
            </div>
        </div>
    `).join('');
    
    if (countSpan) countSpan.textContent = selectedFriends.length;
}

function removeFriend(friendId) {
    selectedFriends = selectedFriends.filter(f => f.id !== friendId);
    updateFriendsPreview();
    window.updateFriendsPreview();
}

function publishAnketa() {
    const eventTitle = document.getElementById('eventTitle')?.value || '';
    const description = document.getElementById('description')?.value || '';
    const dateStart = document.getElementById('dateStart')?.value || '';
    const location = document.getElementById('location')?.value || '';
    const peopleCount = document.getElementById('peopleCount')?.value || '2';
    const ageMin = document.getElementById('ageMin')?.value || '18';
    const ageMax = document.getElementById('ageMax')?.value || '99';
    
    // Подсказка валидации — оставляем
    if (!eventTitle || !description || !dateStart || !location) {
        alert('Заполните все обязательные поля');
        return;
    }
    
    // Формируем список участников
    const participants = [
        { name: "Вы", role: "Организатор", initial: "В" }
    ];
    
    selectedFriends.forEach(friend => {
        participants.push({
            name: friend.name,
            role: "Участник",
            initial: friend.initial
        });
    });
    
    const newAnketa = {
        id: Date.now(),
        eventTitle: eventTitle,
        description: description,
        date: dateStart,
        location: location,
        availableSeats: (parseInt(peopleCount) || 2) + selectedFriends.length,
        ageMin: parseInt(ageMin) || 18,
        ageMax: parseInt(ageMax) || 99,
        gender: selectedGender,
        participants: participants,
        requests: [
            { name: "Надя", initial: "Н" }
        ],
        invitedFriends: selectedFriends.map(f => f.name),
        createdAt: new Date().toISOString()
    };
    
    let existingAnketas = JSON.parse(localStorage.getItem('userAnketas') || '[]');
    existingAnketas.push(newAnketa);
    localStorage.setItem('userAnketas', JSON.stringify(existingAnketas));
    
    // Сохраняем ID созданного мероприятия
    localStorage.setItem('selectedEventId', newAnketa.id);
    
    // Переход на страницу мероприятия без алерта
    window.location.href = 'event-detail.html';
}

function goBack() { 
    window.history.back();
}

document.addEventListener('DOMContentLoaded', function() {
    loadCommunityData();
    
    const today = new Date().toISOString().split('T')[0];
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');
    
    if (dateStartInput) dateStartInput.value = today;
    if (dateEndInput) dateEndInput.value = today;
    
    // Закрытие меню при клике на пункты
    document.querySelectorAll('.side-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            setTimeout(() => toggleSideMenu(), 150);
        });
    });
});

// Обновление превью приглашённых друзей
window.updateFriendsPreview = function() {
    const container = document.getElementById('invitedFriendsList');
    const counter = document.getElementById('friendsCounter');
    const countSpan = document.getElementById('friendsCount');
    
    if (!container) return;
    
    if (selectedFriends.length === 0) {
        container.innerHTML = '';
        if (counter) counter.style.display = 'none';
        return;
    }
    
    container.innerHTML = selectedFriends.map(friend => `
        <div class="invited-friend-avatar">
            ${friend.initial}
            <div class="remove-friend" onclick="event.stopPropagation(); removeFriend(${friend.id})">
                <i class="bi bi-x"></i>
            </div>
        </div>
    `).join('');
    
    if (countSpan) countSpan.textContent = selectedFriends.length;
    if (counter) counter.style.display = 'flex';
};

window.removeFriend = function(friendId) {
    selectedFriends = selectedFriends.filter(f => f.id !== friendId);
    updateFriendsPreview();
    window.updateFriendsPreview();
};