// Навигация
function navigateTo(page) {
    window.location.href = page;
}

// Боковое меню
function toggleSideMenu() {
    let sideMenu = document.getElementById('globalSideMenu');
    let overlay = document.getElementById('globalOverlay');
    
    if (!sideMenu) {
        sideMenu = document.createElement('div');
        sideMenu.id = 'globalSideMenu';
        sideMenu.className = 'side-menu';
        sideMenu.innerHTML = `
            <div class="side-menu-header">
                <div class="close-menu" onclick="closeGlobalSideMenu()">
                    <i class="bi bi-x-lg"></i>
                </div>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="user-name">Гость</div>
                </div>
            </div>
            <nav class="side-menu-nav">
                <div class="side-menu-item" onclick="navigateTo('../pages/community/feed.html')">
                    <i class="bi bi-people-fill"></i>
                    <span>Сообщества</span>
                </div>
                <div class="side-menu-item" onclick="alert('Друзья скоро!')">
                    <i class="bi bi-person-heart"></i>
                    <span>Друзья</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('../pages/community/my-anketas.html')">
                    <i class="bi bi-file-text-fill"></i>
                    <span>Мои анкеты</span>
                </div>
                <div class="side-menu-divider"></div>
                <div class="side-menu-section-title">
                    <span>Выбираем вместе</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('choose-together.html')">
                    <i class="bi bi-plus-circle"></i>
                    <span>Создать чат</span>
                </div>
                <div class="side-menu-item" onclick="navigateTo('choose-together.html')">
                    <i class="bi bi-chat-text"></i>
                    <span>Мои чаты</span>
                </div>
                <div class="side-menu-divider"></div>
                <div class="side-menu-item" onclick="alert('Челленджи скоро!')">
                    <i class="bi bi-trophy-fill"></i>
                    <span>Челленджи</span>
                </div>
                <div class="side-menu-item" onclick="alert('Колесо удачи скоро!')">
                    <i class="bi bi-suit-club-fill"></i>
                    <span>Колесо удачи</span>
                </div>
            </nav>
        `;
        document.body.appendChild(sideMenu);
        
        overlay = document.createElement('div');
        overlay.id = 'globalOverlay';
        overlay.className = 'overlay';
        overlay.onclick = closeGlobalSideMenu;
        document.body.appendChild(overlay);
        
        const style = document.createElement('style');
        style.textContent = `
            .side-menu {
                position: fixed; top: 0; left: -300px; width: 280px; height: 100%;
                background: white; z-index: 1000; transition: left 0.3s ease;
                box-shadow: 2px 0 20px rgba(0,0,0,0.1); overflow-y: auto;
            }
            .side-menu.open { left: 0; }
            .side-menu-header { padding: 20px; border-bottom: 1px solid #f0f0f0; background: linear-gradient(135deg, #f5f9ff 0%, #eef3fc 100%); }
            .close-menu { text-align: right; font-size: 24px; cursor: pointer; margin-bottom: 20px; color: #F41D91; }
            .user-info { display: flex; align-items: center; gap: 12px; }
            .user-avatar { font-size: 48px; color: #F41D91; }
            .user-name { font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #F41D91 0%, #F2711E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
            .side-menu-nav { padding: 20px; }
            .side-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; cursor: pointer; border-radius: 12px; transition: all 0.2s; }
            .side-menu-item i { font-size: 22px; color: #F41D91; width: 32px; }
            .side-menu-item span { font-size: 16px; color: #333; }
            .side-menu-item:active { background: #eef3fc; transform: translateX(4px); }
            .side-menu-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(244, 29, 145, 0.2), transparent); margin: 16px 0; }
            .side-menu-section-title { padding: 8px 0 4px 0; margin-bottom: 4px; }
            .side-menu-section-title span { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; background: linear-gradient(135deg, #F41D91 0%, #F2711E 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
            .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; display: none; }
            .overlay.show { display: block; }
        `;
        document.head.appendChild(style);
    }
    
    sideMenu.classList.toggle('open');
    overlay.classList.toggle('show');
}

function closeGlobalSideMenu() {
    const sideMenu = document.getElementById('globalSideMenu');
    const overlay = document.getElementById('globalOverlay');
    if (sideMenu) sideMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

function goBack() {
    window.location.href = '../index.html';
}

function tryItNow() {
    window.location.href = 'choose-together.html';
}

function closeFloatingCard() {
    const card = document.getElementById('floatingCard');
    const overlay = document.getElementById('floatingOverlay');
    if (card) {
        card.classList.remove('show');
        overlay.classList.remove('show');
        if (floatingTimeout) {
            clearTimeout(floatingTimeout);
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    showFloatingCard();
    console.log('Страница инструкции загружена');
});