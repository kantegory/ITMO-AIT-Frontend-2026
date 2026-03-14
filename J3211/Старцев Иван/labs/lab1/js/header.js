(() => {
    const header = document.querySelector("[data-app-header]");
    if (!header) {
        return;
    }
    const page = document.body.dataset.page;
    const active = {
        courses: page === "courses",
        myCourses: page === "my-courses",
        myLearning: page === "my-learning"
    };
    const buttonActive = (isActive) => `nav-link${isActive ? " active" : ""}`;
    header.innerHTML = `
        <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
            <div class="container-fluid ">
                <a class="navbar-brand" href="courses.html">Старцев Курсы</a>

                <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse"
                        data-bs-target="#mainNavCollapse" aria-controls="mainNavCollapse" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="dropdown order-lg-last ms-2">
                    <button class="btn p-0" type="button"
                            data-bs-toggle="dropdown" data-bs-auto-close="true" data-bs-display="static"
                            aria-expanded="false">
                        <img src="https://pixeljoint.com/files/icons/ladyhazy.gif" alt="Profile"
                             class="d-block " width="40" height="40">
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm rounded-3 p-2">
                        <li><a class="dropdown-item rounded-2 px-3 py-2" href="profile.html"> Профиль</a></li>
                        <li><a class="dropdown-item rounded-2 px-3 py-2" href="my-learning.html">Моё обучение</a></li>
                        <li><a class="dropdown-item rounded-2 px-3 py-2" href="my-courses.html"> Мои курсы</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item rounded-2 px-3 py-2 text-danger" href="login.html"> Выйти</a></li>
                    </ul>
                </div>

                <div class="collapse navbar-collapse" id="mainNavCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item"><a class="${buttonActive(active.courses)}" href="courses.html">Курсы</a></li>
                        <li class="nav-item"><a class="${buttonActive(active.myCourses)}" href="my-courses.html">Мои курсы</a></li>
                        <li class="nav-item"><a class="${buttonActive(active.myLearning)}" href="my-learning.html">Моё обучение</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
})();
