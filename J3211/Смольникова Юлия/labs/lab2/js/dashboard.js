document.addEventListener("DOMContentLoaded", initDashboardPage);

async function initDashboardPage() {
    if (!requireAuth()) return;

    const user = getUser();
    fillUserInfo(user);

    const coursesContainer = document.getElementById("myCoursesList");
    coursesContainer.innerHTML = `
        <div class="col-12 text-center my-5 py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">Загрузка данных...</p>
        </div>`;

    const createdContainer = document.getElementById("createdCoursesList");
    if (createdContainer) {
        createdContainer.innerHTML = `
            <div class="col-12 text-center my-5 py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3 text-muted">Загрузка данных...</p>
            </div>`;
    }

    try {
        const [enrollments, coursesData] = await Promise.all([
            getUserCourses(user.id),
            getCourses(1, 1000, { userId: user.id })
        ]);

        const enrolledCourses = enrollments.map(e => e.course).filter(Boolean);
        const createdCourses = coursesData.courses || [];

        const finishedCount = enrollments.filter(e => e.completed).length;

        // Статистика
        document.getElementById("profileCoursesCount").textContent = enrolledCourses.length;
        document.getElementById("profileFinishedCount").textContent = finishedCount;
        document.getElementById("profileCertificatesCount").textContent = "0";
        document.getElementById("createdCoursesCount").textContent = createdCourses.length;

        // Рендер секций
        renderEnrolledCourses(enrolledCourses, enrollments);
        renderCreatedCourses(createdCourses);
        renderCertificates([]);
    } catch (err) {
        console.error("Dashboard error:", err);
        renderDashboardError(err.message);
    }
}

function fillUserInfo(user) {
    const name = user?.name || "Пользователь";
    const role = "Пользователь";
    const avatar = name.charAt(0).toUpperCase();

    document.getElementById("profileUserName").textContent = name;
    document.getElementById("topbarUserName").textContent = name;
    document.getElementById("topbarUserRole").textContent = role;
    document.getElementById("topbarUserAvatar").textContent = avatar;
}

function renderEnrolledCourses(courses, enrollments) {
    const container = document.getElementById("myCoursesList");
    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                    <div class="empty-state-icon mb-3">📚</div>
                    <h5>Вы ещё не записались ни на один курс</h5>
                    <p class="text-muted">Запишитесь на интересующие курсы в каталоге</p>
                    <a href="index.html" class="btn btn-primary-custom mt-3">
                        Перейти в каталог
                    </a>
                </div>
            </div>`;
        return;
    }

    courses.forEach(course => {
        const enrollment = enrollments.find(e => e.course && e.course.id === course.id);
        const progress = enrollment?.progress || 0;
        const isCompleted = enrollment?.completed || false;

        container.insertAdjacentHTML("beforeend", `
            <div class="col-md-6 col-xl-4">
                <div class="card dashboard-course-card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="badge badge-subject">${course.subject || "Без категории"}</span>
                            ${isCompleted
                                ? '<span class="badge bg-success text-white">Завершён</span>'
                                : `<span class="badge bg-light text-dark">${course.level || "—"}</span>`}
                        </div>
                        <h5 class="card-title mb-2">${course.title}</h5>
                        <p class="dashboard-course-description flex-grow-1">
                            ${course.desc || "Описание отсутствует"}
                        </p>
                        ${!isCompleted ? `
                        <div class="mb-3">
                            <div class="d-flex justify-content-between small text-muted mb-1">
                                <span>Прогресс</span>
                                <span>${progress}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                        </div>` : ''}
                        <div class="mt-auto">
                            <a href="course.html?id=${course.id}"
                               class="btn btn-primary-custom w-100">
                                ${isCompleted ? 'Повторить курс' : 'Продолжить обучение →'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderCreatedCourses(courses) {
    const container = document.getElementById("createdCoursesList");
    if (!container) return;
    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                    <div class="empty-state-icon mb-3">✏️</div>
                    <h5>У вас пока нет своих курсов</h5>
                    <p class="text-muted">Создайте свой первый курс и делитесь знаниями</p>
                    <a href="teacher.html" class="btn btn-primary-custom mt-3">
                        Создать курс
                    </a>
                </div>
            </div>`;
        return;
    }

    courses.forEach(course => {
        container.insertAdjacentHTML("beforeend", `
            <div class="col-md-6 col-xl-4">
                <div class="card dashboard-course-card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="badge badge-subject">${course.subject || "Без категории"}</span>
                            <span class="badge bg-light text-dark">${course.level || "—"}</span>
                        </div>
                        <h5 class="card-title mb-2">${course.title}</h5>
                        <p class="dashboard-course-description flex-grow-1">
                            ${course.desc || "Описание отсутствует"}
                        </p>
                        <div class="mt-auto d-flex gap-2">
                            <a href="course.html?id=${course.id}"
                               class="btn btn-outline-custom flex-fill">
                                Открыть
                            </a>
                            <a href="teacher.html"
                               class="btn btn-primary-custom flex-fill">
                                Управление
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderCertificates(certificates) {
    const container = document.getElementById("certificatesList");
    container.innerHTML = "";

    if (certificates.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                    <div class="certificate-icon mb-3">🏆</div>
                    <h5>Сертификатов пока нет</h5>
                    <p class="text-muted">Завершите хотя бы один курс, и сертификат появится здесь</p>
                </div>
            </div>`;
        return;
    }
}

function renderDashboardError(errorMsg = "") {
    document.getElementById("profileCoursesCount").textContent = "0";
    document.getElementById("profileFinishedCount").textContent = "0";
    document.getElementById("profileCertificatesCount").textContent = "0";

    const createdCount = document.getElementById("createdCoursesCount");
    if (createdCount) createdCount.textContent = "0";

    const container = document.getElementById("myCoursesList");
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center p-4">
                <h5>Не удалось загрузить данные</h5>
                <p class="mb-3">${errorMsg || "Проверьте подключение к серверу"}</p>
                <button onclick="location.reload()" class="btn btn-outline-primary">
                    Попробовать снова
                </button>
            </div>
        </div>`;

    const createdContainer = document.getElementById("createdCoursesList");
    if (createdContainer) createdContainer.innerHTML = "";
}