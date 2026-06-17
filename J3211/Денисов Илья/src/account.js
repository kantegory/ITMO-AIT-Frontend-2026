import { getJSON, getCurrentUser } from './api.js';

const taskCardData = document.querySelector('#card-container');
const currentUser = getCurrentUser();

taskCardData.innerHTML = `
    <div class="alert alert-secondary w-100" role="status">
        Загрузка заявок...
    </div>
`;
taskCardData.setAttribute('aria-busy', 'true');

if (!currentUser) {
    window.location.href = 'enter.html';
}

function renderAccountCards(applications) {
    if (!applications.length) {
        taskCardData.innerHTML = `
            <div class="alert alert-secondary w-100" role="status">
                Вы пока ни на одну должность не записались.
            </div>
        `;
        return;
    }

    taskCardData.innerHTML = applications.map(application => `
        <article class="card application-card" style="width: 20rem;">
            <img src="${application.image}" class="card-img-top" alt="Иллюстрация к задаче: ${application.taskTitle}">
            <div class="card-body">
                <h2 class="h5 card-title">${application.taskTitle}</h2>
                <p class="mb-2"><strong>Роль:</strong> ${application.roleLabel}</p>
                <p class="mb-1"><strong>Статус задачи:</strong> ${application.status}</p>
                <p class="mb-1"><strong>Приоритет:</strong> ${application.priority}</p>
                <p class="mb-0"><strong>Постановщик:</strong> ${application.createdBy}</p>
            </div>
        </article>
    `).join('');
}

async function bootstrapAccountPage() {
    try {
        const applications = await getJSON('/applications', { userEmail: currentUser.email });
        renderAccountCards(applications);
    } catch (error) {
        console.error(error);
        taskCardData.innerHTML = `
            <div class="alert alert-danger w-100" role="alert">
                Не удалось загрузить заявки с JSON Server.
            </div>
        `;
    } finally {
        taskCardData.setAttribute('aria-busy', 'false');
    }
}

bootstrapAccountPage();
