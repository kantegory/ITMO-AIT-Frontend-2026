let filteredCourses = [];
const coursesPerPage = 6;
let currentPage = 1;


document.addEventListener('DOMContentLoaded', async function() {
    try {
        filteredCourses = await coursesAPI.getAllCourses();
        renderCourses(filteredCourses);
    } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
    }
    initFilters();
    initSort();
    updateAuthLinks();
});

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
                        <small class="text-muted">(${course.reviews} отзывов)</small>
                    </div>
                    
                    <div class="mb-2">
                        <i class="bi bi-people text-danger"></i> 
                        <small>${course.students} студентов</small>
                    </div>
                    
                    <div class="mb-2">
                        <i class="bi bi-clock text-danger"></i> 
                        <small>${course.duration}</small>
                    </div>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                ${course.oldPrice ? `<small class="text-muted text-decoration-line-through">${course.oldPrice} ₽</small>` : ''}
                                <h4 class="text-danger mb-0 d-inline ms-2">${course.price} ₽</h4>
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

function renderCourses(courses, page = 1) {
    const container = document.getElementById('coursesList');
    if (!container) return;

    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const coursesToShow = courses.slice(startIndex, endIndex);

    if (coursesToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search" style="font-size: 4rem; color: #ccc;"></i>
                <h4 class="mt-3 text-muted">Курсы не найдены</h4>
                <p class="text-muted">Попробуйте изменить параметры фильтра</p>
            </div>
        `;
    } else {
        container.innerHTML = coursesToShow.map(course => createCourseCard(course)).join('');
    }

    const countElement = document.getElementById('coursesCount');
    if (countElement) {
        countElement.textContent = courses.length;
    }

    renderPagination(courses.length, page);
}

function renderPagination(totalCourses, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalCourses / coursesPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;

    pagination.innerHTML = html;

    pagination.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.dataset.page);
            currentPage = page;
            renderCourses(filteredCourses, page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function initFilters() {
    const filterForm = document.getElementById('filterForm');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const resetButton = document.getElementById('resetFilters');

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value;
        });
    }

    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            document.getElementById('subjectFilter').value = '';
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.getElementById('priceRange').value = 15000;
            document.getElementById('priceValue').textContent = '15000';
            filteredCourses = [...coursesData];
            currentPage = 1;
            renderCourses(filteredCourses);
        });
    }
}

async function applyFilters() {
    const subject = document.getElementById('subjectFilter').value;
    const levels = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(cb => cb.value);
    const maxPrice = parseInt(document.getElementById('priceRange').value);

    try {
        filteredCourses = await coursesAPI.filterCourses({
            subject: subject || null,
            level: levels.length > 0 ? levels : null,
            maxPrice: maxPrice
        });
        
        currentPage = 1;
        renderCourses(filteredCourses);
    } catch (error) {
        console.error('Ошибка фильтрации:', error);
    }
}

function initSort() {
    const sortSelect = document.getElementById('sortCourses');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortCourses(this.value);
        });
    }
}

function sortCourses(criteria) {
    switch(criteria) {
        case 'price-asc':
            filteredCourses.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredCourses.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredCourses.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
        default:
            filteredCourses.sort((a, b) => b.students - a.students);
    }
    currentPage = 1;
    renderCourses(filteredCourses);
}

function updateAuthLinks() {
    const authLinks = document.getElementById('authLinks');
    if (!authLinks) {
        console.error('authLinks не найден!');
        return;
    }

    if (typeof getCurrentUser === 'undefined') {
        setTimeout(updateAuthLinks, 500);
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