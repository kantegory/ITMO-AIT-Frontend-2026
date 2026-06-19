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

    const getLessonHtml = (lesson, lessonIndex = 0) => `
        <div class="border rounded p-3" data-lesson-item>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="h6 mb-0" data-lesson-heading>Урок ${lessonIndex + 1}</h5>
                <button type="button" class="btn btn-sm btn-outline-danger" data-remove-lesson aria-label="Удалить урок">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
            </div>
    
            <div class="mb-2">
                <label class="form-label w-100">
                    <span class="d-block mb-1">Название урока</span>
                    <input type="text" class="form-control" data-lesson-title value="${lesson.title}" required>
                </label>
            </div>
    
            <div>
                <label class="form-label w-100 mb-0">
                    <span class="d-block mb-1">Контент урока</span>
                    <textarea class="form-control" rows="3" data-lesson-content required>${lesson.content}</textarea>
                </label>
            </div>
        </div>
    `;

    const getSectionHtml = (section, sectionIndex = 0) => `
        <div class="card" data-program-section>
            <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <h4 class="h6 mb-0" data-section-heading>Раздел ${sectionIndex + 1}</h4>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-remove-section aria-label="Удалить раздел">
                        <i class="bi bi-trash" aria-hidden="true"></i> Удалить раздел
                    </button>
                </div>
    
                <div class="mb-3">
                    <label class="form-label w-100 mb-0">
                        <span class="d-block mb-1">Название раздела</span>
                        <input type="text" class="form-control" data-section-title value="${section.title}" required>
                    </label>
                </div>
                <div class="d-grid gap-2" data-lessons-container>
                    ${section.items.map((lesson, lessonIndex) => getLessonHtml(lesson, lessonIndex)).join("")}
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" data-add-lesson>
                    <i class="bi bi-plus-circle" aria-hidden="true"></i> Добавить урок
                </button>
            </div>
        </div>
    `;

    const renumberProgram = () => {
        programSections.querySelectorAll("[data-program-section]").forEach((sectionElement, sectionIndex) => {
            const sectionHeading = sectionElement.querySelector("[data-section-heading]");
            const sectionTitleInput = sectionElement.querySelector("[data-section-title]");
            if (sectionHeading) {
                sectionHeading.textContent = `Раздел ${sectionIndex + 1}`;
            }
            if (sectionTitleInput && /^Раздел \d+$/.test(sectionTitleInput.value.trim())) {
                sectionTitleInput.value = `Раздел ${sectionIndex + 1}`;
            }
            sectionElement.querySelectorAll("[data-lesson-item]").forEach((lessonElement, lessonIndex) => {
                const lessonHeading = lessonElement.querySelector("[data-lesson-heading]");
                const lessonTitleInput = lessonElement.querySelector("[data-lesson-title]");
                if (lessonHeading) {
                    lessonHeading.textContent = `Урок ${lessonIndex + 1}`;
                }
                if (lessonTitleInput && /^Урок \d+$/.test(lessonTitleInput.value.trim())) {
                    lessonTitleInput.value = `Урок ${lessonIndex + 1}`;
                }
            });
        });
    };



    const renderProgram = (program) => {
        programSections.innerHTML = program.map((section, sectionIndex) => getSectionHtml(section, sectionIndex)).join("");
        renumberProgram();
        bindProgramControls();
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
                <li class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <article class="card h-100">
                        <img src="${course.image}" class="card-img-top" alt="${course.title}">
                        <div class="card-body">
                            <h2 class="h6 mb-2">${course.title}</h2>
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
                    </article>
                </li>
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
        bindEditCourseButtons();
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

    addSectionButton.addEventListener("click", () => {
        const sectionNumber = programSections.querySelectorAll("[data-program-section]").length;
        programSections.insertAdjacentHTML("beforeend", getSectionHtml(getEmptySection(`Раздел ${sectionNumber + 1}`), sectionNumber));
        bindSectionControls(programSections.lastElementChild);
        renumberProgram();
    });
    const bindEditCourseButtons = () => {
        container.querySelectorAll("[data-edit-course-id]").forEach((button) => {
            button.addEventListener("click", () => {
                hideMessage();
                fillForm(courses.find((course) => course.id === Number(button.dataset.editCourseId)));
            });
        });
    };

    const bindLessonRemoveButton = (lessonElement, sectionElement) => {
        const removeLessonButton = lessonElement.querySelector("[data-remove-lesson]");
        if (!removeLessonButton) {
            return;
        }
        removeLessonButton.addEventListener("click", () => {
            const lessons = sectionElement.querySelectorAll("[data-lesson-item]");
            if (lessons.length === 1) {
                return;
            }
            lessonElement.remove();
            renumberProgram();
        });
    };

    const bindSectionControls = (sectionElement) => {
        const addLessonButton = sectionElement.querySelector("[data-add-lesson]");
        const removeSectionButton = sectionElement.querySelector("[data-remove-section]");
        const lessonsContainer = sectionElement.querySelector("[data-lessons-container]");
        sectionElement.querySelectorAll("[data-lesson-item]").forEach((lessonElement) => {
            bindLessonRemoveButton(lessonElement, sectionElement);
        });
        addLessonButton.addEventListener("click", () => {
            const lessonNumber = lessonsContainer.querySelectorAll("[data-lesson-item]").length;
            lessonsContainer.insertAdjacentHTML("beforeend", getLessonHtml(getEmptyLesson(`Урок ${lessonNumber + 1}`), lessonNumber));
            renumberProgram();
            bindLessonRemoveButton(lessonsContainer.lastElementChild, sectionElement);
        });
        removeSectionButton.addEventListener("click", () => {
            if (programSections.querySelectorAll("[data-program-section]").length === 1) {
                return;
            }
            sectionElement.remove();
            renumberProgram();
        });
    };
    const bindProgramControls = () => {
        programSections.querySelectorAll("[data-program-section]").forEach((sectionElement) => {
            bindSectionControls(sectionElement);
        });
    };
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
