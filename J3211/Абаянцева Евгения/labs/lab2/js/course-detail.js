document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = parseInt(urlParams.get('id'));
    
    if (!courseId) {
        showCourseNotFound();
        return;
    }
    
    coursesAPI.getCourseById(courseId).then(course => {
        if (!course) {
            showCourseNotFound();
            return;
        }
        renderCourse(course);
        initFavoriteButton(courseId);
        initReviewForm(courseId);
        loadReviews(courseId);
    }).catch(error => {
        showCourseNotFound();
    });
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
    const discount = course.oldPrice ? Math.round((1 - course.price / course.oldPrice) * 100) : 0;
    document.title = `${course.title} - OnlineLearning`;

    const html = `
        <div class="row">
            <div class="col-lg-8">
                <div class="ratio ratio-16x9 mb-4 rounded overflow-hidden shadow">
                    <iframe src="https://www.youtube.com/embed/${course.videoId}" 
                            title="Видео: ${course.title}"
                            allowfullscreen
                            loading="lazy"
                            aria-label="Видео урок курса ${course.title}">
                    </iframe>
                </div>
                
                <h1 class="mb-3" id="courseTitle">${course.title}</h1>
                
                <div class="d-flex flex-wrap gap-3 mb-3" role="list" aria-label="Информация о курсе">
                    <span class="text-muted" role="listitem">
                        <i class="bi bi-star-fill text-warning" aria-hidden="true"></i> 
                        <strong>${course.rating}</strong> (${course.reviews} оценок)
                    </span>
                    <span class="text-muted" role="listitem">
                        <i class="bi bi-people" aria-hidden="true"></i> 
                        ${course.students} студентов
                    </span>
                    <span class="text-muted" role="listitem">
                        <i class="bi bi-clock" aria-hidden="true"></i> 
                        ${course.duration}
                    </span>
                    <span class="badge bg-danger">${course.levelName}</span>
                </div>
                
                <p class="lead text-muted" id="courseDescription">${course.description}</p>
                
                <ul class="nav nav-tabs mt-4" id="courseTabs" role="tablist" aria-label="Разделы курса">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" 
                                id="learn-tab"
                                data-bs-toggle="tab" 
                                data-bs-target="#whatYouLearn"
                                type="button"
                                role="tab"
                                aria-controls="whatYouLearn"
                                aria-selected="true">
                            Чему вы научитесь
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" 
                                id="program-tab"
                                data-bs-toggle="tab" 
                                data-bs-target="#program"
                                type="button"
                                role="tab"
                                aria-controls="program"
                                aria-selected="false">
                            Программа
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" 
                                id="reviews-tab"
                                data-bs-toggle="tab" 
                                data-bs-target="#reviews"
                                type="button"
                                role="tab"
                                aria-controls="reviews"
                                aria-selected="false">
                            Отзывы
                        </button>
                    </li>
                </ul>
                
                <div class="tab-content p-4 border border-top-0 bg-white">
                    <div class="tab-pane fade show active" 
                         id="whatYouLearn" 
                         role="tabpanel" 
                         aria-labelledby="learn-tab">
                        <ul class="list-unstyled" aria-label="Результаты обучения">
                            ${course.whatYouLearn.map(item => 
                                `<li class="py-2"><i class="bi bi-check-circle-fill text-success me-2" aria-hidden="true"></i>${item}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="tab-pane fade" 
                         id="program" 
                         role="tabpanel" 
                         aria-labelledby="program-tab">
                        <div class="accordion" id="courseProgram">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingOne">
                                    <button class="accordion-button" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#lesson1"
                                            aria-expanded="true"
                                            aria-controls="lesson1">
                                        Раздел 1: Введение
                                    </button>
                                </h2>
                                <div id="lesson1" 
                                     class="accordion-collapse collapse show" 
                                     aria-labelledby="headingOne"
                                     data-bs-parent="#courseProgram">
                                    <div class="accordion-body">
                                        <ul class="list-unstyled mb-0">
                                            <li class="py-2"><i class="bi bi-play-circle text-danger me-2" aria-hidden="true"></i>Видео: Введение в курс (15 мин)</li>
                                            <li class="py-2"><i class="bi bi-file-text text-danger me-2" aria-hidden="true"></i>Статья: Основные понятия</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingTwo">
                                    <button class="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#lesson2"
                                            aria-expanded="false"
                                            aria-controls="lesson2">
                                        Раздел 2: Основы
                                    </button>
                                </h2>
                                <div id="lesson2" 
                                     class="accordion-collapse collapse" 
                                     aria-labelledby="headingTwo"
                                     data-bs-parent="#courseProgram">
                                    <div class="accordion-body">
                                        <ul class="list-unstyled mb-0">
                                            <li class="py-2"><i class="bi bi-play-circle text-danger me-2" aria-hidden="true"></i>Видео: Базовые концепции (30 мин)</li>
                                            <li class="py-2"><i class="bi bi-file-text text-danger me-2" aria-hidden="true"></i>Практическое задание</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-pane fade" 
                         id="reviews" 
                         role="tabpanel" 
                         aria-labelledby="reviews-tab">
                        <div class="mb-4">
                            <h5 id="reviewFormTitle">Оставить отзыв</h5>
                            <form id="reviewForm" aria-labelledby="reviewFormTitle">
                                <div class="mb-3">
                                    <label class="form-label" for="reviewRating">Оценка</label>
                                    <select class="form-select" id="reviewRating" name="rating" required aria-required="true">
                                        <option value="5">★★★★★ Отлично</option>
                                        <option value="4">★★★★☆ Хорошо</option>
                                        <option value="3">★★★☆☆ Нормально</option>
                                        <option value="2">★★☆☆☆ Плохо</option>
                                        <option value="1">★☆☆☆☆ Ужасно</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="reviewComment">Ваш отзыв</label>
                                    <textarea class="form-control" id="reviewComment" name="comment" rows="3" placeholder="Расскажите о вашем опыте..." required aria-required="true"></textarea>
                                </div>
                                <button type="submit" class="btn btn-danger">
                                    <i class="bi bi-send" aria-hidden="true"></i> Отправить отзыв
                                </button>
                            </form>
                        </div>
                        
                        <hr>
                        
                        <h5 class="mb-3" id="reviewsHeading">Отзывы студентов</h5>
                        <div id="reviewsList" aria-labelledby="reviewsHeading" aria-live="polite">
                            <div class="text-center py-3">
                                <div class="spinner-border text-danger" role="status">
                                    <span class="visually-hidden">Загрузка отзывов...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <aside class="col-lg-4" aria-label="Информация о покупке">
                <div class="card sticky-top" style="top: 20px; z-index: 1;">
                    <img src="${course.image}" 
                         class="card-img-top" 
                         alt="${course.title} - обложка курса" 
                         style="height: 200px; object-fit: cover;"
                         loading="lazy">
                    <div class="card-body">
                        <div class="mb-3">
                            ${course.oldPrice ? `<span class="text-muted text-decoration-line-through h5">${course.oldPrice} ₽</span>` : ''}
                            <h2 class="text-danger d-inline ms-2" aria-label="Цена: ${course.price} рублей">${course.price} ₽</h2>
                            ${discount > 0 ? `<span class="badge bg-danger ms-2" aria-label="Скидка ${discount} процентов">-${discount}%</span>` : ''}
                        </div>
                        
                        <button class="btn btn-danger w-100 mb-2 btn-lg" aria-label="Купить курс ${course.title} за ${course.price} рублей">
                            <i class="bi bi-cart" aria-hidden="true"></i> Купить курс
                        </button>
                        <button id="favoriteBtn" 
                                class="btn btn-outline-danger w-100 mb-3"
                                aria-label="Добавить курс в избранное"
                                aria-pressed="false">
                            <i class="bi bi-heart" aria-hidden="true"></i> В избранное
                        </button>
                        
                        <hr>
                        
                        <h6 class="mb-3">Включено в курс:</h6>
                        <ul class="list-unstyled" aria-label="Состав курса">
                            <li class="mb-2"><i class="bi bi-camera-video text-danger me-2" aria-hidden="true"></i>${course.duration} видео</li>
                            <li class="mb-2"><i class="bi bi-file-earmark text-danger me-2" aria-hidden="true"></i>${course.lessons} материалов</li>
                            <li class="mb-2"><i class="bi bi-infinity text-danger me-2" aria-hidden="true"></i>Доступ навсегда</li>
                            <li class="mb-2"><i class="bi bi-patch-check text-danger me-2" aria-hidden="true"></i>Сертификат</li>
                            <li class="mb-2"><i class="bi bi-phone text-danger me-2" aria-hidden="true"></i>Доступ с телефона</li>
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    `;
    
    document.getElementById('courseContent').innerHTML = html;
    
    initFavoriteButtonAccessibility();
}

function initFavoriteButtonAccessibility() {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;
    
    btn.addEventListener('click', function() {
        const isFav = this.dataset.favorite === 'true';
        this.setAttribute('aria-pressed', !isFav);
        this.setAttribute('aria-label', !isFav ? 'Удалить из избранного' : 'Добавить в избранное');
    });
}

async function initFavoriteButton(courseId) {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;
    const user = getCurrentUser();
    if (!user) {
        btn.style.display = 'none';
        return;
    }
    try {
        const isFav = await favoritesAPI.isFavorite(user.id, courseId);
        updateFavoriteButton(isFav);
        btn.addEventListener('click', async function() {
            try {
                if (this.dataset.favorite === 'true') {
                    await favoritesAPI.removeFromFavorites(user.id, courseId);
                    updateFavoriteButton(false);
                    showNotification('Удалено из избранного', 'info');
                } else {
                    await favoritesAPI.addToFavorites(user.id, courseId);
                    updateFavoriteButton(true);
                    showNotification('Добавлено в избранное', 'success');
                }
            } catch (error) {
                showNotification('Ошибка: ' + error.message, 'danger');
            }
        });
    } catch (error) {
        console.error('Ошибка проверки избранного:', error);
    }
}

function updateFavoriteButton(isFavorite) {
    const btn = document.getElementById('favoriteBtn');
    if (!btn) return;
    if (isFavorite) {
        btn.innerHTML = '<i class="bi bi-heart-fill"></i> В избранном';
        btn.classList.remove('btn-outline-danger');
        btn.classList.add('btn-danger');
        btn.dataset.favorite = 'true';
    } else {
        btn.innerHTML = '<i class="bi bi-heart"></i> В избранное';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
        btn.dataset.favorite = 'false';
    }
}

function initReviewForm(courseId) {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
            showNotification('Сначала войдите в систему', 'warning');
            return;
        }
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewComment').value.trim();
        if (!comment) {
            showNotification('Введите текст отзыва', 'warning');
            return;
        }
        try {
            await reviewsAPI.addReview(user.id, user.name, courseId, rating, comment);
            showNotification('Отзыв добавлен!', 'success');
            form.reset();
            loadReviews(courseId);
        } catch (error) {
            showNotification('Ошибка: ' + error.message, 'danger');
        }
    });
}

async function loadReviews(courseId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    try {
        const reviews = await reviewsAPI.getCourseReviews(courseId);
        if (reviews.length === 0) {
            container.innerHTML = '<p class="text-muted">Пока нет отзывов. Будьте первым!</p>';
            return;
        }
        container.innerHTML = reviews.map(review => `
            <div class="media mb-4 p-3 border rounded">
                <div class="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px; flex-shrink: 0;">
                    <i class="bi bi-person"></i>
                </div>
                <div class="media-body flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mt-0 mb-1">${review.userName}</h6>
                            <div class="text-warning mb-2">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        </div>
                        <small class="text-muted">${new Date(review.createdAt).toLocaleDateString('ru-RU')}</small>
                    </div>
                    <p class="mb-2">${review.comment}</p>
                    <button class="btn btn-sm btn-outline-secondary" onclick="markReviewHelpful(${review.id})">
                        <i class="bi bi-hand-thumbs-up"></i> Полезно (${review.helpful})
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        container.innerHTML = '<p class="text-danger">Ошибка загрузки отзывов</p>';
    }
}

async function markReviewHelpful(reviewId) {
    try {
        await reviewsAPI.markHelpful(reviewId);
        loadReviews(new URLSearchParams(window.location.search).get('id'));
    } catch (error) {
        showNotification('Ошибка: ' + error.message, 'danger');
    }
}

function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}