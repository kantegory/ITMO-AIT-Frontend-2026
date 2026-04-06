document.addEventListener("DOMContentLoaded", initCoursePage);

let currentCourseData = null;

function initCoursePage() {
    const courseId = getCourseIdFromUrl();
    currentCourseData = getCourseById(courseId);

    if (!currentCourseData) {
        renderCourseNotFound();
        return;
    }

    fillCourseInfo(currentCourseData);
    renderLessons(currentCourseData.lessons || []);
    renderMaterials(currentCourseData.materials || []);
    renderTasks(currentCourseData.tasks || []);
    hideCompleteLessonButton();
    loadFirstLessonVideo(currentCourseData.lessons || []);
}

function getCourseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

function fillCourseInfo(course) {
    document.getElementById("courseTitlePage").textContent = course.title || "Без названия";
    document.getElementById("courseDescPage").textContent = course.desc || "Описание курса отсутствует";
    document.getElementById("courseLevelInfo").textContent = course.level || "—";
    document.getElementById("courseSubjectInfo").textContent = course.subject || "—";
    document.getElementById("coursePriceInfo").textContent = getCoursePriceText(course.price);
    document.getElementById("courseLessonsCount").textContent = String(getLessonsCount(course.lessons));

    document.title = course.title ? `${course.title} — Learnify` : "Просмотр курса";
}

function getCoursePriceText(price) {
    return Number(price) > 0 ? `${price} ₽` : "Бесплатно";
}

function getLessonsCount(lessons) {
    return Array.isArray(lessons) ? lessons.length : 0;
}

function renderCourseNotFound() {
    document.getElementById("courseTitlePage").textContent = "Курс не найден";
    document.getElementById("courseDescPage").textContent = "Проверьте ссылку и вернитесь в каталог.";

    renderEmptyLessons();
    renderEmptyMaterials();
    renderEmptyTasks();
    hideCompleteLessonButton();
}

function renderLessons(lessons) {
    const container = document.getElementById("lessonList");
    if (!container) return;

    container.innerHTML = "";

    if (lessons.length === 0) {
        renderEmptyLessons();
        return;
    }

    lessons.forEach((lesson, index) => {
        container.insertAdjacentHTML("beforeend", createLessonItem(lesson, index === 0));
    });

    bindLessonClicks();
}

function createLessonItem(lesson, isActive = false) {
    const activeClass = isActive ? "active" : "";
    const timeClass = isActive ? "text-white" : "text-muted";

    return `
        <li class="list-group-item lesson-item ${activeClass}" data-video-id="${lesson.videoId || ""}">
            <div class="d-flex justify-content-between align-items-center gap-3">
                <span>${lesson.title || "Урок без названия"}</span>
                <small class="${timeClass}">${lesson.duration || ""}</small>
            </div>
        </li>
    `;
}

function bindLessonClicks() {
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.addEventListener("click", () => {
            const videoId = item.dataset.videoId || "";
            loadVideo(videoId, item);
        });
    });
}

function renderEmptyLessons() {
    const container = document.getElementById("lessonList");
    if (!container) return;

    container.innerHTML = `<li class="list-group-item text-muted">Уроки отсутствуют</li>`;
}

function renderMaterials(materials) {
    const container = document.getElementById("materialsList");
    if (!container) return;

    container.innerHTML = "";

    if (materials.length === 0) {
        renderEmptyMaterials();
        return;
    }

    materials.forEach(material => {
        container.insertAdjacentHTML("beforeend", createMaterialItem(material));
    });
}

function createMaterialItem(material) {
    const hasLink = material.link && material.link !== "#";

    return `
        <div class="list-group-item d-flex justify-content-between align-items-center gap-3">
            <div>
                <div class="fw-semibold">${material.title || "Материал без названия"}</div>
            </div>
            ${hasLink
            ? `<a href="${material.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-custom">Открыть</a>`
            : `<button type="button" class="btn btn-sm btn-outline-custom" disabled>Открыть</button>`
        }
        </div>
    `;
}

function renderEmptyMaterials() {
    const container = document.getElementById("materialsList");
    if (!container) return;

    container.innerHTML = `<div class="list-group-item text-muted">Материалы отсутствуют</div>`;
}

function renderTasks(tasks) {
    const container = document.getElementById("tasksList");
    if (!container) return;

    container.innerHTML = "";

    if (tasks.length === 0) {
        renderEmptyTasks();
        return;
    }

    tasks.forEach((task, index) => {
        container.insertAdjacentHTML("beforeend", createTaskCard(task, index));
    });
}

function createTaskCard(task, index) {
    const title = typeof task === "string" ? task : task.title || `Задание ${index + 1}`;
    const deadline = typeof task === "object" && task.deadline ? task.deadline : "Без дедлайна";

    return `
        <div class="card border-0 bg-light mb-3">
            <div class="card-body">
                <h6 class="fw-bold">Задание ${index + 1}</h6>
                <p class="mb-2">${title}</p>
                <p class="text-muted small mb-0">Срок: ${deadline}</p>
            </div>
        </div>
    `;
}

function renderEmptyTasks() {
    const container = document.getElementById("tasksList");
    if (!container) return;

    container.innerHTML = `<div class="text-muted">Задания отсутствуют</div>`;
}

function hideCompleteLessonButton() {
    const button = document.getElementById("completeLessonBtn");
    if (!button) return;

    button.style.display = "none";
}

function loadFirstLessonVideo(lessons) {
    if (!Array.isArray(lessons) || lessons.length === 0) return;

    const firstLesson = lessons[0];
    if (!firstLesson || !firstLesson.videoId) return;

    loadVideo(firstLesson.videoId);
}

function loadVideo(videoId, activeItem = null) {
    updateActiveLessonItem(activeItem);

    const iframe = document.querySelector("#videoPlayer iframe");
    if (!iframe || !videoId) return;

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

function updateActiveLessonItem(activeItem) {
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.classList.remove("active");

        const timeEl = item.querySelector("small");
        if (timeEl) {
            timeEl.classList.remove("text-white");
            timeEl.classList.add("text-muted");
        }
    });

    if (!activeItem) return;

    activeItem.classList.add("active");

    const activeTimeEl = activeItem.querySelector("small");
    if (activeTimeEl) {
        activeTimeEl.classList.remove("text-muted");
        activeTimeEl.classList.add("text-white");
    }
}