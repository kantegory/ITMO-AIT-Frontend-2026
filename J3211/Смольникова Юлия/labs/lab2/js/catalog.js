let currentPage = 1;
const coursesPerPage = 6;
let currentCourseList = [];
let allCourses = [];

document.addEventListener("DOMContentLoaded", () => {
    initCatalogPage();
    initEventDelegation();
});

function initEventDelegation() {
    const container = document.getElementById("courseList");
    container.addEventListener("click", (e) => {
        const enrollBtn = e.target.closest(".btn-enroll-course");
        if (enrollBtn) {
            e.preventDefault();
            handleEnroll(Number(enrollBtn.dataset.courseId));
            return;
        }

        const previewBtn = e.target.closest(".btn-preview-course");
        if (previewBtn) {
            e.preventDefault();
            openCoursePreview(e, Number(previewBtn.dataset.courseId));
        }
    });
}

async function initCatalogPage() {
    await loadCourses();
    initFilters();
}

async function loadCourses() {
    const container = document.getElementById("courseList");
    const pagination = document.getElementById("paginationContainer");

    if (!container) return;

    container.innerHTML = `
        <div class="col-12 text-center my-5 py-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">Загрузка каталога курсов...</p>
        </div>`;

    try {
        const result = await getCourses(1, 1000);
        allCourses = result.courses || [];
        currentPage = 1;
        renderCourses(allCourses);
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center p-4">
                    <h5>Не удалось загрузить курсы</h5>
                    <p class="mb-3">${err.message || "Проверьте подключение к серверу"}</p>
                    <button class="btn btn-outline-custom btn-sm" id="retryLoadBtn">Повторить попытку</button>
                </div>
            </div>`;
        if (pagination) pagination.innerHTML = "";
        
        document.getElementById("retryLoadBtn")?.addEventListener("click", loadCourses);
    }
}

function renderCourses(list = []) {
    currentCourseList = list;
    const container = document.getElementById("courseList");
    const pagination = document.getElementById("paginationContainer");

    if (!container) return;
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card text-center p-5">
                    <h4>Курсы не найдены</h4>
                    <p class="text-muted">Попробуйте изменить фильтры</p>
                </div>
            </div>`;
        if (pagination) pagination.innerHTML = "";
        return;
    }

    const totalPages = Math.ceil(list.length / coursesPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * coursesPerPage;
    const pageItems = list.slice(start, start + coursesPerPage);

    pageItems.forEach(course => {
        container.insertAdjacentHTML("beforeend", createCourseCard(course));
    });

    renderPagination(totalPages);
}

function createCourseCard(course) {
    const price = Number(course.price) > 0 ? `${course.price} ₽` : "Бесплатно";
    const isAuth = isAuthenticated();
    const detailsAction = isAuth
        ? `<a href="course.html?id=${course.id}" class="btn btn-outline-custom btn-sm flex-fill me-2">Подробнее</a>`
        : `<a href="#" class="btn btn-outline-custom btn-sm flex-fill me-2 btn-preview-course" data-course-id="${course.id}">Подробнее</a>`;

    const enrollAction = isAuth
        ? `<button class="btn btn-primary-custom btn-sm flex-fill btn-enroll-course" data-course-id="${course.id}">Записаться</button>`
        : ``;

    return `
        <article class="col-md-6 col-xl-4 mb-4">
            <div class="card course-card h-100 shadow-sm">
                <div class="card-category-bar"></div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between mb-3">
                        <span class="badge badge-subject">${course.subject || "Без категории"}</span>
                        <span class="badge badge-price">${price}</span>
                    </div>
                    <h5 class="card-title">${course.title}</h5>
                    <p class="course-description flex-grow-1">${course.desc || "Описание отсутствует"}</p>
                    
                    <div class="course-actions mt-auto">
                        ${detailsAction}
                        ${enrollAction}
                    </div>
                </div>
            </div>
        </article>`;
}

function openCoursePreview(event, courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;

    document.getElementById("previewModalTitle").textContent = course.title;
    document.getElementById("previewModalSubject").textContent = course.subject || "Не указан";
    document.getElementById("previewModalLevel").textContent = course.level || "Не указан";
    document.getElementById("previewModalDesc").textContent = course.desc || "Описание отсутствует";

    const lessonsList = document.getElementById("previewModalLessons");
    lessonsList.innerHTML = "";

    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach(lesson => {
            lessonsList.innerHTML += `<li class="list-group-item text-muted">
                <i class="bi bi-play-circle me-2"></i>${lesson.title}
            </li>`;
        });
    } else {
        lessonsList.innerHTML = `<li class="list-group-item text-muted">Уроки не добавлены</li>`;
    }

    const modal = new bootstrap.Modal(document.getElementById('coursePreviewModal'));
    modal.show();
}

async function handleEnroll(courseId) {
    const user = getUser();
    if (!user) {
        alert("Сначала войдите в аккаунт");
        return;
    }

    const course = allCourses.find(c => c.id === courseId);
    if (course && Number(course.price) > 0) {
        alert(`Этот курс платный (${course.price} ₽). Модуль оплаты временно недоступен.`);
        return;
    }

    try {
        const alreadyEnrolled = await isAlreadyEnrolled(user.id, courseId);
        if (alreadyEnrolled) {
            alert("Вы уже записаны на этот курс!");
            return;
        }

        await enrollCourse({
            userId: user.id,
            courseId: courseId,
            progress: 0,
            completed: false,
            enrolledAt: new Date().toISOString()
        });

        alert("Вы успешно записались на курс!\nПеренаправляем в личный кабинет...");
        window.location.href = "dashboard.html";
    } catch (err) {
        alert("Ошибка записи: " + (err.message || "Попробуйте позже"));
    }
}

function renderPagination(totalPages) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="prev">Назад</a>
        </li>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="next">Вперёд</a>
        </li>`;

    container.innerHTML = html;

    container.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", handlePaginationClick);
    });
}

function handlePaginationClick(e) {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    const total = Math.ceil(currentCourseList.length / coursesPerPage);

    if (page === "prev" && currentPage > 1) currentPage--;
    else if (page === "next" && currentPage < total) currentPage++;
    else if (!isNaN(page)) currentPage = Number(page);

    renderCourses(currentCourseList);
    document.getElementById("courseList").scrollIntoView({ behavior: "smooth" });
}

function initFilters() {
    const form = document.getElementById("filterForm");
    const resetBtn = document.getElementById("resetFiltersBtn");

    if (!form || !resetBtn) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        currentPage = 1;
        applyFilters();
    });

    resetBtn.addEventListener("click", () => {
        form.reset();
        currentPage = 1;
        renderCourses(allCourses);
    });
}

function applyFilters() {
    const search = document.getElementById("filter-search")?.value.trim().toLowerCase() || "";
    const subject = document.getElementById("filter-subject")?.value || "";
    const level = document.getElementById("filter-level")?.value || "";
    const maxPrice = Number(document.getElementById("filter-price")?.value) || Infinity;

    const filtered = allCourses.filter(course => {
        const matchSearch = !search ||
            (course.title + (course.desc || "")).toLowerCase().includes(search);
        const matchSubject = !subject || course.subject === subject;
        const matchLevel = !level || course.level === level;
        const matchPrice = (course.price || 0) <= maxPrice;

        return matchSearch && matchSubject && matchLevel && matchPrice;
    });

    renderCourses(filtered);
}