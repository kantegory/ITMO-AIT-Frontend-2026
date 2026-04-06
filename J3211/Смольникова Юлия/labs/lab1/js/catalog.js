let currentPage = 1;
const coursesPerPage = 6;
let currentCourseList = [];

function renderCourses(list = getAllCourses()) {
    currentCourseList = list;

    const container = document.getElementById("courseList");
    const paginationContainer = document.getElementById("paginationContainer");

    container.innerHTML = "";

    if (currentCourseList.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card text-center p-4">
                    <div class="empty-state-icon mb-2">🔎</div>
                    <h4 class="mb-2">Курсы не найдены</h4>
                    <p class="text-muted mb-0">Попробуйте изменить параметры поиска.</p>
                </div>
            </div>
        `;
        paginationContainer.innerHTML = "";
        return;
    }

    const totalPages = Math.max(1, Math.ceil(currentCourseList.length / coursesPerPage));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const paginatedList = currentCourseList.slice(startIndex, endIndex);

    paginatedList.forEach(course => {
        container.insertAdjacentHTML("beforeend", createCourseCard(course));
    });

    renderPagination();
}

function createCourseCard(course) {
    const priceText = Number(course.price) > 0 ? `${course.price} ₽` : "Бесплатно";

    return `
        <div class="col-md-6 col-xl-4">
            <div class="card course-card h-100">
                <div class="card-category-bar"></div>

                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge badge-subject">${course.subject || "Без категории"}</span>
                        <span class="badge badge-price">${priceText}</span>
                    </div>

                    <h5 class="card-title">${course.title}</h5>

                    <p class="course-description">
                        ${course.desc || "Описание курса пока не добавлено."}
                    </p>

                    <div class="course-actions">
                        <a href="course.html?id=${course.id}" class="btn btn-outline-custom btn-sm">
                            Подробнее
                        </a>
                        <a href="course.html?id=${course.id}" class="btn btn-primary-custom btn-sm">
                            Открыть курс
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPagination() {
    const container = document.getElementById("paginationContainer");
    container.innerHTML = "";

    const totalPages = Math.ceil(currentCourseList.length / coursesPerPage);

    if (totalPages <= 1) return;

    const prevDisabled = currentPage === 1 ? "disabled" : "";
    container.innerHTML += `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="#" data-page="prev" tabindex="-1">Назад</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? "active" : "";
        container.innerHTML += `
            <li class="page-item ${active}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    const nextDisabled = currentPage === totalPages ? "disabled" : "";
    container.innerHTML += `
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" data-page="next">Вперёд</a>
        </li>
    `;

    container.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", handlePaginationClick);
    });
}

function handlePaginationClick(event) {
    event.preventDefault();

    const page = event.currentTarget.dataset.page;
    const totalPages = Math.ceil(currentCourseList.length / coursesPerPage);

    if (page === "prev" && currentPage > 1) {
        currentPage -= 1;
    } else if (page === "next" && currentPage < totalPages) {
        currentPage += 1;
    } else if (!Number.isNaN(Number(page))) {
        currentPage = Number(page);
    }

    renderCourses(currentCourseList);

    document.getElementById("courseList").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function initFilters() {
    const form = document.getElementById("filterForm");
    const resetBtn = document.getElementById("resetFiltersBtn");

    form.addEventListener("submit", event => {
        event.preventDefault();
        currentPage = 1;
        applyFilters();
    });

    resetBtn.addEventListener("click", () => {
        form.reset();
        currentPage = 1;
        renderCourses(getAllCourses());
    });
}

function getFilterValues() {
    return {
        search: document.getElementById("filter-search").value.trim().toLowerCase(),
        subject: document.getElementById("filter-subject").value,
        level: document.getElementById("filter-level").value,
        maxPrice: getMaxPriceValue()
    };
}

function getMaxPriceValue() {
    const priceValue = document.getElementById("filter-price").value;
    return priceValue ? Number(priceValue) : Infinity;
}

function applyFilters() {
    const filters = getFilterValues();

    const filtered = getAllCourses().filter(course => {
        const title = (course.title || "").toLowerCase();
        const desc = (course.desc || "").toLowerCase();

        const matchSearch =
            !filters.search ||
            title.includes(filters.search) ||
            desc.includes(filters.search);

        const matchSubject =
            !filters.subject || course.subject === filters.subject;

        const matchLevel =
            !filters.level || course.level === filters.level;

        const matchPrice =
            Number(course.price || 0) <= filters.maxPrice;

        return matchSearch && matchSubject && matchLevel && matchPrice;
    });

    renderCourses(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    renderCourses();
    initFilters();
});