// Состояние выбранных фильтров
let selectedCategories = [];
let selectedDistricts = [];
let selectedSwipeCount = 5; // По умолчанию 5 вариантов

// Категории мероприятий
const categories = [
    "Музыка", "Искусство", "Театр", "Кино", 
    "Спорт", "Мастерклассы", "Мини путешествия"
];

// Районы
const districts = [
    "Центральный", "Адмиралтейский", "Василеостровский", 
    "Выборгский", "Калининский", "Московский", 
    "Невский", "Петродворцовый", "Приморский"
];

// Инициализация
function initFilters() {
    renderCategories();
    renderDistricts();
    
    // Устанавливаем даты по умолчанию
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU');
    document.getElementById('startDate').textContent = formattedDate;
    document.getElementById('endDate').textContent = formattedDate;
    document.getElementById('minPrice').textContent = '300';
    document.getElementById('maxPrice').textContent = '2000';
    
    // Подсвечиваем кнопку по умолчанию (5)
    updateSwipeCountDisplay(selectedSwipeCount);
}

// Установка количества вариантов через кнопки
function setSwipeCount(value) {
    selectedSwipeCount = value;
    updateSwipeCountDisplay(value);
    console.log('Выбрано количество вариантов:', value);
}

// Обновление отображения выбранного количества (подсветка активной кнопки)
function updateSwipeCountDisplay(value) {
    const buttons = document.querySelectorAll('.swipe-count-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent.trim();
        if (btnText === value.toString()) {
            btn.classList.add('active');
        }
    });
}

// Рендер категорий
function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div class="category-tag ${selectedCategories.includes(cat) ? 'selected' : ''}" 
             onclick="toggleCategory('${cat}')">
            ${cat}
        </div>
    `).join('');
}

// Рендер районов
function renderDistricts() {
    const container = document.getElementById('districtsContainer');
    if (!container) return;
    
    container.innerHTML = districts.map(district => `
        <div class="district-tag ${selectedDistricts.includes(district) ? 'selected' : ''}" 
             onclick="toggleDistrict('${district}')">
            ${district}
        </div>
    `).join('');
}

// Переключение категории
function toggleCategory(category) {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
        selectedCategories.push(category);
    } else {
        selectedCategories.splice(index, 1);
    }
    renderCategories();
}

// Переключение района
function toggleDistrict(district) {
    const index = selectedDistricts.indexOf(district);
    if (index === -1) {
        selectedDistricts.push(district);
    } else {
        selectedDistricts.splice(index, 1);
    }
    renderDistricts();
}

// Выбор даты
function selectDate(type) {
    const date = prompt(`Введите ${type === 'start' ? 'начальную' : 'конечную'} дату (в формате ДД.ММ.ГГГГ):`, 
        type === 'start' ? '15.03.2026' : '15.03.2026');
    if (date && /^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        document.getElementById(`${type}Date`).textContent = date;
    } else if (date) {
        alert('Пожалуйста, введите дату в формате ДД.ММ.ГГГГ');
    }
}

// Выбор цены
function selectPrice(type) {
    const currentValue = document.getElementById(`${type}Price`).textContent;
    const price = prompt(`Введите ${type === 'min' ? 'минимальную' : 'максимальную'} стоимость (в рублях):`, currentValue);
    if (price && !isNaN(price) && price > 0) {
        document.getElementById(`${type}Price`).textContent = price;
    } else if (price) {
        alert('Пожалуйста, введите корректную сумму');
    }
}

// Начать выбор мероприятий
function startSelection() {
    const filters = {
        chatName: "Планы на выходные",
        startDate: document.getElementById('startDate').textContent,
        endDate: document.getElementById('endDate').textContent,
        minPrice: document.getElementById('minPrice').textContent,
        maxPrice: document.getElementById('maxPrice').textContent,
        categories: selectedCategories,
        districts: selectedDistricts,
        swipeCount: selectedSwipeCount
    };
    
    console.log('Выбранные фильтры:', filters);
    
    // Получаем текущий чат
    const currentChat = JSON.parse(localStorage.getItem('currentChat') || '{}');
    const chatId = currentChat.id || 1;
    
    // СОЗДАЕМ анкету - устанавливаем флаг
    localStorage.setItem(`pollCreated_${chatId}`, 'true');
    
    // Устанавливаем статус "ожидание опроса"
    localStorage.setItem(`pollStatus_${chatId}`, 'waiting');
    
    // Очищаем старые результаты
    localStorage.removeItem('votedEvents');
    localStorage.removeItem('hasVoted');
    localStorage.removeItem('pollVoters');
    
    // Переход на страницу чата с плашкой
    window.location.href = 'chat-with-poll.html';
}

function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    
    // Активная кнопка в нижнем меню
    const navItems = document.querySelectorAll('.nav-icon-item');
    navItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === 1) item.classList.add('active');
    });
});