document.addEventListener('DOMContentLoaded', function() {
    initPopularCourses();
    updateNavigation();
});

async function initPopularCourses() {
    const container = document.getElementById('popularCourses');
    if (!container) return;

    try {
        const allCourses = await coursesAPI.getAllCourses();
        const popular = allCourses.slice(0, 3);
        
        container.innerHTML = popular.map(course => createCourseCard(course)).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-danger">Не удалось загрузить курсы</p>';
    }
}

function createCourseCard(course) {
    const discount = course.oldPrice 
        ? Math.round((1 - course.price / course.oldPrice) * 100) 
        : 0;

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card course-card h-100">
                <div class="position-relative">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}" style="height: 200px; object-fit: cover;">
                    ${discount > 0 ? `<span class="badge bg-danger position-absolute top-0 end-0 m-2">-${discount}%</span>` : ''}
                    <span class="badge bg-secondary position-absolute top-0 start-0 m-2">${course.levelName}</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <small class="text-muted mb-1">${course.subjectName}</small>
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">${course.description}</p>
                    
                    <div class="mb-2">
                        <i class="bi bi-person text-danger"></i> 
                        <small>${course.instructor}</small>
                    </div>
                    
                    <div class="mb-2">
                        <i class="bi bi-star-fill text-warning"></i> 
                        <strong>${course.rating}</strong> 
                        <small class="text-muted">(${course.reviews})</small>
                    </div>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                ${course.oldPrice ? `<small class="text-muted text-decoration-line-through">${course.oldPrice} ₽</small>` : ''}
                                <h5 class="text-danger mb-0 d-inline ms-2">${course.price} ₽</h5>
                            </div>
                            <a href="course-detail.html?id=${course.id}" class="btn btn-danger btn-sm">
                                Подробнее <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateNavigation() {
    const authLinks = document.getElementById('authLinks');
    if (!authLinks) return;

    if (typeof getCurrentUser === 'undefined') {
        setTimeout(updateNavigation, 500);
        return;
    }

    const user = getCurrentUser();

    if (user) {
        authLinks.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" 
                   id="userDropdown" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle" style="font-size: 1.2rem;"></i>
                    <span>${user.name}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><div class="dropdown-item-text"><small class="text-muted">Email:</small><br><strong>${user.email}</strong></div></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="user-dashboard.html"><i class="bi bi-person"></i> Личный кабинет</a></li>
                    <li><a class="dropdown-item" href="courses.html"><i class="bi bi-book"></i> Курсы</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="bi bi-box-arrow-right"></i> Выйти</a></li>
                </ul>
            </li>
        `;
    } else {
        authLinks.innerHTML = `
		<ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link btn btn-light text-primary ms-2 px-3" href="login.html">Вход</a></li>
            <li class="nav-item"><a class="nav-link btn btn-light text-primary ms-2 px-3" href="register.html">Регистрация</a></li>
		</ul>
        `;
    }
}

function searchCourses(query) {
    if (!query) return coursesData;
    
    const lowerQuery = query.toLowerCase();
    return coursesData.filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.instructor.toLowerCase().includes(lowerQuery)
    );
}

function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createCourseCard,
        searchCourses,
        showNotification,
        formatPrice,
        formatDate,
        scrollToElement
    };
}