// Данные сообщества (получаем из localStorage)
let currentCommunity = null;

// Данные анкет
let anketasData = [
    {
        id: 1,
        name: "Иван Иванов",
        age: 27,
        gender: "male",
        verified: true,
        eventTitle: "Просмотр \"Аватар\"",
        description: "Предлагаю сходить в кино на 3-ю часть Аватара, после поделиться впечатлением в кафе",
        date: "2026-03-10",
        location: "Мираж",
        availableSeats: 5,
        responses: 2,
        interested: false
    },
    {
        id: 2,
        name: "Анна Смирнова",
        age: 25,
        gender: "female",
        verified: true,
        eventTitle: "Поход в кино на \"Дюну 2\"",
        description: "Ищу компанию для просмотра Дюны 2. После обсудим в кофейне рядом",
        date: "2026-03-12",
        location: "Киностар",
        availableSeats: 3,
        responses: 5,
        interested: false
    },
    {
        id: 3,
        name: "Дмитрий Петров",
        age: 32,
        gender: "male",
        verified: false,
        eventTitle: "Классика кино: \"Бегущий по лезвию\"",
        description: "Показ культового фильма. Кто хочет обсудить после просмотра?",
        date: "2026-03-15",
        location: "Иллюзион",
        availableSeats: 8,
        responses: 3,
        interested: false
    },
    {
        id: 4,
        name: "Екатерина Морозова",
        age: 29,
        gender: "female",
        verified: true,
        eventTitle: "Фестиваль короткометражек",
        description: "Ищу компанию на фестиваль короткометражного кино. Будет интересно!",
        date: "2026-03-18",
        location: "Центр документального кино",
        availableSeats: 2,
        responses: 7,
        interested: false
    }
];

// Фильтры
let currentGenderFilter = "any";
let currentAgeMin = 18;
let currentAgeMax = 99;
let currentDateStart = "2026-03-10";
let currentDateEnd = "2026-03-20";

// Загрузка данных сообщества
function loadCommunityData() {
    const communityId = localStorage.getItem('selectedCommunityId');
    if (!communityId) {
        console.log('ID сообщества не найден');
        return;
    }
    
    // Здесь можно загружать данные с сервера или из массива
    // Пока используем заглушку для Киноклуба
    currentCommunity = {
        id: parseInt(communityId),
        name: "Киноклуб",
        members: 800,
        rating: 4.8,
        description: "Смотрим и обсуждаем лучшее кино. Место для тех, кто любит думать и говорить о фильмах."
    };
    
    // Обновляем заголовок
    const titleElement = document.querySelector('.detail-header h1');
    if (titleElement) {
        titleElement.textContent = currentCommunity.name;
    }
    
    // Обновляем количество участников и рейтинг
    const membersElement = document.querySelector('.badge-item:first-child .badge-value');
    const ratingElement = document.querySelector('.badge-item:last-child .badge-value');
    if (membersElement) membersElement.textContent = currentCommunity.members;
    if (ratingElement) ratingElement.textContent = currentCommunity.rating + ' ★';
    
    // Обновляем описание
    const descElement = document.querySelector('.community-description-text');
    if (descElement) descElement.textContent = currentCommunity.description;
}

// Рендер анкет
function renderAnketas() {
    let filtered = [...anketasData];

    // Фильтр по полу
    if (currentGenderFilter !== "any") {
        filtered = filtered.filter(a => a.gender === currentGenderFilter);
    }

    // Фильтр по возрасту
    filtered = filtered.filter(a => a.age >= currentAgeMin && a.age <= currentAgeMax);

    // Фильтр по дате
    filtered = filtered.filter(a => a.date >= currentDateStart && a.date <= currentDateEnd);

    const container = document.getElementById("anketasList");
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>Нет активных анкет</p>
                <p style="font-size: 12px; margin-top: 8px;">Попробуйте изменить фильтры</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(anketa => `
        <div class="anketa-card">
            <div class="anketa-author">
                <div class="author-avatar">
                    <i class="bi bi-person-fill"></i>
                </div>
                <div class="author-info">
                    <div class="author-name">
                        ${escapeHtml(anketa.name)}
                        ${anketa.verified ? '<i class="bi bi-patch-check-fill verified-badge"></i>' : ''}
                    </div>
                    <div class="author-age">${anketa.age} лет</div>
                </div>
            </div>
            <div class="event-title">${escapeHtml(anketa.eventTitle)}</div>
            <div class="event-description">${escapeHtml(anketa.description)}</div>
            <div class="event-details">
                <div class="detail-item">
                    <i class="bi bi-calendar"></i>
                    <span>${formatDate(anketa.date)}</span>
                </div>
                <div class="detail-item">
                    <i class="bi bi-geo-alt"></i>
                    <span>${escapeHtml(anketa.location)}</span>
                </div>
                <div class="detail-item">
                    <i class="bi bi-people"></i>
                    <span>${anketa.availableSeats} доступных места</span>
                </div>
            </div>
            <div class="event-footer">
                <div class="responses-count">${anketa.responses} ответа</div>
                <button class="interested-btn" onclick="markInterested(${anketa.id})">
                    ${anketa.interested ? '✓ Отмечено' : 'Мне интересно'}
                </button>
            </div>
        </div>
    `).join("");
}

// Форматирование даты
function formatDate(dateStr) {
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

// Экранирование HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Возврат на список сообществ
function goBack() {
    window.location.href = 'feed.html';
}

// Функция "Найти компанию" (будет прорабатываться позже)
function openFindPartner() {
    alert('Функция «Найти компанию» будет в следующем этапе');
}

// Переключение панели фильтров
function toggleAnketaFilter() {
    const panel = document.getElementById('anketaFilterPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Выбор пола
function selectGender(element, gender) {
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');
    currentGenderFilter = gender;
}

// Применение фильтров
function applyAnketaFilters() {
    const ageMinInput = document.getElementById('ageMin');
    const ageMaxInput = document.getElementById('ageMax');
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');

    currentAgeMin = parseInt(ageMinInput.value) || 18;
    currentAgeMax = parseInt(ageMaxInput.value) || 99;
    currentDateStart = dateStartInput.value;
    currentDateEnd = dateEndInput.value;

    renderAnketas();
    
    // Скрываем панель фильтров после применения
    const panel = document.getElementById('anketaFilterPanel');
    if (panel) {
        panel.classList.remove('show');
    }
}

// Отметка "Мне интересно"
function markInterested(anketaId) {
    const anketa = anketasData.find(a => a.id === anketaId);
    if (anketa) {
        // Сохраняем ID мероприятия и переходим на страницу просмотра
        localStorage.setItem('viewEventId', anketaId);
        window.location.href = 'event-view.html';
    }
}

// Инициализация страницы
function initCommunityDetailPage() {
    loadCommunityData();
    renderAnketas();
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityDetailPage);
} else {
    initCommunityDetailPage();
}

// Функция "Найти компанию" - переход на страницу создания анкеты
function openFindPartner() {
    window.location.href = 'create-anketa.html';
}