import auth from "./auth.js";

(() => {
    const header = document.querySelector("[data-app-header]");
    const page = document.body.dataset.page || "";

    const getLinkClass = (name) => page === name ? "nav-link active" : "nav-link";

    const getLinks = (user) => {
        const links = [
            `<li class="nav-item"><a class="${getLinkClass("courses")}" href="courses.html">Курсы</a></li>`
        ];

        if (user) {
            links.push(`<li class="nav-item"><a class="${getLinkClass("my-courses")}" href="my-courses.html">Мои курсы</a></li>`);
            links.push(`<li class="nav-item"><a class="${getLinkClass("my-learning")}" href="my-learning.html">Моё обучение</a></li>`);
        }

        return links.join("");
    };

    const render = async () => {
        const user = await auth.loadCurrentUser();

        header.innerHTML = `
            <nav class="navbar navbar-expand-lg bg-dark navbar-dark border-bottom">
                <div class="container-fluid">
                    <a class="navbar-brand" href="courses.html">Старцев Курсы</a>

                    <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse"
                            data-bs-target="#mainNavCollapse" aria-controls="mainNavCollapse" aria-expanded="false"
                            aria-label="Открыть меню">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="d-flex align-items-center order-lg-last gap-2">
                        <button class="btn btn-outline-light header__button rounded-circle object-fit-cover" type="button" data-theme-toggle aria-label="Переключить тему">
                            <svg class="header_svg" aria-hidden="true">
                                <use href="./sprites.svg#circleHalf"></use>
                            </svg>
                        </button>

                        ${user ? `
                            <div class="dropdown">
                                <button class="btn p-0" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" data-bs-display="static" aria-expanded="false" aria-label="открыть меню профиля">
                                    <img src="${user.avatar}" alt="${user.name}" class="rounded-circle object-fit-cover" width="40" height="40">
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end shadow-sm rounded-3 p-2">
                                    <li><a class="dropdown-item rounded-2 px-3 py-2" href="profile.html">Профиль</a></li>
                                    <li><a class="dropdown-item rounded-2 px-3 py-2" href="my-learning.html">Моё обучение</a></li>
                                    <li><a class="dropdown-item rounded-2 px-3 py-2" href="my-courses.html">Мои курсы</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><button class="dropdown-item rounded-2 px-3 py-2 text-danger" type="button" data-logout>Выйти</button></li>
                                </ul>
                            </div>
                        ` : `
                            <a class="btn btn-outline-light header__button" href="login.html" aria-label="Войти">
                                <svg class="header_svg" aria-hidden="true">
                                    <use href="./sprites.svg#door"></use>
                                </svg>
                            </a>
                        `}
                    </div>

                    <div class="collapse navbar-collapse" id="mainNavCollapse">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            ${getLinks(user)}
                        </ul>
                    </div>
                </div>
            </nav>
        `;

        const logoutButton = header.querySelector("[data-logout]");

        if (logoutButton) {
            logoutButton.onclick = () => {
                auth.clearSession();
                window.location.replace("courses.html");
            };
        }
        const themeButton = header.querySelector("[data-theme-toggle]");
        if (themeButton) {
            themeButton.onclick = () => {
                window.theme.toggle();
            };
        }
    };

    render();
    window.addEventListener("userchange", render);
})();
