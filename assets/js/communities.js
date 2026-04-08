// Данные сообществ
const communitiesData = [
    { 
        id: 1, 
        name: "Киноклуб", 
        category: "cinema", 
        members: 800, 
        description: "Смотрим и обсуждаем лучшее кино. Место для тех, кто любит думать и говорить о фильмах.", 
        status: "Active",
        fullDescription: "Каждую неделю смотрим новый фильм и обсуждаем его. У нас есть онлайн-встречи и офлайн-показы. Присоединяйтесь к любителям кино!",
        membersList: [
            { name: "Анна", role: "Администратор" },
            { name: "Михаил", role: "Модератор" },
            { name: "Екатерина", role: "Активный участник" },
            { name: "Дмитрий", role: "Участник" }
        ]
    },
    { 
        id: 2, 
        name: "Беговой клуб", 
        category: "sport", 
        members: 300, 
        description: "Объединяемся для пробежек, делимся успехами и ставим новые рекорды. Бегать вместе — веселее!", 
        status: "Active",
        fullDescription: "Утренние пробежки в парке, участие в марафонах, челленджи и совместные тренировки. Любой уровень подготовки приветствуется!",
        membersList: [
            { name: "Сергей", role: "Тренер" },
            { name: "Ольга", role: "Администратор" },
            { name: "Иван", role: "Капитан команды" },
            { name: "Мария", role: "Участник" }
        ]
    },
    { 
        id: 3, 
        name: "Team-билдинг", 
        category: "team", 
        members: 150, 
        description: "Корпоративные игры, тимбилдинги и командные активности.", 
        status: "Active",
        fullDescription: "Организуем мероприятия для сплочения команд. Квесты, игры на доверие, выездные мероприятия.",
        membersList: [
            { name: "Алексей", role: "Организатор" },
            { name: "Наталья", role: "Модератор" }
        ]
    },
    { 
        id: 4, 
        name: "Книжный клуб", 
        category: "books", 
        members: 220, 
        description: "Читаем классику и новинки, обсуждаем сюжеты и героев.", 
        status: "Active",
        fullDescription: "Раз в две недели выбираем книгу и обсуждаем её за чашкой чая. Любители чтения всех жанров!",
        membersList: [
            { name: "Елена", role: "Библиотекарь" },
            { name: "Андрей", role: "Модератор" }
        ]
    },
    { 
        id: 5, 
        name: "Музейный гид", 
        category: "museums", 
        members: 180, 
        description: "Совместные походы в музеи и на выставки.", 
        status: "Active",
        fullDescription: "Раз в месяц посещаем новые выставки и музеи. Экскурсии, лекции и культурный досуг.",
        membersList: [
            { name: "Ирина", role: "Экскурсовод" },
            { name: "Павел", role: "Организатор" }
        ]
    },
    { 
        id: 6, 
        name: "Собаководы", 
        category: "dogs", 
        members: 420, 
        description: "Гуляем с собаками, делимся советами по воспитанию.", 
        status: "Active",
        fullDescription: "Совместные прогулки, тренировки и обмен опытом. Для владельцев собак любых пород.",
        membersList: [
            { name: "Дарья", role: "Кинолог" },
            { name: "Максим", role: "Модератор" }
        ]
    }
];

let currentCategory = "all";
let currentSort = "default";
let searchQuery = "";

// Функция рендеринга сообществ
function renderCommunities() {
    let filtered = [...communitiesData];

    // Фильтр по категории
    if (currentCategory !== "all") {
        filtered = filtered.filter(c => c.category === currentCategory);
    }

    // Фильтр по поиску
    if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.description.toLowerCase().includes(query)
        );
    }

    // Сортировка
    if (currentSort === "members-asc") {
        filtered.sort((a, b) => a.members - b.members);
    } else if (currentSort === "members-desc") {
        filtered.sort((a, b) => b.members - a.members);
    }

    const container = document.getElementById("communitiesList");
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-people"></i>
                <p>Ничего не найдено</p>
                <p style="font-size: 12px; margin-top: 8px;">Попробуйте изменить фильтры</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(community => `
        <div class="community-card" onclick="openCommunityDetail(${community.id})">
            <div class="community-header">
                <div class="community-name">${escapeHtml(community.name)}</div>
                <div class="community-status">● ${community.status}</div>
            </div>
            <div class="community-description">${escapeHtml(community.description)}</div>
            <div class="community-footer">
                <div class="community-date">
                    <i class="bi bi-calendar"></i>
                    <span>Основано: 2024</span>
                </div>
                <div class="details-link">
                    Подробнее <i class="bi bi-arrow-right"></i>
                </div>
            </div>
        </div>
    `).join("");
}

// Функция открытия детальной страницы
function openCommunityDetail(communityId) {
    localStorage.setItem('selectedCommunityId', communityId);
    window.location.href = 'detail.html';
}

// Функция экранирования HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Фильтрация по поиску
function filterCommunities() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchQuery = searchInput.value;
    }
    renderCommunities();
}

// Переключение панели фильтров
function toggleFilterPanel() {
    const panel = document.getElementById("filterPanel");
    if (panel) {
        panel.classList.toggle("show");
    }
}

// Переключение поиска
function toggleSearch() {
    const container = document.getElementById("searchContainer");
    const input = document.getElementById("searchInput");
    if (container) {
        if (container.style.display === "none" || !container.style.display) {
            container.style.display = "block";
            if (input) input.focus();
        } else {
            container.style.display = "none";
            if (input) {
                searchQuery = "";
                input.value = "";
                renderCommunities();
            }
        }
    }
}

// Настройка фильтров
function setupFilters() {
    const categoryTags = document.querySelectorAll("#categoryFilters .filter-tag");
    categoryTags.forEach(tag => {
        tag.addEventListener("click", function() {
            categoryTags.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.getAttribute("data-cat");
            renderCommunities();
        });
    });

    const sortTags = document.querySelectorAll("#sortFilters .filter-tag");
    sortTags.forEach(tag => {
        tag.addEventListener("click", function() {
            sortTags.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            currentSort = this.getAttribute("data-sort");
            renderCommunities();
        });
    });
}

// Инициализация страницы сообществ
function initCommunitiesPage() {
    renderCommunities();
    setupFilters();
    
    document.addEventListener("click", function(e) {
        const panel = document.getElementById("filterPanel");
        const filterIcon = document.getElementById("filterIcon");
        if (panel && panel.classList.contains("show") && 
            !panel.contains(e.target) && 
            filterIcon && !filterIcon.contains(e.target)) {
            panel.classList.remove("show");
        }
    });
}

// Запускаем инициализацию
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunitiesPage);
} else {
    initCommunitiesPage();
}