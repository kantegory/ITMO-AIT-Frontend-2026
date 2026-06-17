import { apiRequest } from './api.js';
import { getCurrentUser } from './auth-service.js';

export async function initProfilePage() {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const boxes = document.querySelectorAll('.profile-box');
    if (boxes.length < 3) return;

    try {
        const profiles = await apiRequest(`/profiles?userId=${user.id}`);
        const profile = profiles[0];

        boxes[0].innerHTML = `
            <h2>Пользователь</h2>
            <p>Имя: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Статус: Студент</p>
        `;

        if (profile?.courses) {
            boxes[1].innerHTML = `
                <h2>Мои курсы</h2>
                <div class="cards">
                    ${profile.courses.map(course => `
                        <article class="card">
                            <h3>${course.title}</h3>
                            <p>Курс доступен в личном кабинете.</p>
                        </article>
                    `).join('')}
                </div>
            `;
        }

        if (profile?.progress) {
            boxes[2].innerHTML = `
                <h2>Прогресс</h2>
                ${profile.progress.map(item => `
                    <p class="progress-label">${item.courseTitle}</p>
                    <div
                        class="progress-bar"
                        role="progressbar"
                        aria-label="Прогресс по курсу ${item.courseTitle}"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="${item.value}"
                    >
                        <div class="progress" style="width: ${item.value}%;">${item.value}%</div>
                    </div>
                `).join('')}
            `;
        }
    } catch (error) {
        console.error(error);
    }
}
