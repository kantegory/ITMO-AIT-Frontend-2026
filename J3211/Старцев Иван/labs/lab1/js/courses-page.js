(() => {
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

    const filterCourses = () => {
        const query = document.getElementById("searchInput").value.trim().toLowerCase();
        const filters = readFilters(window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile");

        return window.store.getCourses().filter((course) =>
            (!query || course.title.toLowerCase().includes(query)) &&
            (filters.level === "any" || course.level === filters.level) &&
            (filters.language === "any" || course.language === filters.language) &&
            (filters.minPrice === null || course.price >= filters.minPrice) &&
            (filters.maxPrice === null || course.price <= filters.maxPrice)
        );

    };

    const render = () => {
        const filteredCourses = filterCourses();

        document.getElementById("emptyState").classList.toggle("d-none", filteredCourses.length > 0);
        document.getElementById("coursesContainer").innerHTML = filteredCourses.map((course) => `
            <div class="col-12 col-sm-6 col-xl-4">
                <div class="card h-100">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text text-muted small mb-2">${course.description}</p>
                        <p class="card-text mb-1"><strong>Автор:</strong> ${course.author}</p>
                        <p class="card-text mb-1"><strong>Уровень:</strong> ${course.level}</p>
                        <p class="card-text mb-1"><strong>Язык:</strong> ${course.language}</p>
                        <p class="card-text mb-1"><i class="bi bi-star-fill text-warning"></i> ${course.rating} / 5</p>
                        <p class="card-text mb-3"><i class="bi bi-people-fill"></i> ${course.students} участников</p>
                        <div class="mt-auto">
                            <span class="badge bg-primary fs-6">${course.price} ₽</span>
                            <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-primary ms-2">Подробнее</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
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

    render();
})();
