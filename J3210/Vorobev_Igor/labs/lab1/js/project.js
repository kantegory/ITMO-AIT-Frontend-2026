const user = JSON.parse(localStorage.getItem('user'));
if (!user) { window.location.href = 'index.html'; }

const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get('id')) || 1;

const projectsList = window.PROJECTS || [];
const projectDetails = window.PROJECT_DETAILS || {};
let files = [...(window.MOCK_FILES || [])];
let comments = [...(window.MOCK_COMMENTS || [])];

const currentProject = projectsList.find(p => p.id === projectId) || projectsList[0];
const details = projectDetails[projectId] || {};

const headerProjectName = document.getElementById('headerProjectName');
const projTitle = document.getElementById('projTitle');
const projDesc = document.getElementById('projDesc');
const projDeadline = document.getElementById('projDeadline');
const projStatus = document.getElementById('projStatus');
const teamList = document.getElementById('teamList');
const filesList = document.getElementById('filesList');
const commentsList = document.getElementById('commentsList');

document.addEventListener('DOMContentLoaded', () => {
    loadProject(projectId);
    renderFiles();
    renderComments();
    setupTabs();
    setupActions();
    setupLogout();
});

function loadProject(id) {
    headerProjectName.textContent = currentProject.name;
    projTitle.textContent = currentProject.name;
    projDesc.textContent = details.description || 'Описание не указано';
    projDeadline.textContent = details.deadline || '--.--.----';
    projStatus.textContent = getStatus(currentProject.status);
    
    teamList.innerHTML = (details.team || []).map(m => `
        <div class="team-member">
            <span class="fw-bold">${m.name}</span>
            <span class="badge">${m.role}</span>
        </div>
    `).join('');
}

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
            <button class="btn btn-sm btn-outline-black" onclick="deleteFile(${f.id})">Удалить</button>
        </div>
    `).join('');
}

function deleteFile(id) {
    if (confirm('Удалить этот файл?')) {
        files = files.filter(f => f.id !== id);
        renderFiles();
    }
}

function renderComments() {
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-muted text-center mt-5">Нет комментариев</p>';
        return;
    }
    commentsList.innerHTML = comments.map(c => `
        <div class="comment-item">
            <div class="comment-meta">
                <span>${c.user}</span>
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
    document.getElementById('sendComment').addEventListener('click', () => {
        const input = document.getElementById('commentInput');
        const text = input.value.trim();
        if (text) {
            comments.push({
                id: Date.now(),
                user: user.name,
                text: text,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
            });
            renderComments();
            input.value = '';
        }
    });

    document.getElementById('uploadFileBtn').addEventListener('click', () => {
        const fileName = prompt('Введите название файла (симуляция):');
        if (fileName) {
            files.unshift({
                id: Date.now(),
                name: fileName,
                size: '1.0 MB',
                date: new Date().toLocaleDateString('ru-RU')
            });
            renderFiles();
        }
    });
}

function setupLogout() {
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

function getStatus(s) { return { new: 'Новый', progress: 'В работе', done: 'Завершён' }[s]; }