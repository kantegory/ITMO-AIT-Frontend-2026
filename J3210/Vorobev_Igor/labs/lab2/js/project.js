import { getJSON, postJSON, getCurrentUser, clearCurrentUser, API_BASE_URL } from './api.js';

const user = getCurrentUser();
if (!user) { window.location.href = 'index.html'; }

const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get('id')) || 1;

let currentProject = {};
let files = [];
let comments = [];

const headerProjectName = document.getElementById('headerProjectName');
const projTitle = document.getElementById('projTitle');
const projDesc = document.getElementById('projDesc');
const projDeadline = document.getElementById('projDeadline');
const projStatus = document.getElementById('projStatus');
const teamList = document.getElementById('teamList');
const filesList = document.getElementById('filesList');
const commentsList = document.getElementById('commentsList');

document.addEventListener('DOMContentLoaded', async () => {
    await loadProject(projectId);
    renderFiles();
    renderComments();
    setupTabs();
    setupActions();
    setupLogout();
    setupAdminPanel();
});

async function loadProject(id) {
    try {
        currentProject = await getJSON(`/projects/${id}`);
        
        files = await getJSON('/files', { projectId: id });
        comments = await getJSON('/comments', { projectId: id });
        
        headerProjectName.textContent = currentProject.name;
        projTitle.textContent = currentProject.name;
        projDesc.textContent = currentProject.description || 'Описание не указано';
        projDeadline.textContent = currentProject.deadline || '--.--.----';
        projStatus.textContent = currentProject.status;
        
        renderTeam();
    } catch (err) {
        console.error('Ошибка загрузки проекта', err);
    }
}

function renderTeam() {
    const team = currentProject.teamDetails || [];
    const isAdmin = currentProject.userRole === 'Администратор';

    teamList.innerHTML = team.map(m => {
        const key = m.email || `${m.name} ${m.surname}`;
        
        return `
        <div class="team-member">
            <div>
                <span class="fw-bold">${m.name} ${m.surname || ''}</span>
                ${m.email ? `<br><small class="text-muted" style="font-size:11px">${m.email}</small>` : ''}
                <span class="badge ms-2">${m.role}</span>
            </div>
            ${isAdmin && m.role !== 'Администратор' ? `
            <div class="dropdown">
                <button class="btn btn-sm btn-link p-0 text-dark" type="button" data-bs-toggle="dropdown">⋮</button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" onclick="window.changeRole('${currentProject.id}', '${key}', 'Участник')">Сделать Участником</a></li>
                    <li><a class="dropdown-item" href="#" onclick="window.changeRole('${currentProject.id}', '${key}', 'Наблюдатель')">Сделать Наблюдателем</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="window.removeMember('${currentProject.id}', '${key}')">Удалить</a></li>
                </ul>
            </div>
            ` : ''}
        </div>`;
    }).join('');
}

function setupAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    const btnInvite = document.getElementById('btnInvite');
    
    if (!adminPanel) return;
    
    const isAdmin = currentProject.userRole === 'Администратор';
    adminPanel.style.display = isAdmin ? 'block' : 'none';
    
    if (isAdmin && btnInvite) {
        btnInvite.onclick = () => addMember(currentProject.id);
    }
}

async function addMember(projectId) {
    const emailInput = document.getElementById('inviteEmail');
    const targetEmail = emailInput?.value.trim();
    
    if (!targetEmail) return alert('Введите Email');
    
    const users = await getJSON('/users', { email: targetEmail });
    if (users.length === 0) return alert('Пользователь с таким Email не найден в системе');
    
    const targetUser = users[0];
    
    const project = await getJSON(`/projects/${projectId}`);
    
    if (project.teamDetails?.some(m => m.email === targetUser.email)) {
        return alert('Этот пользователь уже в команде');
    }
    
    if (!project.teamDetails) project.teamDetails = [];
    project.teamDetails.push({
        name: targetUser.name,
        surname: targetUser.surname,
        email: targetUser.email,
        role: 'Участник'
    });
    
    const fullName = `${targetUser.name} ${targetUser.surname}`;
    if (!project.team) project.team = [];
    if (!project.team.includes(fullName)) project.team.push(fullName);
    
    await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    });
    
    emailInput.value = '';
    location.reload();
}

window.changeRole = async function(projectId, memberKey, newRole) {
    const project = await getJSON(`/projects/${projectId}`);
    
    const member = project.teamDetails?.find(m => 
        (m.email && m.email === memberKey) || 
        (!m.email && `${m.name} ${m.surname}` === memberKey)
    );
    
    if (member) {
        member.role = newRole;
        await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });
        location.reload();
    }
};

window.removeMember = async function(projectId, memberKey) {
    if (!confirm('Удалить участника из проекта?')) return;
    
    const project = await getJSON(`/projects/${projectId}`);
    
    const member = project.teamDetails?.find(m => 
        (m.email && m.email === memberKey) || 
        (!m.email && `${m.name} ${m.surname}` === memberKey)
    );
    
    if (member) {
        project.teamDetails = project.teamDetails.filter(m => 
            (m.email && m.email !== memberKey) || 
            (!m.email && `${m.name} ${m.surname}` !== memberKey)
        );
        
        const fullName = `${member.name} ${member.surname}`;
        project.team = (project.team || []).filter(n => n !== fullName);
        
        await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });
        location.reload();
    }
};

function renderFiles() {
    if (files.length === 0) {
        filesList.innerHTML = '<p class="text-muted">Нет загруженных файлов</p>';
        return;
    }
    filesList.innerHTML = files.map(f => `
        <div class="file-item">
            <div class="file-info">
                <span class="file-icon"></span>
                <div>
                    <div class="fw-bold">${f.name}</div>
                    <small class="text-muted">${f.size} • ${f.date}</small>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-black" onclick="window.deleteFile(${f.id})">Удалить</button>
        </div>
    `).join('');
}

window.deleteFile = async function(id) {
    if (!confirm('Удалить этот файл?')) return;
    try {
        await fetch(`${API_BASE_URL}/files/${id}`, { method: 'DELETE' });
        files = files.filter(f => f.id !== id);
        renderFiles();
    } catch (err) {
        console.error('Ошибка удаления', err);
    }
};

function renderComments() {
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-muted text-center mt-5">Нет комментариев</p>';
        return;
    }
    commentsList.innerHTML = comments.map(c => `
        <div class="comment-item">
            <div class="comment-meta">
                <span>${c.author || c.user}</span>
                <span class="comment-time">${c.time}</span>
            </div>
            <div>${c.text}</div>
        </div>
    `).join('');
    commentsList.scrollTop = commentsList.scrollHeight;
}

function setupTabs() {
    document.querySelectorAll('.pos-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.pos-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetId = tab.dataset.target;
            document.getElementById('filesTab').style.display = targetId === 'filesTab' ? 'block' : 'none';
            document.getElementById('commentsTab').style.display = targetId === 'commentsTab' ? 'block' : 'none';
        });
    });
}

function setupActions() {
    document.getElementById('sendComment').addEventListener('click', async () => {
        const input = document.getElementById('commentInput');
        const text = input.value.trim();
        if (!text) return;

        const newComment = {
            projectId,
            author: user.name || user.email,
            text: text,
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };

        try {
            const saved = await postJSON('/comments', newComment);
            comments.push(saved);
            renderComments();
            input.value = '';
        } catch (err) {
            alert('Ошибка отправки');
        }
    });

    document.getElementById('uploadFileBtn').addEventListener('click', async () => {
        const fileName = prompt('Введите название файла:');
        if (!fileName) return;

        const newFile = {
            projectId,
            name: fileName,
            size: '1.0 MB',
            date: new Date().toLocaleDateString('ru-RU')
        };

        try {
            const saved = await postJSON('/files', newFile);
            files.unshift(saved);
            renderFiles();
        } catch (err) {
            alert('Ошибка загрузки');
        }
    });
}

function setupLogout() {
    document.getElementById('btnLogout').addEventListener('click', () => {
        clearCurrentUser();
        window.location.href = 'index.html';
    });
}