export function setMessage(element, text, type) {
    element.textContent = text;
    element.classList.remove('is-error', 'is-success');

    if (type) {
        element.classList.add(type);
    }
}

export function updateAuthView(elements, state) {
    const isLoggedIn = Boolean(state.token);

    elements.loginLink.classList.toggle('d-none', isLoggedIn);
    elements.registerLink.classList.toggle('d-none', isLoggedIn);
    elements.logoutButton.classList.toggle('d-none', !isLoggedIn);

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
        <article class="col-md-4">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="h5">Проекты аннотации</h2>
                    <p class="display-6 mb-0">${projects.length}</p>
                </div>
            </div>
        </article>

        <article class="col-md-4">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="h5">Среднее качество</h2>
                    <p class="display-6 mb-0">${getAverageQuality(projects)}%</p>
                </div>
            </div>
        </article>

        <article class="col-md-4">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="h5">Задания в работе</h2>
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
        projectList.innerHTML = '<div class="col-12"><div class="empty-state">Проекты не найдены.</div></div>';
        return;
    }

    projectList.innerHTML = projects.map((project) => `
        <article class="col-md-6 col-xl-4">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <span class="badge mb-2 align-self-start">${project.statusText}</span>
                    <h2 class="h5">${project.title}</h2>
                    <p class="muted-text">${project.description}</p>
                    <ul class="list-unstyled small muted-text">
                        <li>Тип: ${project.typeText}</li>
                        <li>Исполнитель: ${project.workerText}</li>
                        <li>Качество: ${project.quality}%</li>
                    </ul>
                    <a class="btn btn-sm btn-outline-primary mt-auto align-self-start" href="#" data-page-link="task">Открыть задачу</a>
                </div>
            </div>
        </article>
    `).join('');

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
            <td>${worker.name}</td>
            <td>${worker.role}</td>
            <td>${worker.tasks}</td>
            <td>${worker.quality}%</td>
        </tr>
    `).join('');
}

export function renderTask(taskCard, instructionText, tasks) {
    const task = tasks[0];

    if (!task) {
        taskCard.innerHTML = '<p class="muted-text mb-0">Задача не найдена.</p>';
        return;
    }

    instructionText.textContent = task.instruction;

    taskCard.innerHTML = `
        <h2 class="h5">${task.title}</h2>
        <p class="muted-text mb-2">Тип файла: ${task.fileType}. Статус: ${task.status}.</p>
        <div class="annotation-viewer my-3">
            <div class="annotation-box">${task.className}</div>
            <div class="annotation-box annotation-box-small">sign</div>
        </div>
        <button class="btn btn-primary align-self-start" type="button" data-bs-toggle="modal" data-bs-target="#instructionModal">
            Открыть инструкцию
        </button>
    `;
}

export function showApiError(elements) {
    elements.summaryList.innerHTML = '<li class="py-2 muted-text">Запустите JSON-server командой npm start.</li>';
    elements.projectList.innerHTML = '<div class="col-12"><div class="empty-state">Нет соединения с API.</div></div>';
    elements.workerList.innerHTML = '<tr><td colspan="4">Нет соединения с API.</td></tr>';
}
