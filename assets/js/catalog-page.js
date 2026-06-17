import { apiRequest } from './api.js';

function createCourseCard(course) {
    return `
        <div class="card">
            <h3>${course.title}</h3>
            <p>Уровень: ${course.level}</p>
            <p>Цена: ${course.price}</p>
            <a href="course.html?id=${course.id}" class="btn">Подробнее</a>
        </div>
    `;
}

export async function initCatalogPage() {
    const courseList = document.querySelector('.course-list');
    if (!courseList) return;

    const searchInput = document.querySelector('#search');
    const levelSelect = document.querySelector('#level');

    try {
        const courses = await apiRequest('/courses');
        renderCourses(courses);

        function renderCourses(items) {
            courseList.innerHTML = items.map(createCourseCard).join('');
        }

        function applyFilters() {
            let filtered = [...courses];

            const searchValue = searchInput?.value.trim().toLowerCase() || '';
            const levelValue = levelSelect?.value || 'Все';

            if (searchValue) {
                filtered = filtered.filter(course =>
                    course.title.toLowerCase().includes(searchValue)
                );
            }

            if (levelValue !== 'Все') {
                filtered = filtered.filter(course => course.level === levelValue);
            }

            renderCourses(filtered);
        }

        searchInput?.addEventListener('input', applyFilters);
        levelSelect?.addEventListener('change', applyFilters);
    } catch (error) {
        console.error(error);
        courseList.innerHTML = '<p>Не удалось загрузить курсы.</p>';
    }
}