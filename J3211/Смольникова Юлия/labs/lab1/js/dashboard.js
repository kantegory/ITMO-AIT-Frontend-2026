document.addEventListener("DOMContentLoaded", renderDashboard);

function renderDashboard() {
    fillUserInfo();
    fillStats();
    renderMyCourses(getDashboardCourses());
    renderCertificates([]);
}

function fillUserInfo() {
    const userName = "Пользователь";
    const userRole = "Студент";
    const avatarLetter = "P";

    document.getElementById("profileUserName").textContent = userName;
    document.getElementById("topbarUserName").textContent = userName;
    document.getElementById("topbarUserRole").textContent = userRole;
    document.getElementById("topbarUserAvatar").textContent = avatarLetter;
}

function getDashboardCourses() {
    return getAllCourses().slice(0, 3);
}

function fillStats() {
    const courses = getDashboardCourses();
    const completedCourses = [];

    document.getElementById("profileCoursesCount").textContent = String(courses.length);
    document.getElementById("profileFinishedCount").textContent = String(completedCourses.length);
    document.getElementById("profileCertificatesCount").textContent = String(completedCourses.length);
}

function renderMyCourses(courses) {
    const container = document.getElementById("myCoursesList");
    if (!container) return;

    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = createEmptyCoursesState();
        return;
    }

    courses.forEach(course => {
        container.insertAdjacentHTML("beforeend", createDashboardCourseCard(course));
    });
}

function createEmptyCoursesState() {
    return `
        <div class="col-12">
            <div class="card p-4 text-center">
                <h4 class="mb-2">Курсов пока нет</h4>
                <p class="text-muted mb-0">Выберите курс в каталоге, чтобы начать обучение.</p>
            </div>
        </div>
    `;
}

function createDashboardCourseCard(course) {
    return `
        <div class="col-md-6 col-xl-4">
            <div class="card dashboard-course-card h-100">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge badge-subject">${course.subject || "Без категории"}</span>
                        <span class="badge bg-light text-dark">${course.level || "Без уровня"}</span>
                    </div>

                    <h5 class="card-title mb-2">${course.title}</h5>

                    <p class="dashboard-course-description">
                        ${course.desc || "Описание курса пока не добавлено."}
                    </p>

                    <div class="dashboard-course-actions">
                        <a href="course.html?id=${course.id}" class="btn btn-primary-custom btn-sm">
                            Открыть
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCertificates(certificates) {
    const container = document.getElementById("certificatesList");
    if (!container) return;

    container.innerHTML = "";

    if (certificates.length === 0) {
        container.innerHTML = createEmptyCertificatesState();
        return;
    }

    certificates.forEach(course => {
        container.insertAdjacentHTML("beforeend", createCertificateCard(course));
    });
}

function createEmptyCertificatesState() {
    return `
        <div class="col-12">
            <div class="card p-4 text-center">
                <h4 class="mb-2">Сертификатов пока нет</h4>
                <p class="text-muted mb-0">Сертификаты будут доступны позже.</p>
            </div>
        </div>
    `;
}

function createCertificateCard(course) {
    return `
        <div class="col-md-6 col-xl-4">
            <div class="card certificate-card h-100">
                <div class="card-body">
                    <div class="certificate-icon">🏅</div>
                    <h5 class="card-title mb-2">${course.title}</h5>
                    <p class="text-muted small mb-0">
                        ${course.subject || "Курс"} • ${course.level || "Без уровня"}
                    </p>
                </div>
            </div>
        </div>
    `;
}