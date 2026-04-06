document.addEventListener("DOMContentLoaded", renderNavbar);

function renderNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;

    container.innerHTML = `
        <nav class="navbar navbar-expand-lg sticky-top">
            <div class="container">
                <a class="navbar-brand fw-bold" href="index.html">Learnify</a>

                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="#mainNavbar"
                    aria-expanded="false"
                    aria-label="Переключить навигацию"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="mainNavbar">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="index.html">Главная</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="index.html">Каталог</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="dashboard.html">Моё обучение</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="teacher.html">Преподаватель</a>
                        </li>
                    </ul>

                    <div class="d-flex align-items-center gap-2">
                        <a href="login.html" class="btn btn-outline-custom btn-sm">Вход</a>
                        <a href="register.html" class="btn btn-primary-custom btn-sm">Регистрация</a>
                    </div>
                </div>
            </div>
        </nav>
    `;
}