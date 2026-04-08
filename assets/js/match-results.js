// Данные мероприятий, которые совпали (match)
let matchedEvents = [
    {
        id: 1,
        title: "Неаполитанская карусель",
        category: "Концерт",
        date: "28 марта 2026",
        time: "19:00",
        location: "ул. Кушелевская дорога, 6",
        price: "1500 р",
        description: "Уникальная возможность услышать, как звучат мандолина и дудук",
        imageIcon: "🎵"
    },
    {
        id: 2,
        title: "Вечер джаза",
        category: "Концерт",
        date: "29 марта 2026",
        time: "20:00",
        location: "Джаз-клуб 'Союз'",
        price: "1200 р",
        description: "Живое исполнение джазовых стандартов в уютной атмосфере",
        imageIcon: "🎷"
    }
];

function getIconName(emoji) {
    const icons = {
        '🎵': 'music-note-beamed',
        '🎷': 'music-note-beamed',
        '🖼️': 'palette-fill',
        '🏺': 'cup-straw',
        '🎬': 'film',
        '🍔': 'cup-straw'
    };
    return icons[emoji] || 'star-fill';
}

function showEventDetails(eventId) {
    const event = matchedEvents.find(e => e.id === eventId);
    if (event) {
        alert(`📍 ${event.title}\n\n${event.description}\n\n📅 ${event.date} ${event.time}\n\n📍 ${event.location}\n\n💰 ${event.price}`);
    }
}

function renderMatches() {
    const container = document.getElementById('matchesContainer');
    const countSpan = document.getElementById('matchCount');
    
    if (!container) return;
    
    if (matchedEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-emoji-frown"></i>
                <h3>Совпадений не найдено</h3>
                <p>Попробуйте выбрать другие мероприятия</p>
            </div>
        `;
        if (countSpan) countSpan.textContent = '0';
        return;
    }
    
    if (countSpan) countSpan.textContent = matchedEvents.length;
    
    container.innerHTML = matchedEvents.map(event => `
        <div class="match-card">
            <div class="match-badge">match</div>
            <div class="match-image">
                <i class="bi bi-${getIconName(event.imageIcon)}"></i>
                <div class="match-category">${event.category}</div>
            </div>
            <div class="match-info">
                <h3 class="match-title">${event.title}</h3>
                <p class="match-description">${event.description}</p>
                <div class="match-details">
                    <div class="match-detail">
                        <i class="bi bi-calendar"></i>
                        <span>${event.date}</span>
                    </div>
                    <div class="match-detail">
                        <i class="bi bi-geo-alt"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
                <div class="match-price">${event.price}</div>
                <div class="match-detail-link" onclick="showEventDetails(${event.id})">
                    Подробнее <i class="bi bi-arrow-right"></i>
                </div>
            </div>
        </div>
    `).join('');
}

function goToChat() {
    // Переход обратно в чат с плашкой
    window.location.href = 'chat-with-poll.html';
}

function goBackToGroups() {
    // Возврат к другим группам
    window.location.href = 'choose-together.html';
}

function goBack() {
    // Кнопка назад - возврат в чат
    window.location.href = 'chat-with-poll.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderMatches();
});