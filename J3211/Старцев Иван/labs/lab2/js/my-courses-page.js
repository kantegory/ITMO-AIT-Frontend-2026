(() => {
    const pageAlert = document.getElementById("myCoursesAlert");
    const container = document.getElementById("createdCoursesContainer");
    const emptyState = document.getElementById("emptyState");
    const courseForm = document.getElementById("courseForm");
    const programSections = document.getElementById("programSections");
    const addSectionButton = document.getElementById("addSectionBtn");
    const openCreateButton = document.getElementById("openCreateCourseModalBtn");
    const modalElement = document.getElementById("courseModal");
    const modalTitle = document.getElementById("courseModalLabel");
    let currentUser = null;
    let users = [];
    let courses = [];
    let editingCourseId = null;

    const showMessage = (type, text) => {
        pageAlert.className = `alert alert-${type} mb-3`;
        pageAlert.textContent = text;
        pageAlert.classList.remove("d-none");
    };

    const hideMessage = () => {
        pageAlert.className = "alert d-none";
        pageAlert.textContent = "";
    };

    const getCourseRating = (course) => {
        if (!course.comments.length) {return 0;}
        const total = course.comments.reduce((sum, comment) => sum + comment.rating, 0);
        return total / course.comments.length;
    };

    const getCourseStudents = (courseId) => users.filter((user) => user.learningCourseIds.includes(courseId)).length;

    const getEmptyLesson = (title = "Урок 1", content = "") => ({
        title,
        content
    });

    const getEmptySection = (title = "Раздел 1") => ({
        title,
        items: [getEmptyLesson()]
    });

    const getLessonHtml = (lesson) => `
        <div class="border rounded p-3" data-lesson-item>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="small text-muted">Урок</span>
                <button type="button" class="btn btn-sm btn-outline-danger" data-remove-lesson>
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="mb-2">
                <label class="form-label">Название урока</label>
                <input type="text" class="form-control" data-lesson-title value="${lesson.title}" required>
            </div>
            <div>
                <label class="form-label">Контент урока</label>
                <textarea class="form-control" rows="3" data-lesson-content required>${lesson.content}</textarea>
            </div>
        </div>
    `;

    const getSectionHtml = (section) => `
        <div class="card" data-program-section>
            <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <label class="form-label mb-0">Раздел</label>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-remove-section>
                        <i class="bi bi-trash"></i> Удалить раздел
                    </button>
                </div>
                <div class="mb-3">
                    <input type="text" class="form-control" data-section-title value="${section.title}" required>
                </div>
                <div class="d-grid gap-2" data-lessons-container>
                    ${section.items.map((lesson) => getLessonHtml(lesson)).join("")}
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" data-add-lesson>
                    <i class="bi bi-plus-circle"></i> Добавить урок
                </button>
            </div>
        </div>
    `;

    const renderProgram = (program) => {
        programSections.innerHTML = program.map((section) => getSectionHtml(section)).join("");
    };

    const getMyCourses = () => courses.filter((course) => currentUser.createdCourseIds.includes(course.id));

    const renderCourses = () => {
        const myCourses = getMyCourses();
        const studentsCount = myCourses.reduce((sum, course) => sum + getCourseStudents(course.id), 0);
        const revenue = myCourses.reduce((sum, course) => sum + (getCourseStudents(course.id) * course.price), 0);

        document.getElementById("statCoursesCount").textContent = myCourses.length;
        document.getElementById("statStudentsCount").textContent = studentsCount;
        document.getElementById("statRevenue").textContent = `${revenue} ₽`;
        emptyState.className = myCourses.length ? "alert alert-secondary d-none" : "alert alert-secondary";

        container.innerHTML = myCourses.map((course) => {
            const students = getCourseStudents(course.id);

            return `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div class="card h-100">
                        <img src="${course.image}" class="card-img-top" alt="${course.title}">
                        <div class="card-body">
                            <h3 class="h6 mb-2">${course.title}</h3>
                            <p class="small text-muted mb-1">${currentUser.name}</p>
                            <p class="small mb-1">Рейтинг: <strong>${getCourseRating(course).toFixed(1)} / 5</strong></p>
                            <p class="small mb-1">Цена: <strong>${course.price} ₽</strong></p>
                            <p class="small mb-1">Учеников: <strong>${students}</strong></p>
                            <p class="small mb-3">Выручка: <strong>${students * course.price} ₽</strong></p>
                            <div class="d-flex gap-1">
                                <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-primary">Открыть</a>
                                <button type="button" class="btn btn-sm btn-outline-secondary" data-edit-course-id="${course.id}"
                                        data-bs-toggle="modal" data-bs-target="#courseModal">
                                    Редактировать
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    };

    const loadData = async () => {
        courses = await window.api.getCourses();
        users = await window.api.getUsers();
        renderCourses();
    };

    const resetForm = () => {
        editingCourseId = null;
        courseForm.reset();
        modalTitle.textContent = "Создать курс";
        renderProgram([getEmptySection()]);
    };

    const fillForm = (course) => {
        if (!course) {
            return;
        }

        editingCourseId = course.id;
        modalTitle.textContent = "Редактировать курс";
        document.getElementById("courseTitleInput").value = course.title;
        document.getElementById("courseDescriptionInput").value = course.description;
        document.getElementById("courseFullDescriptionInput").value = course.fullDescription;
        document.getElementById("coursePriceInput").value = course.price;
        document.getElementById("courseLevelInput").value = course.level;
        document.getElementById("courseLanguageInput").value = course.language;
        document.getElementById("courseImageInput").value = course.image;
        renderProgram(course.program.length ? course.program : [getEmptySection()]);
    };

    const getProgram = () => {
        return Array.from(programSections.querySelectorAll("[data-program-section]")).map((sectionElement) => ({
            title: sectionElement.querySelector("[data-section-title]").value.trim(),
            items: Array.from(sectionElement.querySelectorAll("[data-lesson-item]")).map((lessonElement) => ({
                title: lessonElement.querySelector("[data-lesson-title]").value.trim(),
                content: lessonElement.querySelector("[data-lesson-content]").value.trim()
            }))
        }));
    };
    openCreateButton.addEventListener("click", () => {
        hideMessage();
        resetForm();
    });
    container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-edit-course-id]");
        if (!button) {
            return;
        }
        hideMessage();
        fillForm(courses.find((course) => course.id === Number(button.dataset.editCourseId)));
    });
    addSectionButton.addEventListener("click", () => {
        const sectionNumber = programSections.querySelectorAll("[data-program-section]").length + 1;
        programSections.insertAdjacentHTML("beforeend", getSectionHtml(getEmptySection(`Раздел ${sectionNumber}`)));
    });

    programSections.addEventListener("click", (event) => {
        const sectionElement = event.target.closest("[data-program-section]");

        if (!sectionElement) {
            return;
        }
        if (event.target.closest("[data-add-lesson]")) {
            const lessonsContainer = sectionElement.querySelector("[data-lessons-container]");
            const lessonNumber = lessonsContainer.querySelectorAll("[data-lesson-item]").length + 1;
            lessonsContainer.insertAdjacentHTML("beforeend", getLessonHtml(getEmptyLesson(`Урок ${lessonNumber}`)));
            return;
        }

        if (event.target.closest("[data-remove-section]")) {
            if (programSections.querySelectorAll("[data-program-section]").length === 1) {
                return;
            }
            sectionElement.remove();
            return;
        }

        if (event.target.closest("[data-remove-lesson]")) {
            const lessons = sectionElement.querySelectorAll("[data-lesson-item]");
            if (lessons.length === 1) {
                return;
            }
            event.target.closest("[data-lesson-item]").remove();
        }
    });

    courseForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideMessage();
        const isEditing = Boolean(editingCourseId);

        const payload = {
            title: document.getElementById("courseTitleInput").value.trim(),
            description: document.getElementById("courseDescriptionInput").value.trim(),
            fullDescription: document.getElementById("courseFullDescriptionInput").value.trim(),
            userId: currentUser.id,
            price: Number(document.getElementById("coursePriceInput").value),
            level: document.getElementById("courseLevelInput").value,
            language: document.getElementById("courseLanguageInput").value,
            image: document.getElementById("courseImageInput").value.trim(),
            program: getProgram()
        };

        try {
            if (isEditing) {
                const currentCourse = courses.find((course) => course.id === editingCourseId);

                await window.api.updateCourse(editingCourseId, {
                    ...payload,
                    comments: currentCourse.comments
                });
            } else {
                const createdCourse = await window.api.createCourse({
                    ...payload,
                    comments: []
                });
                currentUser = await window.api.updateUser(currentUser.id, {
                    createdCourseIds: [...currentUser.createdCourseIds, createdCourse.id]
                });
                window.auth.updateCurrentUser(currentUser);
            }
            await loadData();
            resetForm();
            window.bootstrap.Modal.getOrCreateInstance(modalElement).hide()
            showMessage("success", isEditing ? "Курс обновлен." : "Курс создан.");
        } catch {
            showMessage("danger", "Не удалось сохранить курс.");
        }
    });

    const init = async () => {
        currentUser = await window.auth.requireAuth();
        if (!currentUser) {
            return;
        }
        await loadData();
        resetForm();
    };

    init().catch(() => {
        showMessage("danger", "Не удалось загрузить мои курсы.");
    });
})();
