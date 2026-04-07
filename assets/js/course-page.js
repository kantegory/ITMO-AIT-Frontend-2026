import { apiRequest } from './api.js';

export async function initCoursePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return;

    try {
        const course = await apiRequest(`/courses/${id}`);

        const title = document.querySelector('.section-title');
        if (title) {
            title.textContent = course.title;
        }

        const boxes = document.querySelectorAll('.profile-box');

        if (boxes[0]) {
            boxes[0].innerHTML = `
                <p><strong>Преподаватель:</strong> ${course.teacher}</p>
                <p><strong>Уровень:</strong> ${course.level}</p>
                <p><strong>Длительность:</strong> ${course.duration}</p>
                <p><strong>Описание:</strong> ${course.description}</p>
                <a href="login.html" class="btn">Записаться</a>
            `;
        }

        if (boxes[1]) {
            boxes[1].innerHTML = `
                <h2>Программа курса</h2>
                <ol class="course-program">
                    <li>Введение в тему</li>
                    <li>Базовые понятия</li>
                    <li>Практические задания</li>
                    <li>Итоговая работа</li>
                </ol>
            `;
        }
    } catch (error) {
        console.error(error);
    }
}
