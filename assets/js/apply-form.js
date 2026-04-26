// Данные о мероприятии
let currentEvent = null;
let selectedGender = "female";
let photos = [];

// Загрузка данных мероприятия
function loadEventData() {
    const eventId = localStorage.getItem('applyEventId') || localStorage.getItem('viewEventId');
    const eventTitle = localStorage.getItem('applyEventTitle') || 'Мероприятие';
    
    if (!eventId && !eventTitle) {
        window.location.href = 'feed.html';
        return;
    }
    
    currentEvent = {
        id: eventId ? parseInt(eventId) : Date.now(),
        eventTitle: eventTitle
    };
    
    document.getElementById('eventTitle').textContent = currentEvent.eventTitle;
}

// Автозаполнение
function autoFill() {
    document.getElementById('firstName').value = 'Анна';
    document.getElementById('lastName').value = 'Погодина';
    document.getElementById('age').value = '18';
    document.getElementById('about').value = 'Люблю кино, увлекаюсь просмотром анимации';
    
    selectGender(document.querySelector('.gender-option[data-gender="female"]'), 'female');
}

// Выбор пола
function selectGender(element, gender) {
    document.querySelectorAll('.gender-option').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    selectedGender = gender;
}

// Добавление фото
function addPhoto() {
    if (photos.length >= 3) {
        alert('Можно добавить не более 3 фото');
        return;
    }
    
    const newPhoto = {
        id: Date.now(),
        url: null
    };
    photos.push(newPhoto);
    renderPhotos();
}

// Удаление фото
function removePhoto(photoId) {
    photos = photos.filter(p => p.id !== photoId);
    renderPhotos();
}

// Рендер фото
function renderPhotos() {
    const container = document.getElementById('photosContainer');
    if (!container) return;
    
    let html = '';
    
    photos.forEach(photo => {
        html += `
            <div class="photo-preview" style="background-color: #d0d0d0;">
                <div class="remove-photo" onclick="removePhoto(${photo.id})">
                    <i class="bi bi-x"></i>
                </div>
            </div>
        `;
    });
    
    if (photos.length < 3) {
        html += `
            <div class="photo-add" onclick="addPhoto()">
                <i class="bi bi-plus-lg"></i>
                <span>Добавить</span>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Отправка заявки
function submitApplication() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = document.getElementById('age').value.trim();
    const about = document.getElementById('about').value.trim();
    
    if (!firstName) {
        alert('Введите имя');
        return;
    }
    
    if (!lastName) {
        alert('Введите фамилию');
        return;
    }
    
    if (!age) {
        alert('Введите возраст');
        return;
    }
    
    // Проверяем, не подавал ли пользователь уже заявку
    let appliedEvents = JSON.parse(localStorage.getItem('appliedEvents') || '[]');
    if (appliedEvents.includes(currentEvent.id)) {
        alert('Вы уже подавали заявку на это мероприятие. Удалите старую заявку в разделе "Мои запросы", чтобы подать новую.');
        return;
    }
    
    // Сохраняем заявку в localStorage
    const application = {
        id: Date.now(),
        eventId: currentEvent.id,
        eventTitle: currentEvent.eventTitle,
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        age: age,
        gender: selectedGender,
        about: about,
        photos: photos,
        status: 'pending',
        appliedAt: new Date().toISOString()
    };
    
    let applications = JSON.parse(localStorage.getItem('myApplications') || '[]');
    applications.push(application);
    localStorage.setItem('myApplications', JSON.stringify(applications));
    
    // Отмечаем, что пользователь подал заявку
    appliedEvents.push(currentEvent.id);
    localStorage.setItem('appliedEvents', JSON.stringify(appliedEvents));
    
    // Переходим в раздел "Мои запросы"
    window.location.href = 'my-anketas.html?tab=requests';
}

// Возврат
function goBack() {
    window.history.back();
}

// Боковое меню
function toggleSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

function navigateTo(page) {
    window.location.href = page;
}

// Инициализация
function initApplyFormPage() {
    loadEventData();
}

document.addEventListener('DOMContentLoaded', initApplyFormPage);