function showModal(message, title = 'Сообщение', callback = null) {
    const modalId = 'dynamicModal_' + Date.now();
    const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalEl);
    modalEl.addEventListener('hidden.bs.modal', function() {
        modalEl.remove();
        if (callback) callback();
    });
    modal.show();
}

function showConfirm(message, onConfirm, onCancel = null) {
    const modalId = 'confirmModal_' + Date.now();
    const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтверждение</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-danger" id="confirmOkBtn">Да</button>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalEl);
    const okBtn = modalEl.querySelector('#confirmOkBtn');
    const handleConfirm = () => {
        modalEl.remove();
        if (onConfirm) onConfirm();
    };
    const handleCancel = () => {
        modalEl.remove();
        if (onCancel) onCancel();
    };
    okBtn.addEventListener('click', handleConfirm);
    modalEl.addEventListener('hidden.bs.modal', function() {
        if (modalEl.parentNode) modalEl.remove();
        if (onCancel) onCancel();
    });
    modal.show();
}

function showPrompt(message, onConfirm, placeholder = '') {
    const modalId = 'promptModal_' + Date.now();
    const modalHtml = `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ввод данных</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                        <input type="text" class="form-control" id="promptInput" placeholder="${placeholder}">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-danger" id="promptOkBtn">OK</button>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalEl);
    const input = modalEl.querySelector('#promptInput');
    const okBtn = modalEl.querySelector('#promptOkBtn');
    const handleOk = () => {
        const val = input.value;
        modalEl.remove();
        if (onConfirm) onConfirm(val);
    };
    okBtn.addEventListener('click', handleOk);
    modalEl.addEventListener('hidden.bs.modal', function() {
        if (modalEl.parentNode) modalEl.remove();
        if (onConfirm) onConfirm(null);
    });
    modal.show();
    input.focus();
}

document.addEventListener('DOMContentLoaded', function() {
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const isLK = window.location.href.includes('pa.html') || window.location.href.includes('pa_inst.html');
const isLogin = window.location.href.includes('login.html');

if (isLK && !currentUser) {
    window.location.href = 'login.html';
    return;
}
if (isLogin && currentUser) {
    window.location.href = currentUser.role === 'instructor' ? 'pa_inst.html' : 'pa.html';
    return;
}
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lecturesContainer = document.getElementById('lecturesContainer');
    const searchInput = document.getElementById('searchInput');
    let activeFilter = 'all';

    window.checkAccess = function(lectureId, buttonElement) {
    showPrompt('Введите кодовое слово для доступа к видео:', (code) => {
        if (!code) return;
        const accessCodes = {
            'parallel': 'параллель',
            'crossroad': 'перекресток',
        };
        const videoLinks = {
            'parallel': 'https://rutube.ru/video/1f72289c07471a38ed98b9f8fd1d08fd/?r=wd',
            'crossroad': 'https://rutube.ru/video/1f72289c07471a38ed98b9f8fd1d08fd/?r=wd',
        };
        if (code.toLowerCase() === accessCodes[lectureId]) {
            showModal('Доступ разрешен! Видео скоро откроется', 'Успех', () => {
                window.open(videoLinks[lectureId], '_blank');
            });
        } else {
            showModal('Неверное кодовое слово!', 'Ошибка');
        }
    });
};

    async function loadLectures() {
        if (!lecturesContainer) return;
        lecturesContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-danger" role="status"></div></div>';

        let baseUrl = `http://localhost:3000/lectures?`;
        if (activeFilter !== 'all') {
            baseUrl += `category=${activeFilter}&`;
        }
        
        const searchText = searchInput ? searchInput.value.trim() : '';

        try {
            let lectures = [];
            if (searchText) {
                const urlTitle = baseUrl + `title_like=${encodeURIComponent(searchText)}`;
                const urlDesc = baseUrl + `description_like=${encodeURIComponent(searchText)}`;
                const [resTitle, resDesc] = await Promise.all([fetch(urlTitle), fetch(urlDesc)]);
                const lecturesTitle = await resTitle.json();
                const lecturesDesc = await resDesc.json();
                const map = new Map();
                [...lecturesTitle, ...lecturesDesc].forEach(l => map.set(l.id, l));
                lectures = Array.from(map.values());
            } else {
                const res = await fetch(baseUrl);
                lectures = await res.json();
            }
            renderLectures(lectures);
        } catch (e) {
            console.error('Ошибка:', e);
            lecturesContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Ошибка загрузки лекций. Убедитесь, что запущен json-server</div></div>';
        }
    }

    function renderLectures(lectures) {
        if (!lectures.length) {
            lecturesContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Лекции не найдены</div></div>';
            return;
        }
        const categoryLabels = { 'newbie': 'новичкам', 'extreme': 'экстрим', 'for_all': 'для всех', 'all': 'для всех' };

        lecturesContainer.innerHTML = lectures.map(l => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 hover-lift position-relative">
                    ${l.isPopular ? '<div class="position-absolute top-0 end-0 m-2"><span class="badge bg-danger">популярно</span></div>' : ''}
                    <div class="card-body">
                        <h3 class="card-title h5">${l.title}</h3>
                        <p class="card-text">${l.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <span class="text-muted small">${l.duration}</span>
                                <span class="badge bg-light text-dark ms-2">${categoryLabels[l.category] || l.category}</span>
                            </div>
                            <a href="${l.buyLink}" class="btn btn-outline-danger btn-sm">купить лекцию</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-danger', 'active');
                btn.classList.add('btn-outline-danger');
            });
            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger', 'active');
            activeFilter = this.getAttribute('data-filter');
            loadLectures();
        });
    });

    // Обработчик поиска
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchInput.debounceTimer);
            searchInput.debounceTimer = setTimeout(loadLectures, 300); // Запрос не чаще раза в 300мс
        });
    }

    // Первичная загрузка
    if (lecturesContainer) loadLectures();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginClick);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (document.getElementById('studentLessons')) {
        initStudentPage();
    }
    
    if (document.getElementById('todayLessons')) {
        loadInstructorSchedule();
    }
});

async function handleLoginClick(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    
    if (!email || !password || !role) {
        showModal('Заполните все поля', 'Ошибка');
        return;
    }
    
    try {
        const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        const users = await res.json();
        const user = users.find(u => u.password === password);
        
        if (user && user.role === role) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = role === 'student' ? 'pa.html' : 'pa_inst.html';
        } else {
            showModal('Неверный email, пароль или роль', 'Ошибка'); 
        }
    } catch (e) {
        console.error(e);
        showModal('Ошибка подключения к серверу. Запустите json-server', 'Ошибка'); 
    }
}

async function handleRegister(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById('name')?.value.trim();
    const surname = document.getElementById('surname')?.value.trim();
    const fullName = name && surname ? `${name} ${surname}` : (name || surname);
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const confirm = document.getElementById('confirmPassword')?.value;
    const role = document.querySelector('input[name="role"]:checked')?.value || 'student';
    
    if (!fullName || !email || !password) { 
        showModal('Заполните все обязательные поля', 'Ошибка');
        return; 
    }
    
    if (password !== confirm) { 
        showModal('Пароли не совпадают', 'Ошибка'); 
        return; 
    }
    
    if (password.length < 3) {
        showModal('Пароль должен содержать минимум 3 символа', 'Ошибка');
        return;
    }
    
    try {
        const checkRes = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        const existingUsers = await checkRes.json();     
        if (existingUsers.length > 0) { 
            showModal('Пользователь с таким email уже существует', 'Ошибка');
            return; 
        }
        const newUser = { name: fullName, email, password, role };
        
        const createRes = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });
        
        if (createRes.ok) {
            const createdUser = await createRes.json();
            showModal('Регистрация успешна. Теперь вы можете войти.', 'Успех', () => {
                window.location.href = 'login.html';
            }); 
        } else {
            showModal('Ошибка регистрации. Попробуйте еще раз.', 'Ошибка');
        }
    } catch (e) {
        console.error(e);
        showModal('Ошибка подключения к серверу. Убедитесь, что json-server запущен', 'Ошибка');
    }
}

// старница ученика
function formatLessonDate(dateString) {  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month} (${days[date.getDay()]})`;
}

async function initStudentPage() {
    const container = document.getElementById('studentLessons');
    if (!container) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'student') {
        container.innerHTML = '<div class="alert alert-warning">Войдите как ученик</div>';
        return;
    }
    
    try {
        const res = await fetch('http://localhost:3000/lessons');
        const allLessons = await res.json();
        const lessons = allLessons.filter(l => l.status === 'free' || l.studentId == user.id);
        
        if (!lessons.length) { 
            container.innerHTML = '<div class="alert alert-info">Нет доступных уроков</div>'; 
            return; 
        }
        
        container.innerHTML = lessons.map(lesson => {
            let badge, btn;
            if (lesson.status === 'free') {
                badge = '<span class="badge bg-warning text-dark">Свободно</span>';
                btn = `<button onclick="bookLesson(${lesson.id}, ${user.id}, '${user.name}')" class="btn btn-success btn-sm">Записаться</button>`;
            } else if (lesson.studentId == user.id) {
                badge = '<span class="badge bg-success">Вы записаны</span>';
                btn = '<button class="btn btn-secondary btn-sm" disabled>Подтверждено</button>';
            } else {
                badge = '<span class="badge bg-danger">Занято</span>';
                btn = '<button class="btn btn-secondary btn-sm" disabled>Недоступно</button>';
            }
            const formattedDate = formatLessonDate(lesson.date);
            return `
                <div class="card mb-3 p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${formattedDate} ${lesson.time}</strong>
                            <br><small class="text-muted">Длительность: ${lesson.duration} мин</small>
                        </div>
                        <div class="text-end">
                            ${badge}<br>
                            ${btn}
                        </div>
                    </div>
                </div>`;
        }).join('');
    } catch (e) {
        console.error('Ошибка:', e);
        container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки уроков. Убедитесь, что json-server запущен</div>';
    }
}

async function bookLesson(lessonId, studentId, studentName) {
    showConfirm('Записаться на этот урок?', async () => {
        try {
            const res = await fetch(`http://localhost:3000/lessons/${lessonId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'booked', studentId, studentName })
            });
            if (res.ok) {
                showModal('Вы успешно записаны на урок!', 'Успех', () => {
                    initStudentPage();
                }); // ИЗМЕНЕНО: вместо alert
            } else {
                showModal('Ошибка при записи', 'Ошибка'); // ИЗМЕНЕНО
            }
        } catch (e) {
            console.error(e);
            showModal('Ошибка подключения к серверу', 'Ошибка'); // ИЗМЕНЕНО
        }
    });
}

// страница инстурктора
const INSTRUCTOR_ID = 2;

async function loadInstructorSchedule() {
    try {
        const response = await fetch('http://localhost:3000/lessons');
        const allLessons = await response.json();
        const myLessons = allLessons.filter(lesson => lesson.instructorId === INSTRUCTOR_ID);
        const today = new Date().toISOString().split('T')[0];
        const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        const todayLessons = myLessons.filter(lesson => lesson.date === today);
        const weekLessons = myLessons.filter(lesson => lesson.date > today && lesson.date <= weekLater);
        
        todayLessons.sort((a, b) => a.time.localeCompare(b.time));
        weekLessons.sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date));
        
        renderLessonsList(todayLessons, 'todayLessons');
        renderLessonsList(weekLessons, 'weekLessons');
    } catch (error) {
        console.error(error);
        const el = document.getElementById('todayLessons');
        if (el) el.innerHTML = '<div class="alert alert-danger">Ошибка загрузки. Запустите json-server</div>';
    }
}

function renderLessonsList(lessons, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (lessons.length === 0) {
        container.innerHTML = '<div class="alert alert-light text-center">Нет занятий</div>';
        return;
    }
    
    let html = '';
    for (const lesson of lessons) {
        let statusBadge = '', actionButton = '';
        if (lesson.status === 'completed') {
            statusBadge = '<span class="badge bg-secondary">Проведено</span>';
            actionButton = '<button class="btn btn-outline-secondary btn-sm" disabled>Проведено</button>';
        } else if (lesson.status === 'booked') {
            statusBadge = '<span class="badge bg-success">Записан</span>';
            actionButton = `<button onclick="markLessonCompleted(${lesson.id})" class="btn btn-success btn-sm">Отметить проведённым</button>`;
        } else {
            statusBadge = '<span class="badge bg-warning text-dark">Свободно</span>';
            actionButton = '<button class="btn btn-outline-danger btn-sm" disabled>Свободен</button>';
        }
        const studentDisplay = lesson.studentName ? `<span class="text-success fw-bold">${lesson.studentName}</span>` : '<span class="text-secondary">Свободно</span>';
        const dateDisplay = containerId === 'todayLessons' ? formatDateShort(lesson.date) : formatDate(lesson.date);
        
        html += `
            <div class="card mb-3 p-3">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <strong>${dateDisplay} ${lesson.time}</strong>
                        <br><small>${lesson.duration} мин</small>
                    </div>
                    <div class="col-md-4">
                        Ученик: ${studentDisplay}
                    </div>
                    <div class="col-md-2">
                        ${statusBadge}
                    </div>
                    <div class="col-md-3 text-end">
                        ${actionButton}
                    </div>
                </div>
            </div>`;
    }
    container.innerHTML = html;
}

function formatDate(dateString) {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const date = new Date(dateString);
    const [_, month, day] = dateString.split('-');
    return `${days[date.getDay()]}, ${day}.${month}`;
}

function formatDateShort(dateString) {
    const [_, month, day] = dateString.split('-');
    return `${day}.${month}`;
}

async function markLessonCompleted(lessonId) {
    showConfirm('Отметить занятие как проведённое?', async () => {
        try {
            const res = await fetch(`http://localhost:3000/lessons/${lessonId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });
            if (res.ok) {
                showModal('Занятие отмечено как проведённое!', 'Успех', () => {
                    loadInstructorSchedule();
                }); 
            } else {
                showModal('Ошибка обновления', 'Ошибка'); 
            }
        } catch (e) {
            console.error(e);
            showModal('Ошибка подключения к серверу', 'Ошибка'); 
        }
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
window.logout = logout;

window.bookLesson = bookLesson;
window.markLessonCompleted = markLessonCompleted;
window.handleLoginClick = handleLoginClick;
window.handleRegister = handleRegister;
window.checkAccess = window.checkAccess;
