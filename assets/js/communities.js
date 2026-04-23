// Данные сообществ
const communities = [
    {
        id: 1,
        name: 'Киноклуб',
        category: 'cinema',
        description: 'Смотрим и обсуждаем фильмы, ходим в кино вместе по выходным',
        members: 128
    },
    {
        id: 2,
        name: 'Беговой клуб',
        category: 'sport',
        description: 'Совместные пробежки, марафоны и спортивные челленджи',
        members: 89
    },
    {
        id: 3,
        name: 'Книжный клуб',
        category: 'books',
        description: 'Читаем, обсуждаем книги, устраиваем литературные вечера',
        members: 156
    }
];

let filteredCommunities = [...communities];
let currentCategory = 'all';
let currentSort = 'default';
let searchQuery = '';

// Рендер сообществ
function renderCommunities() {
    const container = document.getElementById('communitiesList');
    if (!container) return;
    
    if (filteredCommunities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-people"></i>
                <p>Сообщества не найдены</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredCommunities.map(community => `
        <div class="community-card" onclick="openCommunity(${community.id})">
            <div class="card-header">
                <h3>${community.name}</h3>
            </div>
            <div class="card-description">${community.description}</div>
            <div class="card-footer">
                <div class="members-count">
                    <i class="bi bi-people"></i>
                    <span>${community.members} участников</span>
                </div>
                <button class="details-btn" onclick="event.stopPropagation(); openCommunity(${community.id})">
                    Подробнее <i class="bi bi-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Открыть сообщество
function openCommunity(id) {
    const community = communities.find(c => c.id === id);
    if (community) {
        localStorage.setItem('currentCommunity', JSON.stringify(community));
        window.location.href = 'detail.html';
    }
}

// Фильтрация
function filterCommunities() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    applyFilters();
}

function applyFilters() {
    filteredCommunities = communities.filter(community => {
        if (currentCategory !== 'all' && community.category !== currentCategory) {
            return false;
        }
        if (searchQuery && !community.name.toLowerCase().includes(searchQuery) && 
            !community.description.toLowerCase().includes(searchQuery)) {
            return false;
        }
        return true;
    });
    
    if (currentSort === 'members') {
        filteredCommunities.sort((a, b) => b.members - a.members);
    }
    
    renderCommunities();
}

// Меню
function toggleMenu() {
    const dropdown = document.getElementById('menuDropdown');
    dropdown.classList.toggle('show');
    
    if (dropdown.classList.contains('show')) {
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnClickOutside);
        }, 0);
    }
}

function closeMenuOnClickOutside(e) {
    const dropdown = document.getElementById('menuDropdown');
    const menuIcon = document.querySelector('.menu-icon');
    if (dropdown && !dropdown.contains(e.target) && menuIcon && !menuIcon.contains(e.target)) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

function openSearch() {
    document.getElementById('menuDropdown').classList.remove('show');
    document.getElementById('searchContainer').classList.add('show');
    document.getElementById('searchInput').focus();
}

function toggleFilterPanel() {
    document.getElementById('menuDropdown').classList.remove('show');
    document.getElementById('filterPanel').classList.toggle('show');
}

function createCommunity() {
    document.getElementById('menuDropdown').classList.remove('show');
    alert('Функция «Создать сообщество» в разработке');
}

// Боковое меню
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    sideMenu.classList.toggle('open');
    overlay.classList.toggle('show');
}

// Навигация
function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderCommunities();
    
    const categoryTags = document.querySelectorAll('[data-cat]');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            categoryTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.cat;
            applyFilters();
        });
    });
    
    const sortTags = document.querySelectorAll('[data-sort]');
    sortTags.forEach(tag => {
        tag.addEventListener('click', function() {
            sortTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentSort = this.dataset.sort;
            applyFilters();
        });
    });
});