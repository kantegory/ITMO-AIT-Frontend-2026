(() => {
    const render = () => {
        const filteredCourses = window.store.getLearningCourses().filter((course) => course.title.toLowerCase().includes(document.getElementById("searchInput").value.trim().toLowerCase()));

        document.getElementById("emptyState").classList.toggle("d-none", filteredCourses.length > 0);
        document.getElementById("learningCoursesContainer").innerHTML = filteredCourses.map((course) => `
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card h-100">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text text-muted small">${course.description}</p>
                        <p class="card-text mb-2"><i class="bi bi-star-fill text-warning"></i> ${course.rating} / 5</p>
                        <div class="mt-auto">
                            <a href="lesson.html?id=${course.id}" class="btn btn-success btn-sm">Продолжить</a>
                            <a href="course.html?id=${course.id}" class="btn btn-outline-primary btn-sm ms-1">О курсе</a>
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

    render();
})();
