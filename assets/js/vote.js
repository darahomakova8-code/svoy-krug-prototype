// Данные мероприятий (5 мероприятий, без эмодзи)
let events = [
    {
        id: 1,
        title: "Неаполитанская карусель",
        category: "Концерт",
        date: "28 марта 2026",
        time: "19:00",
        location: "ул. Кушелевская дорога, 6",
        price: "1500 р",
        description: "Это уникальная возможность услышать, как звучат мандолина и дудук в старинных интерьерах",
        icon: "music-note-beamed"
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
        icon: "music-note-beamed"
    },
    {
        id: 3,
        title: "Арт-выставка 'Импрессионизм'",
        category: "Искусство",
        date: "30 марта 2026",
        time: "11:00",
        location: "Музей искусств",
        price: "800 р",
        description: "Выставка работ импрессионистов из частных коллекций",
        icon: "palette-fill"
    },
    {
        id: 4,
        title: "Мастер-класс по гончарному делу",
        category: "Творчество",
        date: "31 марта 2026",
        time: "15:00",
        location: "Гончарная мастерская 'Круг'",
        price: "2000 р",
        description: "Создайте свою первую керамическую чашку под руководством мастера",
        icon: "cup-straw"
    },
    {
        id: 5,
        title: "Ночь кино: Триллеры",
        category: "Кино",
        date: "1 апреля 2026",
        time: "21:00",
        location: "Кинотеатр 'Звезда'",
        price: "500 р",
        description: "Ночной показ культовых триллеров с обсуждением после фильма",
        icon: "film"
    }
];

let currentIndex = 0;
let selectedEvents = [];

function renderEvent() {
    const container = document.getElementById('eventCard');
    const progressFill = document.getElementById('progressFill');
    const progressCounter = document.getElementById('progressCounter');
    
    if (!container) return;
    
    if (currentIndex >= events.length) {
        // Показать сообщение о завершении
        container.innerHTML = `
            <div class="completion-message">
                <i class="bi bi-check-circle-fill"></i>
                <h3>Голосование завершено!</h3>
                <p>Вы выбрали ${selectedEvents.length} из ${events.length} мероприятий</p>
                <button class="completion-btn" onclick="finishVoting()">Завершить</button>
            </div>
        `;
        return;
    }
    
    const event = events[currentIndex];
    
    container.innerHTML = `
        <div class="event-card" id="currentEventCard">
            <div class="event-image">
                <i class="bi bi-${event.icon}"></i>
                <div class="event-category">${event.category}</div>
            </div>
            <div class="event-info">
                <h2 class="event-title">${event.title}</h2>
                <p class="event-description">${event.description}</p>
                <div class="event-date">
                    <i class="bi bi-calendar"></i>
                    <span>${event.date} • ${event.time}</span>
                </div>
                <div class="event-location">
                    <i class="bi bi-geo-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-price">${event.price}</div>
                <div class="event-detail-link" onclick="showDetails(${event.id})">
                    Подробнее <i class="bi bi-arrow-right"></i>
                </div>
            </div>
        </div>
    `;
    
    // Обновляем прогресс-бар
    const progress = (currentIndex / events.length) * 100;
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressCounter) {
        progressCounter.textContent = `${currentIndex}/${events.length}`;
    }
}

function showDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        alert(`📍 ${event.title}\n\n${event.description}\n\n📅 ${event.date} ${event.time}\n\n📍 ${event.location}\n\n💰 ${event.price}`);
    }
}

function likeEvent() {
    if (currentIndex >= events.length) return;
    
    const currentEvent = events[currentIndex];
    if (!selectedEvents.some(e => e.id === currentEvent.id)) {
        selectedEvents.push(currentEvent);
    }
    
    animateAndNext('like');
}

function dislikeEvent() {
    if (currentIndex >= events.length) return;
    
    animateAndNext('dislike');
}

function animateAndNext(action) {
    const card = document.getElementById('currentEventCard');
    if (!card) return;
    
    card.classList.add(action === 'like' ? 'swipe-right' : 'swipe-left');
    
    setTimeout(() => {
        currentIndex++;
        renderEvent();
    }, 300);
}

function finishVoting() {
    // Сохраняем выбранные мероприятия
    localStorage.setItem('votedEvents', JSON.stringify(selectedEvents));
    localStorage.setItem('hasVoted', 'true');
    
    const voters = JSON.parse(localStorage.getItem('pollVoters') || '[]');
    if (!voters.includes('Ирина')) {
        voters.push('Ирина');
        localStorage.setItem('pollVoters', JSON.stringify(voters));
    }
    
    // Получаем текущий чат и обновляем статус на "voted"
    const currentChat = JSON.parse(localStorage.getItem('currentChat') || '{}');
    const chatId = currentChat.id || 1;
    localStorage.setItem(`pollStatus_${chatId}`, 'voted');
    
    // Переход на чат с плашкой
    window.location.href = 'chat-with-poll.html';
}

function goBack() {
    window.history.back();
}

// Обработка свайпов для мобильных устройств
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            likeEvent();
        } else {
            dislikeEvent();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderEvent();
    
    // Добавляем обработчики свайпов
    const cardContainer = document.getElementById('eventCard');
    if (cardContainer) {
        cardContainer.addEventListener('touchstart', handleTouchStart);
        cardContainer.addEventListener('touchend', handleTouchEnd);
    }
});