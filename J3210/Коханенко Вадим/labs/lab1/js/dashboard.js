// Данные
let userNotes = [];
let userRoutes = [];

function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const savedNotes = localStorage.getItem(`travelNotes_${currentUser.email}`);
    const savedRoutes = localStorage.getItem(`travelRoutes_${currentUser.email}`);
    
    if (savedNotes) {
        userNotes = JSON.parse(savedNotes);
    }
    if (savedRoutes) {
        userRoutes = JSON.parse(savedRoutes);
    }

    if (currentUser.name) {
        
        document.getElementById('userName').textContent = currentUser.name;
    }
    
    updateUI();
}

function saveUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.setItem(`travelNotes_${currentUser.email}`, JSON.stringify(userNotes));
    localStorage.setItem(`travelRoutes_${currentUser.email}`, JSON.stringify(userRoutes));
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
    userRoutes.forEach((route, index) => {
        html += createRouteCard(route, index);
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
    userNotes.forEach((note, index) => {
        html += createNoteCard(note, index);
    });
    container.innerHTML = html;
}

// Карточка маршрута
function createRouteCard(route, index) {
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
                        <a href="destination.html?id=${route.id}" class="text-success text-decoration-none">
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
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteRoute(${index})">
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
function createNoteCard(note, index) {
    let tags = '';
    if (note.tags) {
        const tagArray = note.tags.split(/[\s,]+/).filter(t => t.trim());
        tagArray.forEach(tag => {
            tags += `<span class="badge bg-light text-dark me-1">${tag}</span>`;
        });
    }
    
    return `
        <div class="col-lg-4 col-md-6">
            <div class="card note-card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="badge-type">
                        <i class="bi ${getTypeIcon(note.type)}"></i> ${note.type}
                    </span>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editNote(${index})" data-bs-toggle="modal" data-bs-target="#editNoteModal">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteNote(${index})">
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
                            `<a href="#" class="text-success text-decoration-none" data-bs-toggle="modal" data-bs-target="#noteModal${index}">
                                читать далее</a>` : ''}
                    </p>
                    ${tags ? `<div class="mt-3">${tags}</div>` : ''}
                </div>
            </div>
        </div>
        
        <!-- Модалка: текст длинной заметки -->
        ${note.content.length > 100 ? `
        <div class="modal fade" id="noteModal${index}" tabindex="-1">
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
function deleteRoute(index) {
    if (confirm('Удалить этот маршрут?')) {
        userRoutes.splice(index, 1);
        saveUserData();
        updateUI();
    }
}

// Добавить заметку
function addNote() {
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
    
    const newNote = {title, date, type, country, content, tags};
    userNotes.unshift(newNote);
    saveUserData();
    updateUI();

    document.getElementById('addNoteForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addNoteModal'));
    modal.hide();
}

// Удалить заметку
function deleteNote(index) {
    if (confirm('Удалить эту заметку?')) {
        userNotes.splice(index, 1);
        saveUserData();
        updateUI();
    }
}

// Отредачить заметку
function editNote(index) {
    window.editingNoteIndex = index;
    const note = userNotes[index];
    
    document.getElementById('editNoteTitle').value = note.title || '';
    document.getElementById('editNoteDate').value = note.date || '';
    document.getElementById('editNoteType').value = note.type || 'Смешанный';
    document.getElementById('editNoteCountry').value = note.country || '';
    document.getElementById('editNoteContent').value = note.content || '';
    document.getElementById('editNoteTags').value = note.tags || '';
}

// Обновление заметки
function updateNote() {
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
    
    userNotes[window.editingNoteIndex] = {
        ...userNotes[window.editingNoteIndex],
        title, date, type, country, content, tags
    };
    
    saveUserData();
    updateUI();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
    modal.hide();
    delete window.editingNoteIndex;
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