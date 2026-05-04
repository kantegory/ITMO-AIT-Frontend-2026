(() => {
    const renderCourses = () => {
        const courses = window.store.getCreatedCourses();
        const students = courses.reduce((sum, course) => sum + course.students, 0);

        document.getElementById("statCoursesCount").textContent = courses.length;
        document.getElementById("statStudentsCount").textContent = students;
        document.getElementById("statRevenue").textContent = `${courses.reduce((sum, course) => sum + (course.students * course.price), 0)} ₽`;
        document.getElementById("emptyState").classList.toggle("d-none", courses.length > 0);
        document.getElementById("createdCoursesContainer").innerHTML = courses.map((course) => `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div class="card h-100">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}">
                    <div class="card-body">
                        <h3 class="h6 mb-2">${course.title}</h3>
                        <p class="small text-muted mb-1">${course.author}</p>
                        <p class="small mb-1">Рейтинг: <strong>${course.rating} / 5</strong></p>
                        <p class="small mb-1">Цена: <strong>${course.price} ₽</strong></p>
                        <p class="small mb-1">Учеников: <strong>${course.students}</strong></p>
                        <p class="small mb-3">Выручка: <strong>${course.students * course.price} ₽</strong></p>
                        <div class="d-flex gap-1">
                            <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-primary">Открыть</a>
                            <button type="button" class="btn btn-sm btn-outline-secondary"
                                    data-bs-toggle="modal" data-bs-target="#courseModal">
                                Редактировать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    };
    renderCourses();
})();
