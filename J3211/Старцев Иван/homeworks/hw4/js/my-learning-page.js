import api from "./api.js";
import auth from "./auth.js";

(() => {
    const emptyState = document.getElementById("emptyState");
    let learningCourses = [];

    const getCourseRating = (course) => {
        if (!course.comments.length) {
            return 0;
        }
        const total = course.comments.reduce((sum, comment) => sum + comment.rating, 0);
        return total / course.comments.length;
    };

    const render = () => {
        const filteredCourses = learningCourses.filter((course) => course.title.toLowerCase().includes(document.getElementById("searchInput").value.trim().toLowerCase()));

        emptyState.classList.toggle("d-none", filteredCourses.length > 0);
        document.getElementById("learningCoursesContainer").innerHTML = filteredCourses.map((course) => `
            <li class="col-12 col-md-6 col-xl-4">
                <article class="card h-100">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}">
                    <div class="card-body d-flex flex-column">
                        <h2 class="card-title">${course.title}</h2>
                        <p class="card-text text-muted small mb-1">${course.description}</p>
                        <p class="card-text mb-2">
                            <svg class="rating__star" aria-hidden="true">
                              <use href="./sprites.svg#ratingStar"></use>
                            </svg>
                            ${getCourseRating(course).toFixed(1)} / 5
                        </p>
                        <div class="mt-auto">
                            <a href="lesson.html?id=${course.id}" class="btn btn-success btn-sm">Продолжить</a>
                            <a href="course.html?id=${course.id}" class="btn btn-outline-primary btn-sm ms-1">О курсе</a>
                        </div>
                    </div>
                </article>
            </li>
        `).join("");
    };

    const init = async () => {
        const user = await auth.requireAuth();
        if (!user) {return;}
        const courses = await api.getCourses();
        learningCourses = courses.filter((course) => user.learningCourseIds.includes(course.id));
        render();
    };

    document.getElementById("searchForm").addEventListener("submit", (event) => {
        event.preventDefault();
        render();
    });
    init().catch(() => {
        emptyState.className = "alert alert-danger";
        emptyState.textContent = "Не удалось загрузить информацию.";
    });
})();
