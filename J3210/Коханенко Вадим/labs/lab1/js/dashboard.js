// Данные
let userNotes = [];
let userRoutes = [];
let currentUser = null;

async function loadUserData() {
    try {
        currentUser = api.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('userName').textContent = currentUser.name || 'путешественник';

        const allNotes = await api.authGet('/notes');
        userNotes = allNotes.filter(note => note.userId === currentUser.id);
        
        const allRoutes = await api.authGet('/routes');
        userRoutes = allRoutes.filter(route => route.userId === currentUser.id);
        
        updateUI();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Ошибка загрузки данных: ' + error.message);
    }
}

async function saveNote(note) {
    try {
        const newNote = {...note, userId: currentUser.id, id: Date.now().toString()};
        const savedNote = await api.authPost('/notes', newNote);
        return savedNote;
    } catch (error) {
        console.error('Ошибка сохранения заметки:', error);
        throw error;
    }
}

async function updateNoteInAPI(id, note) {
    try {
        const updatedNote = await api.authPut(`/notes/${id}`, note);
        return updatedNote;
    } catch (error) {
        console.error('Ошибка обновления заметки:', error);
        throw error;
    }
}

async function deleteNoteFromAPI(id) {
    try {
        await api.authDelete(`/notes/${id}`);
    } catch (error) {
        console.error('Ошибка удаления заметки:', error);
        throw error;
    }
}

async function saveRoute(route) {
    try {
        const newRoute = {...route, userId: currentUser.id, id: Date.now().toString(), savedAt: new Date().toISOString()};
        const savedRoute = await api.authPost('/routes', newRoute);
        return savedRoute;
    } catch (error) {
        console.error('Ошибка сохранения маршрута:', error);
        throw error;
    }
}

async function deleteRouteFromAPI(id) {
    try {
        await api.authDelete(`/routes/${id}`);
    } catch (error) {
        console.error('Ошибка удаления маршрута:', error);
        throw error;
    }
}

// Обновления счётчиков и заметок+маршрутов
function updateUI() {
    document.getElementById('notesCount').textContent = userNotes.length;
    document.getElementById('routesCount').textContent = userRoutes.length;
    const countries = [...new Set(userNotes.map(note => note.country).filter(Boolean))];
    document.getElementById('countriesCount').textContent = countries.length;
    
    renderNotes();
    renderRoutes();
}

// Всякие иконки и цвета
function getTypeIcon(type) {
    const icons = {
        'Город': 'bi-building',
        'Природа': 'bi-tree',
        'Смешанный': 'bi-arrow-repeat',
    };
    return icons[type] || 'bi-arrow-repeat';
}

// Отображение маршрутов
function renderRoutes() {
    const container = document.getElementById('routesContainer');
    
    if (userRoutes.length === 0) {
        container.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-map"></i>
                <h5>У вас пока нет сохранённых маршрутов</h5>
                <p class="text-muted">Найдите интересные направления в поиске!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    userRoutes.forEach((route) => {
        html += createRouteCard(route);
    });
    container.innerHTML = html;
}

// Отображение заметок
function renderNotes() {
    const container = document.getElementById('notesContainer');
    
    if (userNotes.length === 0) {
        container.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-journal-bookmark"></i>
                <h5>У вас пока нет заметок</h5>
                <p class="text-muted">Создайте первую заметку о ваших путешествиях!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    userNotes.forEach((note) => {
        html += createNoteCard(note);
    });
    container.innerHTML = html;
}

// Карточка маршрута
function createRouteCard(route) {
    return `
        <div class="col-lg-6">
            <div class="card route-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${route.title}</h5>
                        <span class="badge bg-success">${route.duration}</span>
                    </div>
                    <div class="route-duration mb-2">
                        <i class="bi bi-geo-alt"></i> ${route.points}
                    </div>
                    <p class="card-text">
                        ${route.description.substring(0, 250)}${route.description.length > 250 ? '…' : ''}
                        <a href="destination.html?id=${route.destinationId}" class="text-success text-decoration-none">
                                ${route.description.length > 250 ? '' : '…'}читать далее</a>
                    </p>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="badge bg-light text-dark me-1">
                                <i class="bi bi-tag"></i> ${route.budget} бюджет
                            </span>
                            <span class="badge bg-light text-dark me-1">
                                <i class="bi ${getTypeIcon(route.type)}"></i> ${route.type}
                            </span>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteRoute('${route.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Карточка заметки
function createNoteCard(note) {
    let tags = '';
    if (note.tags) {
        const tagArray = note.tags.split(/[\s,]+/).filter(t => t.trim());
        tagArray.forEach(tag => {
            tags += `<span class="badge bg-light text-dark me-1">${tag}</span>`;
        });
    }
    
    const safeNoteId = String(note.id).replace(/[^a-zA-Z0-9]/g, '');
    
    return `
        <div class="col-lg-4 col-md-6">
            <div class="card note-card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="badge-type">
                        <i class="bi ${getTypeIcon(note.type)}"></i> ${note.type}
                    </span>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editNote('${note.id}')" data-bs-toggle="modal" data-bs-target="#editNoteModal">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteNote('${note.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    ${note.date ? `<h6 class="card-subtitle mb-2 text-muted"><i class="bi bi-calendar3"></i> ${note.date}</h6>` : ''}
                    <p class="card-text">
                        ${note.content.substring(0, 100)}${note.content.length > 100 ? '…' : ''}
                        ${note.content.length > 100 ? 
                            `<a href="#" class="text-success text-decoration-none" data-bs-toggle="modal" data-bs-target="#noteModal${safeNoteId}">
                                читать далее</a>` : ''}
                    </p>
                    ${tags ? `<div class="mt-3">${tags}</div>` : ''}
                </div>
            </div>
        </div>
        
        <!-- Модалка: текст длинной заметки -->
        ${note.content.length > 100 ? `
        <div class="modal fade" id="noteModal${safeNoteId}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-journal-text"></i> ${note.title}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${note.date ? `<p class="text-muted"><i class="bi bi-calendar3"></i> ${note.date}</p>` : ''}
                        <p>${note.content}</p>
                        ${tags ? `<div class="mt-3">${tags}</div>` : ''}
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

// Удаление маршрута
async function deleteRoute(routeId) {
    if (confirm('Удалить этот маршрут?')) {
        try {
            await deleteRouteFromAPI(routeId);
            userRoutes = userRoutes.filter(r => r.id !== routeId);
            updateUI();
        } catch (error) {
            alert('Ошибка при удалении маршрута');
        }
    }
}

// Добавить заметку
async function addNote() {
    const title = document.getElementById('noteTitle').value;
    const date = document.getElementById('noteDate').value;
    const type = document.getElementById('noteType').value;
    const country = document.getElementById('noteCountry').value;
    const content = document.getElementById('noteContent').value;
    const tags = document.getElementById('noteTags').value;
    
    if (!title || !content || !country) {
        alert('Заполните обязательные поля: заголовок, страна, текст заметки');
        return;
    }
    
    try {
        const newNote = await saveNote({title, date, type, country, content, tags});
        userNotes.unshift(newNote);
        updateUI();

        document.getElementById('addNoteForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addNoteModal'));
        modal.hide();
    } catch (error) {
        alert('Ошибка при сохранении заметки');
    }
}

// Удалить заметку
async function deleteNote(noteId) {
    if (confirm('Удалить эту заметку?')) {
        try {
            await deleteNoteFromAPI(noteId);
            userNotes = userNotes.filter(n => String(n.id) !== String(noteId));
            updateUI();
        } catch (error) {
            alert('Ошибка при удалении заметки');
        }
    }
}

// Отредачить заметку
function editNote(noteId) {
    const note = userNotes.find(n => String(n.id) === String(noteId));
    if (!note) return;
    
    window.editingNoteId = noteId;
    
    document.getElementById('editNoteTitle').value = note.title || '';
    document.getElementById('editNoteDate').value = note.date || '';
    document.getElementById('editNoteType').value = note.type || 'Смешанный';
    document.getElementById('editNoteCountry').value = note.country || '';
    document.getElementById('editNoteContent').value = note.content || '';
    document.getElementById('editNoteTags').value = note.tags || '';
}

// Обновление заметки
async function updateNote() {
    const title = document.getElementById('editNoteTitle').value;
    const date = document.getElementById('editNoteDate').value;
    const type = document.getElementById('editNoteType').value;
    const country = document.getElementById('editNoteCountry').value;
    const content = document.getElementById('editNoteContent').value;
    const tags = document.getElementById('editNoteTags').value;
    
    if (!title || !content || !country) {
        alert('Заполните обязательные поля: заголовок, страна, текст заметки');
        return;
    }
    
    try {
        const noteIndex = userNotes.findIndex(n => n.id === window.editingNoteId);
        if (noteIndex === -1) return;
        
        const updatedNote = {
            ...userNotes[noteIndex],
            title, date, type, country, content, tags
        };
        
        await updateNoteInAPI(window.editingNoteId, updatedNote);
        userNotes[noteIndex] = updatedNote;
        updateUI();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
        modal.hide();
        delete window.editingNoteId;
    } catch (error) {
        alert('Ошибка при обновлении заметки');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    
    document.getElementById('addNoteModal').addEventListener('show.bs.modal', function() {
        document.getElementById('addNoteForm').reset();
    });

    document.getElementById('editNoteModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('editNoteForm').reset();
    });
});