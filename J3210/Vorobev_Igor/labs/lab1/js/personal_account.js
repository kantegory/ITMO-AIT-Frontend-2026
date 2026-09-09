const user = JSON.parse(localStorage.getItem('user'));
if (!user) { window.location.href = 'index.html'; }

const projects = window.PROJECTS || [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userName').textContent = user.name;
    renderProjects(projects);
    setupFilters();
    setupLogout();
});

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('filterStatus');
    const priorityFilter = document.getElementById('filterPriority');
    const assigneeFilter = document.getElementById('filterAssignee');

    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const status = statusFilter.value;
        const priority = priorityFilter.value;
        const assignee = assigneeFilter.value;

        const filtered = projects.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(query);
            const matchStatus = !status || p.status === status;
            const matchPriority = !priority || p.priority === priority;
            const matchAssignee = !assignee || p.team.includes(assignee);
            return matchSearch && matchStatus && matchPriority && matchAssignee;
        });

        renderProjects(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
    assigneeFilter.addEventListener('change', applyFilters);
    window.applyFilters = applyFilters;
}

function renderProjects(data) {
    const container = document.getElementById('projects-container');
    
    if (data.length === 0) {
        container.innerHTML = '<p class="text-muted w-100 text-center mt-5">Проекты не найдены</p>';
        return;
    }

    container.innerHTML = data.map(p => {
        const isJoined = p.userRole !== null;
        
        const badge = isJoined 
            ? `<span class="badge">${getRoleLabel(p.userRole)}</span>`
            : `<span class="badge badge-secondary">Не в команде</span>`;

        const btnClass = 'btn-outline-black';
        const btnText = isJoined ? 'Открыть' : 'Вступить';
        const btnAction = isJoined ? `openProject(${p.id})` : `joinProject(${p.id})`;

        return `
        <div class="card" style="width: 18rem; height: 160px; min-height: 160px;">
            <div class="card-body d-flex flex-column p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">${p.name}</h6>
                    ${badge}
                </div>
                
                <!-- Только статус и приоритет -->
                <div class="d-flex gap-2 mb-3">
                    <span class="badge">${getStatus(p.status)}</span>
                    <span class="badge">${getPriority(p.priority)}</span>
                </div>

                <button class="btn ${btnClass} w-100 mt-auto" onclick="${btnAction}">
                    ${btnText}
                </button>
            </div>
        </div>`;
    }).join('');
}

window.joinProject = function(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        project.userRole = 'observer';
        if (!project.team.includes(user.name)) {
            project.team.push(user.name);
        }
        window.applyFilters();
    }
};

window.openProject = function(id) {
    window.location.href = `project.html?id=${id}`;
};

function setupLogout() {
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

function getStatus(s) { return { new: 'Новый', progress: 'В работе', done: 'Завершён' }[s]; }
function getPriority(p) { return { high: 'Высокий', medium: 'Средний', low: 'Низкий' }[p]; }
function getRoleLabel(r) { return { admin: 'Администратор', member: 'Участник', observer: 'Наблюдатель' }[r]; }