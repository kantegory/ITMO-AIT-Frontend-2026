document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lectureCards = document.querySelectorAll('.lecture-card');
    const searchInput = document.getElementById('searchInput');
    let activeFilter = 'all';

    window.checkAccess = function(lectureId, buttonElement) {
        const code = prompt('Введите кодовое слово для доступа к видео:');
        const accessCodes = {
            'parallel': 'параллель',
            'crossroad': 'перекресток',
        };
        const videoLinks = {
            'parallel': 'https://rutube.ru/video/1f72289c07471a38ed98b9f8fd1d08fd/?r=wd',
            'crossroad': 'https://rutube.ru/video/1f72289c07471a38ed98b9f8fd1d08fd/?r=wd',
        };
        if (code && code.toLowerCase() === accessCodes[lectureId]) {
            alert('Доступ разрешен! Видео скоро откроется');
            window.open(videoLinks[lectureId], '_blank');
        } else {
            alert('Неверное кодовое слово!');
        }
        
    };

    function filterCards() {
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        lectureCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            let categoryMatch = (activeFilter === 'all' || cardCategory === activeFilter);
            
            let searchMatch = true;
            if (searchText !== '') {
                const cardTitle = card.querySelector('h3, .h3, h4, .h4')?.innerText.toLowerCase() || '';
                const cardDesc = card.querySelector('p')?.innerText.toLowerCase() || '';
                searchMatch = cardTitle.includes(searchText) || cardDesc.includes(searchText);
            }
            
            if (categoryMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
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
            filterCards();
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

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
        alert('Заполните все поля');
        return;
    }
    
    try {
        const res = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        const users = await res.json();
        const user = users.find(u => u.password === password);
        
        if (user && user.role === role) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (role === 'student') {
                window.location.href = 'pa.html';
            } else if (role === 'instructor') {
                window.location.href = 'pa_inst.html';
            }
        } else {
            alert('Неверный email, пароль или роль');
        }
    } catch (e) {
        console.error('Ошибка:', e);
        alert('Ошибка подключения к серверу. Запустите json-server командой: json-server --watch db.json --port 3000');
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
        alert('Заполните все обязательные поля'); 
        return; 
    }
    
    if (password !== confirm) { 
        alert('Пароли не совпадают'); 
        return; 
    }
    
    if (password.length < 3) {
        alert('Пароль должен содержать минимум 3 символа');
        return;
    }
    
    try {
        const checkRes = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
        const existingUsers = await checkRes.json();     
        if (existingUsers.length > 0) { 
            alert('Пользователь с таким email уже существует'); 
            return; 
        }
        const newUser = { 
            name: fullName, 
            email: email, 
            password: password, 
            role: role 
        };
        
        const createRes = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        });
        
        if (createRes.ok) {
            const createdUser = await createRes.json();
            alert('Регистрация успешна. Теперь вы можете войти.');
            window.location.href = 'login.html';
        } else {
            const errorData = await createRes.text();
            console.error('Ошибка регистрации:', errorData);
            alert('Ошибка регистрации. Попробуйте еще раз.');
        }
    } catch (e) {
        console.error('Ошибка:', e);
        alert('Ошибка подключения к серверу. Убедитесь, что json-server запущен');
    }
}

// старница ученика
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
            return `
                <div class="card mb-3 p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${lesson.date} ${lesson.time}</strong>
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
    if (!confirm('Записаться на урок?')) return;
    
    try {
        const res = await fetch(`http://localhost:3000/lessons/${lessonId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                status: 'booked', 
                studentId: studentId, 
                studentName: studentName 
            })
        });
        
        if (res.ok) { 
            alert('Вы успешно записаны на урок!');
            initStudentPage(); 
        } else {
            alert('Ошибка при записи');
        }
    } catch (e) { 
        console.error('Ошибка:', e);
        alert('Ошибка подключения к серверу'); 
    }
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
        console.error('Ошибка:', error);
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
        const dateDisplay = containerId === 'weekLessons' ? formatDate(lesson.date) : lesson.date;
        
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

async function markLessonCompleted(lessonId) {
    if (!confirm('Отметить занятие как проведённое?')) return;
    
    try {
        const res = await fetch(`http://localhost:3000/lessons/${lessonId}`, {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: 'completed' })
        });
        
        if (res.ok) { 
            alert('Занятие отмечено как проведённое!'); 
            loadInstructorSchedule(); 
        } else {
            alert('Ошибка обновления');
        }
    } catch (e) { 
        console.error('Ошибка:', e);
        alert('Ошибка подключения к серверу'); 
    }
}

window.bookLesson = bookLesson;
window.markLessonCompleted = markLessonCompleted;
window.handleLoginClick = handleLoginClick;
window.handleRegister = handleRegister;