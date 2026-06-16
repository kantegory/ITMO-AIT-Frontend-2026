document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));

    if (!courseId) {
        showCourseNotFound();
        return;
    }

    const course = coursesData.find(c => c.id === courseId);

    if (!course) {
        showCourseNotFound();
        return;
    }

    renderCourse(course);
    updateAuthLinks();
});

function showCourseNotFound() {
    document.getElementById('courseContent').innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 5rem;"></i>
            <h2 class="mt-4">Курс не найден</h2>
            <p class="text-muted">Такого курса не существует или он был удалён</p>
            <a href="courses.html" class="btn btn-danger mt-3">
                <i class="bi bi-arrow-left"></i> Вернуться к каталогу
            </a>
        </div>
    `;
}

function renderCourse(course) {
    const discount = course.oldPrice 
        ? Math.round((1 - course.price / course.oldPrice) * 100) 
        : 0;

    document.title = `${course.title} - OnlineLearning`;

    const html = `
        <div class="row">
            <div class="col-lg-8">
                <!-- Видео -->
                <div class="ratio ratio-16x9 mb-4 rounded overflow-hidden shadow">
                    <iframe src="https://www.youtube.com/embed/${course.videoId}" allowfullscreen></iframe>
                </div>

                <!-- Информация -->
                <h1 class="mb-3">${course.title}</h1>
                
                <div class="d-flex flex-wrap gap-3 mb-3">
                    <span class="text-muted">
                        <i class="bi bi-star-fill text-warning"></i> 
                        <strong>${course.rating}</strong> 
                        (${course.reviews} оценок)
                    </span>
                    <span class="text-muted">
                        <i class="bi bi-people"></i> 
                        ${course.students} студентов
                    </span>
                    <span class="text-muted">
                        <i class="bi bi-clock"></i> 
                        ${course.duration}
                    </span>
                    <span class="badge bg-danger">${course.levelName}</span>
                </div>

                <p class="lead text-muted">${course.description}</p>

                <!-- Вкладки -->
                <ul class="nav nav-tabs mt-4" id="courseTabs" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#whatYouLearn">
                            Чему вы научитесь
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#program">
                            Программа
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reviews">
                            Отзывы
                        </button>
                    </li>
                </ul>

                <div class="tab-content p-4 border border-top-0 bg-white">
                    <div class="tab-pane fade show active" id="whatYouLearn">
                        <ul class="list-unstyled">
                            ${course.whatYouLearn.map(item => `
                                <li class="py-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                    ${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="tab-pane fade" id="program">
                        <div class="accordion" id="courseProgram">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#lesson1">
                                        Раздел 1: Введение
                                    </button>
                                </h2>
                                <div id="lesson1" class="accordion-collapse collapse show" data-bs-parent="#courseProgram">
                                    <div class="accordion-body">
                                        <ul class="list-unstyled mb-0">
                                            <li class="py-2">
                                                <i class="bi bi-play-circle text-danger me-2"></i>
                                                Видео: Введение в курс (15 мин)
                                            </li>
                                            <li class="py-2">
                                                <i class="bi bi-file-text text-danger me-2"></i>
                                                Статья: Основные понятия
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#lesson2">
                                        Раздел 2: Основы
                                    </button>
                                </h2>
                                <div id="lesson2" class="accordion-collapse collapse" data-bs-parent="#courseProgram">
                                    <div class="accordion-body">
                                        <ul class="list-unstyled mb-0">
                                            <li class="py-2">
                                                <i class="bi bi-play-circle text-danger me-2"></i>
                                                Видео: Базовые концепции (30 мин)
                                            </li>
                                            <li class="py-2">
                                                <i class="bi bi-file-text text-danger me-2"></i>
                                                Практическое задание
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="reviews">
                        <div class="mb-4">
                            <h5>Оставить отзыв</h5>
                            <textarea class="form-control" rows="3" placeholder="Ваш отзыв..."></textarea>
                            <button class="btn btn-danger mt-2">Отправить</button>
                        </div>
                        
                        <div class="media mb-3">
                            <div class="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style="width: 50px; height: 50px;">
                                <i class="bi bi-person"></i>
                            </div>
                            <div class="media-body">
                                <h6 class="mt-0">Алексей П. <small class="text-muted">2 недели назад</small></h6>
                                <div class="text-warning mb-1">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                </div>
                                <p>Отличный курс! Всё понятно и структурировано.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Боковая панель -->
            <div class="col-lg-4">
                <div class="card sticky-top" style="top: 20px; z-index: 1;">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <div class="mb-3">
                            ${course.oldPrice ? `<span class="text-muted text-decoration-line-through h5">${course.oldPrice} ₽</span>` : ''}
                            <h2 class="text-danger d-inline ms-2">${course.price} ₽</h2>
                            ${discount > 0 ? `<span class="badge bg-danger ms-2">-${discount}%</span>` : ''}
                        </div>
                        
                        <button class="btn btn-danger w-100 mb-2 btn-lg">
                            <i class="bi bi-cart"></i> Купить курс
                        </button>
                        <button class="btn btn-outline-danger w-100 mb-3">
                            <i class="bi bi-heart"></i> В избранное
                        </button>
                        
                        <hr>
                        
                        <h6 class="mb-3">Включено в курс:</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <i class="bi bi-camera-video text-danger me-2"></i>
                                ${course.duration} видео
                            </li>
                            <li class="mb-2">
                                <i class="bi bi-file-earmark text-danger me-2"></i>
                                ${course.lessons} материалов
                            </li>
                            <li class="mb-2">
                                <i class="bi bi-infinity text-danger me-2"></i>
                                Доступ навсегда
                            </li>
                            <li class="mb-2">
                                <i class="bi bi-patch-check text-danger me-2"></i>
                                Сертификат
                            </li>
                            <li class="mb-2">
                                <i class="bi bi-phone text-danger me-2"></i>
                                Доступ с телефона
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('courseContent').innerHTML = html;
}