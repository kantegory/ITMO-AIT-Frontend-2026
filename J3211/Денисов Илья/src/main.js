import { getJSON, postJSON, getCurrentUser } from './api.js';

const taskCardData = document.querySelector('#card-container');
const sortSelect = document.querySelector('#favourites-sort');
const statusFilter = document.querySelector('#status-filter');
const prioritetFilter = document.querySelector('#prioritet-filter');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#search');
const modalTitle = document.querySelector('#taskModalTitle');
const modalBody = document.querySelector('#taskModalBody');
const accountLinks = document.querySelectorAll('a[href="account.html"]');
const modalElement = document.querySelector('#taskModal');
const taskModal = new bootstrap.Modal(modalElement);

const currentUser = getCurrentUser();

if (!currentUser) {
    window.location.href = 'enter.html';
}

let tasks = [];
let applications = [];
let pendingApplicationPromise = null;

function setCardsBusy(isBusy) {
    taskCardData.setAttribute('aria-busy', String(isBusy));
}

function renderTaskCards(taskList) {
    if (!taskList.length) {
        taskCardData.innerHTML = `
            <div class="alert alert-secondary w-100" role="status">
                По вашему запросу задачи не найдены.
            </div>
        `;
        return;
    }

    taskCardData.innerHTML = taskList.map(task => `
        <article class="card task-card" style="width: 18rem;">
            <button
                type="button"
                class="task-card-button"
                data-task-id="${task.id}"
                aria-label="Открыть задачу ${task.title}. Статус: ${task.status}. Приоритет: ${task.priority}. Постановщик: ${task.createdBy.name}."
            >
                <img src="${task.image}" class="card-img-top" alt="Иллюстрация к задаче: ${task.title}">
                <div class="card-body">
                    <h2 class="h4 card-title">${task.title}</h2>
                    <p class="card-title mb-1"><span class="fw-semibold">Статус:</span> ${task.status}</p>
                    <p class="card-title mb-1"><span class="fw-semibold">Приоритет:</span> ${task.priority}</p>
                    <p class="card-title mb-0"><span class="fw-semibold">Постановщик:</span> ${task.createdBy.name}</p>
                </div>
            </button>
        </article>
    `).join('');
}

function sortTasks(taskList, value) {
    const copiedTasks = [...taskList];

    if (value === 'az') {
        copiedTasks.sort((a, b) => a.createdBy.name.localeCompare(b.createdBy.name));
    }

    if (value === 'za') {
        copiedTasks.sort((a, b) => b.createdBy.name.localeCompare(a.createdBy.name));
    }

    return copiedTasks;
}

function filterTasksByStatus(taskList, statusValue) {
    if (statusValue === 'all') {
        return taskList;
    }

    return taskList.filter(task => task.status === statusValue);
}

function filterTaskByPrioritet(taskList, prioritetValue) {
    if (prioritetValue === 'all') {
        return taskList;
    }

    return taskList.filter(task => task.priority === prioritetValue);
}

function filterBySearch(taskList, query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return taskList;
    }

    return taskList.filter(task =>
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery) ||
        task.createdBy.name.toLowerCase().includes(normalizedQuery)
    );
}

function updateCards() {
    let result = [...tasks];

    result = filterTasksByStatus(result, statusFilter.value);
    result = filterTaskByPrioritet(result, prioritetFilter.value);
    result = filterBySearch(result, searchInput.value);
    result = sortTasks(result, sortSelect.value);

    renderTaskCards(result);
}

function createOpenPositionsHtml(task) {
    if (!task.openPositions?.length) {
        return `<p class="text-muted mb-0">Свободных мест нет</p>`;
    }

    return task.openPositions.map((position, index) => {
        const alreadyApplied = applications.some(application =>
            Number(application.taskId) === Number(task.id) && application.roleLabel === position.roleLabel
        );

        return `
            <div class="border rounded-3 p-2 mb-2 d-flex justify-content-between align-items-center gap-2 theme-surface-muted">
                <span>${position.roleLabel}</span>
                <button
                    class="btn btn-sm ${alreadyApplied ? 'btn-success' : 'btn-primary'} apply-position-btn"
                    data-task-id="${task.id}"
                    data-position-index="${index}"
                    aria-label="${alreadyApplied ? 'Вы уже записаны на роль' : 'Записаться на роль'} ${position.roleLabel}"
                    ${alreadyApplied ? 'disabled' : ''}
                >
                    ${alreadyApplied ? 'Вы записаны' : 'Записаться'}
                </button>
            </div>
        `;
    }).join('');
}

function fillTaskModal(task) {
    modalTitle.textContent = task.title;

    const participantsHtml = task.participants.length
        ? task.participants.map(user => `
            <div class="d-flex align-items-center gap-2 mb-2">
                <img
                    src="${user.avatar}"
                    alt="Аватар пользователя ${user.name}"
                    class="rounded-circle"
                    width="40"
                    height="40"
                    style="object-fit: cover;"
                >
                <div>
                    <div class="fw-semibold">${user.name}</div>
                    <div class="text-muted small">${user.roleLabel}</div>
                </div>
            </div>
        `).join('')
        : `<p class="text-muted mb-0">Участников пока нет</p>`;

    const filesHtml = task.files.length
        ? task.files.map(file => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${file.name}</span>
                <span class="badge text-bg-secondary">${file.size}</span>
            </li>
        `).join('')
        : `<p class="text-muted mb-0">Файлы не прикреплены</p>`;

    const commentsHtml = task.comments.length
        ? task.comments.map(comment => `
            <div class="border rounded-3 p-3 mb-2 theme-comment-box">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${comment.author}</strong>
                    <span class="text-muted small">${comment.createdAt}</span>
                </div>
                <div>${comment.text}</div>
            </div>
        `).join('')
        : `<p class="text-muted mb-0">Комментариев пока нет</p>`;

    const openPositionsHtml = createOpenPositionsHtml(task);

    modalBody.innerHTML = `
        <div class="container-fluid px-0">
            <div class="mb-4">
                <img
                    src="${task.image}"
                    alt="Иллюстрация к задаче ${task.title}"
                    class="img-fluid rounded-4 w-100"
                    style="max-height: 280px; object-fit: cover;"
                >
            </div>

            <div class="d-flex flex-wrap gap-2 mb-3" aria-label="Основные параметры задачи">
                <span class="badge text-bg-primary px-3 py-2">Статус: ${task.status}</span>
                <span class="badge text-bg-warning px-3 py-2">Приоритет: ${task.priority}</span>
                <span class="badge text-bg-dark px-3 py-2">Срок: ${task.deadline}</span>
            </div>

            <section class="card border-0 theme-surface-muted rounded-4 mb-4" aria-labelledby="task-general-info-title">
                <div class="card-body">
                    <h3 class="h6 text-uppercase text-muted mb-3" id="task-general-info-title">Общая информация</h3>
                    <p class="mb-2"><strong>Постановщик:</strong> ${task.createdBy.name}</p>
                    <p class="mb-0"><strong>Роль:</strong> ${task.createdBy.roleLabel}</p>
                </div>
            </section>

            <section class="mb-4" aria-labelledby="task-description-title">
                <h3 class="h5 mb-3" id="task-description-title">Описание</h3>
                <p class="mb-0">${task.description}</p>
            </section>

            <section class="mb-4" aria-labelledby="task-participants-title">
                <h3 class="h5 mb-3" id="task-participants-title">Участники</h3>
                ${participantsHtml}
            </section>

            <section class="mb-4" aria-labelledby="task-open-positions-title">
                <h3 class="h5 mb-3" id="task-open-positions-title">Свободные должности</h3>
                ${openPositionsHtml}
            </section>

            <section class="mb-4" aria-labelledby="task-files-title">
                <h3 class="h5 mb-3" id="task-files-title">Файлы</h3>
                ${task.files.length ? `<ul class="list-group list-group-flush">${filesHtml}</ul>` : filesHtml}
            </section>

            <section aria-labelledby="task-comments-title">
                <h3 class="h5 mb-3" id="task-comments-title">Комментарии</h3>
                ${commentsHtml}
            </section>
        </div>
    `;
}

async function applyToPosition(taskId, positionIndex) {
    const currentTask = tasks.find(task => Number(task.id) === Number(taskId));

    if (!currentTask || !currentTask.openPositions?.[positionIndex]) {
        return false;
    }

    const selectedPosition = currentTask.openPositions[positionIndex];
    const applicationExists = applications.some(application =>
        Number(application.taskId) === Number(currentTask.id) && application.roleLabel === selectedPosition.roleLabel
    );

    if (applicationExists) {
        return false;
    }

    const requestPromise = postJSON('/applications', {
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        roleLabel: selectedPosition.roleLabel,
        status: currentTask.status,
        priority: currentTask.priority,
        image: currentTask.image,
        createdBy: currentTask.createdBy.name,
        userEmail: currentUser.email,
        userName: `${currentUser.name} ${currentUser.surname}`
    });

    pendingApplicationPromise = requestPromise;

    try {
        const createdApplication = await requestPromise;
        applications.push(createdApplication);
        fillTaskModal(currentTask);
        return true;
    } catch (error) {
        console.error(error);
        alert('Не удалось сохранить заявку через API');
        return false;
    } finally {
        if (pendingApplicationPromise === requestPromise) {
            pendingApplicationPromise = null;
        }
    }
}

async function bootstrapPage() {
    setCardsBusy(true);

    try {
        tasks = await getJSON('/tasks');
        applications = await getJSON('/applications', { userEmail: currentUser.email });
        updateCards();
    } catch (error) {
        console.error(error);
        taskCardData.innerHTML = `
            <div class="alert alert-danger w-100" role="alert">
                Не удалось загрузить данные с JSON Server.
            </div>
        `;
    } finally {
        setCardsBusy(false);
    }
}

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateCards();
});

searchInput.addEventListener('input', updateCards);
sortSelect.addEventListener('change', updateCards);
statusFilter.addEventListener('change', updateCards);
prioritetFilter.addEventListener('change', updateCards);

taskCardData.addEventListener('click', function (event) {
    const button = event.target.closest('.task-card-button');
    if (!button) return;

    const taskId = Number(button.dataset.taskId);
    const currentTask = tasks.find(task => Number(task.id) === taskId);

    if (!currentTask) return;

    fillTaskModal(currentTask);
    taskModal.show();
});

modalBody.addEventListener('click', async function (event) {
    const applyButton = event.target.closest('.apply-position-btn');

    if (!applyButton || applyButton.disabled) {
        return;
    }

    applyButton.disabled = true;
    const appliedSuccessfully = await applyToPosition(
        applyButton.dataset.taskId,
        Number(applyButton.dataset.positionIndex)
    );

    if (!appliedSuccessfully) {
        applyButton.disabled = false;
    }
});

accountLinks.forEach(function (link) {
    link.addEventListener('click', async function (event) {
        if (!pendingApplicationPromise) {
            return;
        }

        event.preventDefault();
        link.classList.add('disabled');
        link.setAttribute('aria-disabled', 'true');

        try {
            await pendingApplicationPromise;
        } finally {
            window.location.href = link.getAttribute('href');
        }
    });
});

bootstrapPage();
