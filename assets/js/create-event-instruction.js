function goBack() {
    window.history.back();
}

function tryItNow() {
    window.location.href = 'feed.html';
}

function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница инструкции создания мероприятия загружена');
});