document.addEventListener("DOMContentLoaded", renderNavbar);

function renderNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;

    const user = getUser();
    const isAuth = isAuthenticated();

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const authButtons = isAuth
        ? `<button onclick="logout()" class="btn btn-outline-custom btn-sm">Выход</button>`
        : `<a href="login.html" class="btn btn-outline-custom btn-sm">Вход</a>
           <a href="register.html" class="btn btn-primary-custom btn-sm">Регистрация</a>`;

    const navLinks = `
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <a class="nav-link ${isActive('index.html', currentPage)}" href="index.html">Главная</a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${isActive('catalog.html', currentPage)}" href="catalog.html">Каталог</a>
            </li>
            ${isAuth ? `
            <li class="nav-item">
                <a class="nav-link ${isActive('dashboard.html', currentPage)}" href="dashboard.html">Моё обучение</a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${isActive('teacher.html', currentPage)}" href="teacher.html">Создать курс</a>
            </li>` : ""}
        </ul>
    `;

    container.innerHTML = `
        <nav class="navbar navbar-expand-lg sticky-top">
            <div class="container">
                <a class="navbar-brand fw-bold" href="index.html">Learnify</a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#mainNavbar" aria-controls="mainNavbar" 
                        aria-expanded="false" aria-label="Открыть меню">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="mainNavbar">
                    ${navLinks}
                    
                    <div class="d-flex align-items-center gap-2 ms-lg-3">
                        ${isAuth ? `<span class="small navbar-user-name">${user?.name || ""}</span>` : ""}
                        ${authButtons}
                    </div>
                </div>
            </div>
        </nav>
    `;
}

function isActive(linkHref, currentPage) {
    if (linkHref === 'index.html' && (currentPage === 'index.html' || currentPage === '')) return 'active';
    if (linkHref === currentPage) return 'active';
    return '';
}

function getVideoEmbedUrl(input) {
    if (!input) return "";
    input = input.trim();

    if (input.endsWith(".mp4") || input.endsWith(".webm")) {
        return "DIRECT_VIDEO:" + input;
    }

    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^#&?]*).*/;
    const ytMatch = input.match(ytRegex);

    if (ytMatch && ytMatch[5].length === 11) {
        return `https://www.youtube.com/embed/${ytMatch[5]}?autoplay=1&rel=0`;
    }

    return input;
}

window.getVideoEmbedUrl = getVideoEmbedUrl;