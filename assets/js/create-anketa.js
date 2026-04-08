let currentCommunity = { id: 1, name: "Киноклуб" };
let selectedGender = "any";
let selectedFriends = [];

// Список доступных друзей
let availableFriends = [
    { id: 1, name: "Анна", initial: "А", status: "Онлайн" },
    { id: 2, name: "Михаил", initial: "М", status: "Онлайн" },
    { id: 3, name: "Екатерина", initial: "Е", status: "Был(а) недавно" },
    { id: 4, name: "Дмитрий", initial: "Д", status: "Онлайн" },
    { id: 5, name: "Ольга", initial: "О", status: "Был(а) вчера" }
];

function loadCommunityData() {
    const communityId = localStorage.getItem('selectedCommunityId');
    if (communityId) {
        const communities = {
            1: "Киноклуб", 2: "Беговой клуб", 3: "Team-билдинг",
            4: "Книжный клуб", 5: "Музейный гид", 6: "Собаководы"
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
    selectedFriends = [];
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
    if (selectedFriends.length === 0) {
        alert('Выберите хотя бы одного друга');
        return;
    }
    closeFriendModal();
    updateFriendsPreview();
}

function updateFriendsPreview() {
    const container = document.getElementById('selectedFriendsPreview');
    const countSpan = document.getElementById('selectedFriendsCount');
    
    if (selectedFriends.length === 0) {
        container.innerHTML = '';
        countSpan.textContent = '0';
        return;
    }
    
    container.innerHTML = selectedFriends.map(f => `
        <div class="selected-friend-avatar">${f.initial}</div>
    `).join('');
    countSpan.textContent = selectedFriends.length;
}

function removeFriend(friendId) {
    selectedFriends = selectedFriends.filter(f => f.id !== friendId);
    updateFriendsPreview();
}

function publishAnketa() {
    const eventTitle = document.getElementById('eventTitle').value;
    const description = document.getElementById('description').value;
    const dateStart = document.getElementById('dateStart').value;
    const location = document.getElementById('location').value;
    const peopleCount = document.getElementById('peopleCount').value;
    const ageMin = document.getElementById('ageMin').value;
    const ageMax = document.getElementById('ageMax').value;
    
    if (!eventTitle || !description || !dateStart || !location) {
        alert('Заполните все обязательные поля');
        return;
    }
    
    // Формируем список участников: организатор + выбранные друзья
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
            { name: "Надя", initial: "Н" },
            { name: "Коля", initial: "К" }
        ],
        invitedFriends: selectedFriends.map(f => f.name),
        createdAt: new Date().toISOString()
    };
    
    let existingAnketas = JSON.parse(localStorage.getItem('userAnketas') || '[]');
    existingAnketas.push(newAnketa);
    localStorage.setItem('userAnketas', JSON.stringify(existingAnketas));
    
    alert(`Анкета "${eventTitle}" опубликована! Приглашено друзей: ${selectedFriends.length}`);
    window.location.href = 'my-anketas.html';
}

function goBack() { 
    window.location.href = 'detail.html'; 
}

document.addEventListener('DOMContentLoaded', function() {
    loadCommunityData();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateStart').value = today;
    document.getElementById('dateEnd').value = today;
});

// В конец файла добавь:
window.updateFriendsPreview = function() {
    const container = document.getElementById('invitedFriendsList');
    const counter = document.getElementById('friendsCounter');
    const countSpan = document.getElementById('friendsCount');
    
    if (!container) return;
    
    if (selectedFriends.length === 0) {
        container.innerHTML = '';
        counter.style.display = 'none';
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
    
    countSpan.textContent = selectedFriends.length;
    counter.style.display = 'flex';
};

window.removeFriend = function(friendId) {
    selectedFriends = selectedFriends.filter(f => f.id !== friendId);
    updateFriendsPreview();
};