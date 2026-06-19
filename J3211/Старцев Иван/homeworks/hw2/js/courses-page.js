(() => {
    const emptyState = document.getElementById("emptyState");
    let courses = [];
    let users = [];

    const getCourseRating = (course) => {
        if (!course.comments.length) {
            return 0;
        }
        const total = course.comments.reduce((sum, comment) => sum + comment.rating, 0);
        return total / course.comments.length;
    };

    const getCourseStudents = (courseId) => users.filter((user) => user.learningCourseIds.includes(courseId)).length;

    const getAuthorName = (course) => {
        const user = users.find((item) => item.id === course.userId);
        return user ? user.name : "Неизвестный автор";
    };

    const readFilters = (prefix) => {
        const minPrice = document.getElementById(`${prefix}MinPrice`).value;
        const maxPrice = document.getElementById(`${prefix}MaxPrice`).value;
        return {
            level: document.getElementById(`${prefix}Level`).value,
            minPrice: minPrice === "" ? null : Number(minPrice),
            maxPrice: maxPrice === "" ? null : Number(maxPrice),
            language: document.getElementById(`${prefix}Language`).value
        };
    };

    const render = () => {
        const query = document.getElementById("searchInput").value.trim().toLowerCase();
        const filters = readFilters(window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile");

        const filteredCourses = courses.filter((course) =>
            (!query || course.title.toLowerCase().includes(query)) &&
            (filters.level === "any" || course.level === filters.level) &&
            (filters.language === "any" || course.language === filters.language) &&
            (filters.minPrice === null || course.price >= filters.minPrice) &&
            (filters.maxPrice === null || course.price <= filters.maxPrice)
        );

        emptyState.className = filteredCourses.length ? "alert alert-secondary d-none" : "alert alert-secondary";
        document.getElementById("coursesContainer").innerHTML = filteredCourses.map((course) => `
            <li class="col-12 col-sm-6 col-xl-4">
                <article class="card h-100">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}">
                    <div class="card-body d-flex flex-column">
                        <h2 class="h5 card-title">${course.title}</h2>
                        <p class="card-text text-muted small mb-2">${course.description}</p>
                        <p class="card-text mb-1"><strong>Автор:</strong> ${getAuthorName(course)}</p>
                        <p class="card-text mb-1"><strong>Уровень:</strong> ${course.level}</p>
                        <p class="card-text mb-1"><strong>Язык:</strong> ${course.language}</p>
                        <p class="card-text mb-1"><i class="bi bi-star-fill rating-star" aria-hidden="true"></i> ${getCourseRating(course).toFixed(1)} / 5</p>
                        <p class="card-text mb-3"><i class="bi bi-people-fill" aria-hidden="true"></i> ${getCourseStudents(course.id)} участников</p>
                        <div class="mt-auto">
                            <span class="badge bg-primary fs-6">${course.price} ₽</span>
                            <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-primary ms-2">Подробнее</a>
                        </div>
                    </div>
                </article>
            </li>
        `).join("");
    };

    const init = async () => {
        try {
            courses =await window.api.getCourses();
            users = await window.api.getUsers();
            render();
        } catch {
            emptyState.className = "alert alert-secondary";
            emptyState.textContent = "Не удалось загрузить курсы.";
        }
    };

    document.getElementById("searchForm").addEventListener("submit", (event) => {
        event.preventDefault();
        render();
    });

    document.getElementById("desktopApplyBtn").addEventListener("click", () => {
        render();
    });

    document.getElementById("mobileApplyBtn").addEventListener("click", () => {
        render();
    });

    window.matchMedia("(min-width: 768px)").addEventListener("change", render);

    init();
})();
