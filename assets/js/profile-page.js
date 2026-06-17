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
            <h3>Пользователь</h3>
            <p>Имя: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Статус: Студент</p>
        `;

        if (profile?.courses) {
            boxes[1].innerHTML = `
                <h3>Мои курсы</h3>
                <div class="cards">
                    ${profile.courses.map(course => `
                        <div class="card">
                            <h3>${course.title}</h3>
                            <p>Курс доступен в личном кабинете.</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (profile?.progress) {
            boxes[2].innerHTML = `
                <h3>Прогресс</h3>
                ${profile.progress.map(item => `
                    <p style="margin-top: 15px;">${item.courseTitle}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${item.value}%;">${item.value}%</div>
                    </div>
                `).join('')}
            `;
        }
    } catch (error) {
        console.error(error);
    }
}