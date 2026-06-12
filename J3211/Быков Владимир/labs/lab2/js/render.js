function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (symbol) => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return entities[symbol];
    });
}

export function setMessage(element, text, type) {
    element.textContent = text;
    element.classList.remove('is-error', 'is-success');

    if (type) {
        element.classList.add(type);
    }

    element.setAttribute('role', type === 'is-error' ? 'alert' : 'status');
}

export function updateAuthView(elements, state) {
    const isLoggedIn = Boolean(state.token);

    elements.loginLink.classList.toggle('d-none', isLoggedIn);
    elements.registerLink.classList.toggle('d-none', isLoggedIn);
    elements.logoutButton.classList.toggle('d-none', !isLoggedIn);

    elements.loginLink.setAttribute('aria-hidden', String(isLoggedIn));
    elements.registerLink.setAttribute('aria-hidden', String(isLoggedIn));
    elements.logoutButton.setAttribute('aria-hidden', String(!isLoggedIn));

    elements.userInfo.textContent = state.user
        ? `${state.user.name || state.user.email}, роль: ${state.user.role || 'Пользователь'}`
        : 'Для просмотра данных выполните вход.';
}

function getAverageQuality(projects) {
    if (!projects.length) {
        return 0;
    }

    const sum = projects.reduce((result, project) => result + project.quality, 0);
    return Math.round(sum / projects.length);
}

function getActiveTasks(projects) {
    return projects
        .filter((project) => project.status !== 'done')
        .reduce((sum, project) => sum + (project.itemsTotal - project.itemsDone), 0);
}

export function renderSummary(summaryList, projects) {
    const totalProjects = projects.length;
    const totalItems = projects.reduce((sum, project) => sum + project.itemsTotal, 0);
    const doneItems = projects.reduce((sum, project) => sum + project.itemsDone, 0);

    summaryList.innerHTML = `
        <li class="d-flex justify-content-between py-2 border-bottom"><span>Проекты</span><strong>${totalProjects}</strong></li>
        <li class="d-flex justify-content-between py-2 border-bottom"><span>Объекты</span><strong>${totalItems}</strong></li>
        <li class="d-flex justify-content-between py-2 border-bottom"><span>Размечено</span><strong>${doneItems}</strong></li>
        <li class="d-flex justify-content-between py-2"><span>Среднее качество</span><strong>${getAverageQuality(projects)}%</strong></li>
    `;
}

export function renderDashboard(dashboardStats, projects) {
    dashboardStats.innerHTML = `
        <article class="col-md-4" aria-labelledby="projectsStatTitle">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="h5" id="projectsStatTitle">Проекты аннотации</h2>
                    <p class="display-6 mb-0">${projects.length}</p>
                </div>
            </div>
        </article>

        <article class="col-md-4" aria-labelledby="qualityStatTitle">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="h5" id="qualityStatTitle">Среднее качество</h2>
                    <p class="display-6 mb-0">${getAverageQuality(projects)}%</p>
                </div>
            </div>
        </article>

        <article class="col-md-4" aria-labelledby="tasksStatTitle">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="h5" id="tasksStatTitle">Задания в работе</h2>
                    <p class="display-6 mb-0">${getActiveTasks(projects)}</p>
                </div>
            </div>
        </article>
    `;
}

function isFilterMatched(item, filterName, filterValue) {
    return filterValue === 'all' || item[filterName] === filterValue;
}

export function getFilteredProjects(projects, filters) {
    return projects.filter((project) => {
        return isFilterMatched(project, 'status', filters.status)
            && isFilterMatched(project, 'type', filters.type)
            && isFilterMatched(project, 'worker', filters.worker);
    });
}

export function renderProjects(projectList, projects, showPage) {
    if (!projects.length) {
        projectList.innerHTML = '<div class="col-12"><div class="empty-state" role="status">Проекты не найдены.</div></div>';
        return;
    }

    projectList.innerHTML = projects.map((project) => {
        const title = escapeHtml(project.title);
        const description = escapeHtml(project.description);
        const statusText = escapeHtml(project.statusText);
        const typeText = escapeHtml(project.typeText);
        const workerText = escapeHtml(project.workerText);
        const projectTitleId = `project-${project.id}-title`;
        const projectDescriptionId = `project-${project.id}-description`;
        const projectMetaId = `project-${project.id}-meta`;

        return `
            <article class="col-md-6 col-xl-4" aria-labelledby="${projectTitleId}" aria-describedby="${projectDescriptionId} ${projectMetaId}">
                <div class="card h-100">
                    <div class="card-body d-flex flex-column">
                        <span class="badge mb-2 align-self-start"><span class="visually-hidden">Статус проекта: </span>${statusText}</span>
                        <h2 class="h5" id="${projectTitleId}">${title}</h2>
                        <p class="muted-text" id="${projectDescriptionId}">${description}</p>
                        <ul class="list-unstyled small muted-text" id="${projectMetaId}">
                            <li>Тип: ${typeText}</li>
                            <li>Исполнитель: ${workerText}</li>
                            <li>Качество: ${project.quality}%</li>
                        </ul>
                        <a class="btn btn-sm btn-outline-primary mt-auto align-self-start" href="#task"
                            data-page-link="task" aria-label="Открыть задачу проекта ${title}">
                            <svg class="icon" aria-hidden="true" focusable="false">
                                <use href="assets/icons.svg#icon-open"></use>
                            </svg>
                            <span>Открыть задачу</span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    projectList.querySelectorAll('[data-page-link]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showPage(link.dataset.pageLink);
        });
    });
}

export function renderWorkers(workerList, workers) {
    workerList.innerHTML = workers.map((worker) => `
        <tr>
            <th scope="row">${escapeHtml(worker.name)}</th>
            <td>${escapeHtml(worker.role)}</td>
            <td>${worker.tasks}</td>
            <td>${worker.quality}%</td>
        </tr>
    `).join('');
}

export function renderTask(taskCard, instructionText, tasks) {
    const task = tasks[0];

    if (!task) {
        taskCard.innerHTML = '<p class="muted-text mb-0" role="status">Задача не найдена.</p>';
        return;
    }

    const title = escapeHtml(task.title);
    const fileType = escapeHtml(task.fileType);
    const status = escapeHtml(task.status);
    const className = escapeHtml(task.className);

    instructionText.textContent = task.instruction;

    taskCard.innerHTML = `
        <h2 class="h5" id="currentTaskTitle">${title}</h2>
        <p class="muted-text mb-2" id="currentTaskMeta">Тип файла: ${fileType}. Статус: ${status}.</p>
        <div class="annotation-viewer my-3" role="img"
             aria-label="Макет изображения для разметки: выделен объект класса ${className} и дорожный знак.">
            <div class="annotation-box" aria-hidden="true">${className}</div>
            <div class="annotation-box annotation-box-small" aria-hidden="true">sign</div>
        </div>
        <button class="btn btn-primary align-self-start" type="button" data-bs-toggle="modal"
                data-bs-target="#instructionModal" aria-haspopup="dialog" aria-controls="instructionModal">
            <svg class="icon" aria-hidden="true" focusable="false">
                <use href="assets/icons.svg#icon-info"></use>
            </svg>
            <span>Открыть инструкцию</span>
        </button>
    `;
}

export function showApiError(elements) {
    elements.summaryList.innerHTML = '<li class="py-2 muted-text" role="status">Запустите JSON-server командой npm start.</li>';
    elements.projectList.innerHTML = '<div class="col-12"><div class="empty-state" role="alert">Нет соединения с API.</div></div>';
    elements.workerList.innerHTML = '<tr><td colspan="4" role="alert">Нет соединения с API.</td></tr>';
}