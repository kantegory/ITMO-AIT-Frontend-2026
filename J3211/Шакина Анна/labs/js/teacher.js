document.addEventListener("DOMContentLoaded", () => {
    const auth = window.SchoolAuth;
    const api = window.SchoolApi;
    const title = document.getElementById("teacherUserTitle");
    const subtitle = document.getElementById("teacherUserSubtitle");
    const counter = document.getElementById("teacherEventsCounter");
    const eventsGrid = document.getElementById("teacherEventsGrid");
    const studentsWrap = document.getElementById("teacherStudentsWrap");

    if (!auth || !api || !title || !subtitle || !counter || !eventsGrid || !studentsWrap) {
        return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser?.id) {
        window.location.href = "login.html";
        return;
    }

    if (currentUser.role !== "teacher") {
        auth.redirectToUserHome(currentUser);
        return;
    }

    title.textContent = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Учитель";
    subtitle.textContent = "Здесь собраны мероприятия, где вы назначены ответственным.";

    init();

    async function init() {
        try {
            const [events, registrations, users] = await Promise.all([
                api.getEvents(),
                api.getRegistrations({ status: "active" }),
                api.getUsers()
            ]);
            const teacherEvents = events
                .map((event) => auth.normalizeEvent(event))
                .filter((event) => String(event.responsibleTeacherId) === String(currentUser.id))
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            const usersById = new Map(users.map((user) => [String(user.id), auth.normalizeUser(user)]));

            counter.textContent = `Мероприятий: ${teacherEvents.length}`;
            renderEvents(teacherEvents, registrations, usersById);
            renderStudents(teacherEvents, registrations, usersById);
        } catch {
            counter.textContent = "Мероприятий: 0";
            eventsGrid.innerHTML = `
                <div class="profile-state-card">
                    <h2 class="events-empty-title mb-2">Не удалось загрузить мероприятия</h2>
                    <p class="events-empty-text mb-0">Проверьте, запущен ли mock API.</p>
                </div>
            `;
            studentsWrap.innerHTML = "";
        }
    }

    function renderEvents(events, registrations, usersById) {
        if (!events.length) {
            eventsGrid.innerHTML = `
                <div class="profile-state-card">
                    <h2 class="events-empty-title mb-2">Пока нет назначенных мероприятий</h2>
                    <p class="events-empty-text mb-0">Назначенные мероприятия появятся здесь.</p>
                </div>
            `;
            return;
        }

        eventsGrid.innerHTML = events
            .map((event) => {
                const students = getRegisteredStudentsForEvent(event.id, registrations, usersById);
                return `
                    <div class="col-12 col-md-6 col-xl-4">
                        <a class="event-card-link" href="event.html?id=${encodeURIComponent(event.id)}">
                            <article class="event-card-custom">
                                <div class="event-card-image-wrap">
                                    <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}" class="event-card-image">
                                    <span class="badge text-bg-light border rounded-pill goal-badge position-absolute top-0 start-0 m-3">${escapeHtml(auth.getGoalLabel(event.goal))}</span>
                                </div>
                                <div class="event-card-body">
                                    <h3 class="event-card-title">${escapeHtml(event.title)}</h3>
                                    <p class="event-card-text">${escapeHtml(event.description)}</p>
                                    <div class="event-card-meta mb-2">
                                        <span class="event-meta-pill">${escapeHtml(auth.getPlaceLabel(event.place))}</span>
                                        <span class="event-meta-pill">${escapeHtml(auth.formatDate(event.date))}</span>
                                    </div>
                                    <div class="dashboard-card-note">Зарегистрировано: ${students.length} из ${event.capacity}</div>
                                </div>
                            </article>
                        </a>
                    </div>
                `;
            })
            .join("");
    }

    function renderStudents(events, registrations, usersById) {
        if (!events.length) {
            studentsWrap.innerHTML = `
                <div class="profile-state-card mb-0">
                    <h2 class="events-empty-title mb-2">Список учеников появится здесь</h2>
                    <p class="events-empty-text mb-0">Сначала должны появиться ваши мероприятия и записи учеников.</p>
                </div>
            `;
            return;
        }

        studentsWrap.innerHTML = events
            .map((event) => {
                const students = getRegisteredStudentsForEvent(event.id, registrations, usersById);
                const studentsMarkup = students.length
                    ? students
                        .map((student) => `
                            <div class="dashboard-list-row">
                                <div>
                                    <div class="dashboard-list-title">${escapeHtml(getUserName(student))}</div>
                                    <div class="dashboard-list-subtitle">${escapeHtml(getStudentClassLabel(student))}</div>
                                </div>
                                <span class="event-meta-pill">${escapeHtml(student.email || "Почта не указана")}</span>
                            </div>
                        `)
                        .join("")
                    : `
                        <div class="profile-state-card mb-0">
                            <p class="events-empty-text mb-0">На это мероприятие еще никто не записался.</p>
                        </div>
                    `;

                return `
                    <article class="dashboard-panel">
                        <div class="dashboard-panel-head">
                            <div>
                                <h2 class="dashboard-panel-title">${escapeHtml(event.title)}</h2>
                                <p class="dashboard-panel-text mb-0">${escapeHtml(auth.formatDate(event.date))} · ${escapeHtml(auth.getPlaceLabel(event.place))}</p>
                            </div>
                            <span class="events-kicker mb-0">Учеников: ${students.length}</span>
                        </div>
                        <div class="dashboard-list">${studentsMarkup}</div>
                    </article>
                `;
            })
            .join("");
    }

    function getRegisteredStudentsForEvent(eventId, registrations, usersById) {
        return registrations
            .filter(
                (registration) =>
                    String(registration.eventId) === String(eventId) && registration.status === "active"
            )
            .map((registration) => usersById.get(String(registration.userId)))
            .filter((user) => user && user.role === "student");
    }

    function getUserName(user) {
        return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Без имени";
    }

    function getStudentClassLabel(student) {
        if (student.isExternal) {
            return "Не является учеником школы";
        }

        if (student.studentClass && student.studentLetter) {
            return `${student.studentClass} ${student.studentLetter} класс`;
        }

        return "Класс не указан";
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
