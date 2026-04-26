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

// Данные сообщества
let currentCommunity = null;

// Иван Иванов — всегда есть
const ivanAnketa = {
    id: 2,
    name: "Иван Иванов",
    age: 25,
    gender: "male",
    verified: true,
    eventTitle: "Поход в кино на \"Аватар\"",
    description: "Предлагаю сходить в кино на 3-ю часть Аватара, после поделиться впечатлением в кафе",
    date: "2026-05-12",
    location: "Киностар",
    availableSeats: 3,
    responses: 5,
    interested: false
};

// Список анкет: Иван + созданные пользователем
let anketasData = [ivanAnketa];

// Фильтры
let currentGenderFilter = "any";
let currentAgeMin = 18;
let currentAgeMax = 99;
let currentDateStart = "2026-03-10";
let currentDateEnd = "2026-12-31";

// Загрузка данных сообщества
function loadCommunityData() {
    const communityId = localStorage.getItem('selectedCommunityId');
    
    const communities = {
        1: { id: 1, name: "Киноклуб", members: 800, rating: 4.8, description: "Смотрим и обсуждаем лучшее кино." },
        2: { id: 2, name: "Беговой круг", members: 450, rating: 4.9, description: "Совместные пробежки и марафоны." },
        3: { id: 3, name: "Книжный круг", members: 620, rating: 4.7, description: "Читаем и обсуждаем книги." }
    };
    
    currentCommunity = communities[communityId] || communities[1];
    
    const titleElement = document.querySelector('.detail-header h1');
    if (titleElement) titleElement.textContent = currentCommunity.name;
    
    const membersElement = document.querySelector('.badge-item:first-child .badge-value');
    const ratingElement = document.querySelector('.badge-item:last-child .badge-value');
    if (membersElement) membersElement.textContent = currentCommunity.members;
    if (ratingElement) ratingElement.textContent = currentCommunity.rating + ' ★';
    
    const descElement = document.querySelector('.community-description-text');
    if (descElement) descElement.textContent = currentCommunity.description;
}

// Загрузка созданных анкет из localStorage
function loadAnketasFromStorage() {
    const savedAnketas = JSON.parse(localStorage.getItem('userAnketas') || '[]');
    
    const myAnketas = savedAnketas.map(anketa => ({
        id: anketa.id,
        name: "Вы",
        age: 25,
        gender: anketa.gender || "any",
        verified: true,
        eventTitle: anketa.eventTitle,
        description: anketa.description,
        date: anketa.date,
        location: anketa.location,
        availableSeats: anketa.availableSeats || 2,
        responses: anketa.requests?.length || 0,
        interested: false,
        isOwn: true
    }));
    
    // Иван всегда первый, потом мои анкеты
    anketasData = [ivanAnketa, ...myAnketas];
}

// Рендер анкет
function renderAnketas() {
    let filtered = [...anketasData];
    
    if (currentGenderFilter !== "any") {
        filtered = filtered.filter(a => a.isOwn || a.gender === currentGenderFilter);
    }
    
    filtered = filtered.filter(a => a.age >= currentAgeMin && a.age <= currentAgeMax);
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
        <div class="anketa-card" onclick="viewAnketa(${anketa.id})">
            <div class="anketa-author">
                <div class="author-avatar">
                    <i class="bi bi-person-fill"></i>
                </div>
                <div class="author-info">
                    <div class="author-name">
                        ${escapeHtml(anketa.name)}
                        ${anketa.verified ? '<i class="bi bi-patch-check-fill verified-badge"></i>' : ''}
                        ${anketa.isOwn ? '<span class="own-badge">Вы</span>' : ''}
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
                    <span>${anketa.availableSeats} мест</span>
                </div>
            </div>
            <div class="event-footer">
                <div class="responses-count">${anketa.responses} откликов</div>
                ${anketa.isOwn ? 
                    `<button class="view-btn" onclick="event.stopPropagation(); viewMyAnketa(${anketa.id})">Смотреть</button>` :
                    `<button class="interested-btn" onclick="event.stopPropagation(); markInterested(${anketa.id})">
                        ${anketa.interested ? '✓ Отмечено' : 'Мне интересно'}
                    </button>`
                }
            </div>
        </div>
    `).join("");
}

function viewAnketa(id) {
    const anketa = anketasData.find(a => a.id === id);
    if (anketa) {
        localStorage.setItem('viewEventId', id);
        window.location.href = 'event-view.html';
    }
}

function viewMyAnketa(id) {
    localStorage.setItem('selectedEventId', id);
    window.location.href = 'event-detail.html';
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : dateStr;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function goBack() {
    window.history.back();
}

function openFindPartner() {
    window.location.href = 'create-anketa.html';
}

function toggleAnketaFilter() {
    const panel = document.getElementById('anketaFilterPanel');
    if (panel) panel.classList.toggle('show');
}

function selectGender(element, gender) {
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    currentGenderFilter = gender;
}

function applyAnketaFilters() {
    const ageMinInput = document.getElementById('ageMin');
    const ageMaxInput = document.getElementById('ageMax');
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');
    
    currentAgeMin = parseInt(ageMinInput?.value) || 18;
    currentAgeMax = parseInt(ageMaxInput?.value) || 99;
    currentDateStart = dateStartInput?.value || "2026-03-10";
    currentDateEnd = dateEndInput?.value || "2026-12-31";
    
    renderAnketas();
    
    const panel = document.getElementById('anketaFilterPanel');
    if (panel) panel.classList.remove('show');
}

// Отметка "Мне интересно" — переход на страницу просмотра мероприятия
function markInterested(anketaId) {
    // Сохраняем ID мероприятия для event-view
    localStorage.setItem('viewEventId', anketaId);
    
    // Переходим на страницу просмотра мероприятия
    window.location.href = 'event-view.html';
}

function initCommunityDetailPage() {
    loadCommunityData();
    loadAnketasFromStorage();
    renderAnketas();
    
    const today = new Date().toISOString().split('T')[0];
    const dateStartInput = document.getElementById('dateStart');
    const dateEndInput = document.getElementById('dateEnd');
    if (dateStartInput) dateStartInput.value = today;
    if (dateEndInput) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        dateEndInput.value = nextMonth.toISOString().split('T')[0];
    }
    
    document.querySelectorAll('.side-menu-item').forEach(item => {
        item.addEventListener('click', () => setTimeout(() => toggleSideMenu(), 150));
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityDetailPage);
} else {
    initCommunityDetailPage();
}