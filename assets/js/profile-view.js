let currentProfile = null;

function loadProfileData() {
    const profileName = localStorage.getItem('selectedProfileName');
    if (!profileName) { 
        alert('Анкета не найдена'); 
        window.location.href = 'event-detail.html'; 
        return; 
    }
    
    currentProfile = {
        name: "Надя Кластеровна", 
        age: 30, 
        verified: true, 
        initial: "Н",
        description: "Люблю кино, увлекаюсь просмотром анимации, любимый герой Годко Сатору",
        hobbies: ["Беговые лыжи", "Вязание", "Учеба"],
        likedEvents: ["Концерт \"Егор криг\"", "Киновечер \"Советское кино\"", "Мастер класс по боксу"]
    };
    
    renderProfilePage();
}

function renderProfilePage() {
    document.getElementById('profileName').innerHTML = `${escapeHtml(currentProfile.name)}${currentProfile.verified ? '<i class="bi bi-patch-check-fill verified-badge"></i>' : ''}`;
    document.getElementById('profileAge').textContent = `${currentProfile.age} лет`;
    document.getElementById('profileDescription').textContent = currentProfile.description;
    document.getElementById('profileAvatar').textContent = currentProfile.initial;
    document.getElementById('hobbiesList').innerHTML = currentProfile.hobbies.map(h => `<div class="hobby-tag">${escapeHtml(h)}</div>`).join('');
    document.getElementById('likedEventsList').innerHTML = currentProfile.likedEvents.map(e => `<div class="liked-event-item">${escapeHtml(e)}</div>`).join('');
}

function acceptRequest() {
    const eventId = localStorage.getItem('selectedEventId');
    let events = JSON.parse(localStorage.getItem('userAnketas') || '[]');
    const eventIndex = events.findIndex(e => e.id == eventId);
    
    if (eventIndex !== -1) {
        // Добавляем Надю в участники
        if (!events[eventIndex].participants) events[eventIndex].participants = [];
        events[eventIndex].participants.push({
            name: currentProfile.name,
            role: "Участник",
            initial: currentProfile.initial
        });
        // Удаляем Надю из запросов
        events[eventIndex].requests = [];
        events[eventIndex].availableSeats++;
        
        localStorage.setItem('userAnketas', JSON.stringify(events));
        alert(`${currentProfile.name} добавлен(а) в участники!`);
    }
    
    window.location.href = 'event-detail-updated.html';
}

function goBack() { window.location.href = 'event-detail.html'; }
function escapeHtml(str) { return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }
function toggleSideMenu() { document.getElementById('sideMenu')?.classList.toggle('open'); document.getElementById('overlay')?.classList.toggle('show'); }
function navigateTo(page) { window.location.href = page; }

document.addEventListener('DOMContentLoaded', loadProfileData);