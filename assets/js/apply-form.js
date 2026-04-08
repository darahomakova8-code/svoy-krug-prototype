// Данные о мероприятии
let currentEvent = null;
let selectedGender = "female";
let photos = [];

// Загрузка данных мероприятия
function loadEventData() {
    const eventId = localStorage.getItem('viewEventId');
    if (!eventId) {
        alert('Мероприятие не найдено');
        window.location.href = 'feed.html';
        return;
    }
    
    currentEvent = {
        id: parseInt(eventId),
        eventTitle: "Просмотр \"Аватар\""
    };
    
    document.getElementById('eventTitle').textContent = currentEvent.eventTitle;
}

// Автозаполнение (заглушка)
function autoFill() {
    document.getElementById('firstName').value = 'Анна';
    document.getElementById('lastName').value = 'Погодина';
    document.getElementById('age').value = '18';
    document.getElementById('about').value = 'Люблю кино, увлекаюсь просмотром анимации';
    
    // Выбираем пол "Женский"
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
    
    // Имитация добавления фото (в реальном приложении тут был бы input file)
    const newPhoto = {
        id: Date.now(),
        url: null // заглушка
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
    
    // Существующие фото
    photos.forEach(photo => {
        html += `
            <div class="photo-preview" style="background-color: #d0d0d0;">
                <div class="remove-photo" onclick="removePhoto(${photo.id})">
                    <i class="bi bi-x"></i>
                </div>
            </div>
        `;
    });
    
    // Кнопка добавления (если меньше 3)
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
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;
    const about = document.getElementById('about').value;
    
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
    
    // Проверяем, не подавал ли пользователь уже заявку на это мероприятие
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
    
    // Отмечаем, что пользователь подал заявку на это мероприятие
    appliedEvents.push(currentEvent.id);
    localStorage.setItem('appliedEvents', JSON.stringify(appliedEvents));
    
    console.log('Заявка отправлена, appliedEvents:', appliedEvents);
    
    alert(`Заявка на "${currentEvent.eventTitle}" отправлена!`);
    
    // Переходим в раздел "Мои запросы"
    window.location.href = 'my-anketas.html?tab=requests';
}
// Возврат
function goBack() {
    window.location.href = 'event-view.html';
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