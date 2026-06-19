const API_URL = 'http://localhost:3000';

let currentUser = null;

if (document.getElementById('profileName')) {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        document.body.innerHTML = `
            <div class="container mt-5 text-center">
                <h2>Вы не вошли в аккаунт</h2>
                <p>Пожалуйста, <a href="login.html">войдите в аккаунт</a>, чтобы посмотреть личный кабинет.</p>
            </div>
        `;
    }
}

if (document.getElementById('loginForm')) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        window.location.href = 'profile.html';
    }
}

if (document.getElementById('registerForm')) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        window.location.href = 'profile.html';
    }
}

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}

const destinations = [
{ 
    name: "Рим", 
    type: "city", 
    budget: "high", 
    duration: "medium", 
    description: "Колизей, Ватикан, фонтан Треви", 
    price: 280000,
    image: "images/Rim.jpg",
    mapLink: "https://www.google.com/maps/place/Рим"
},
{ 
    name: "Карелия", 
    type: "nature", 
    budget: "low", 
    duration: "medium", 
    description: "Лесные озера, водопады, Кижи", 
    price: 45000,
    image: "https://7d9e88a8-f178-4098-bea5-48d960920605.selcdn.net/e8062cd7-abeb-41c0-8dd6-3164d6424ec1/-/format/webp/-/quality/smart_retina/-/stretch/off/-/resize/1900x/-/format/webp/-/quality/smart_retina/-/stretch/off/-/resize/1900x/",
    mapLink: "https://www.google.com/maps/place/Карелия"
},
{ 
    name: "Токио", 
    type: "city", 
    budget: "high", 
    duration: "long", 
    description: "Небоскребы, храмы, суши", 
    price: 350000,
    image: "images/Tokio.jpg",
    mapLink: "https://www.google.com/maps/place/Токио"
},
{ 
    name: "Камчатка", 
    type: "nature", 
    budget: "high", 
    duration: "long", 
    description: "Вулканы, гейзеры, медведи", 
    price: 30000,
    image: "https://icdn.lenta.ru/images/2017/03/09/17/20170309175117910/detail_a830213b0536c057e346ee70008d2c50.jpg",
    mapLink: "https://www.google.com/maps/place/Камчатка"
},
{ 
    name: "Барселона", 
    type: "city", 
    budget: "medium", 
    duration: "short", 
    description: "Саграда Фамилия, пляжи, Гауди", 
    price: 160000,
    image: "images/Barselona.jpg",
    mapLink: "https://www.google.com/maps/place/Барселона"
},
{ 
    name: "Алтай", 
    type: "nature", 
    budget: "medium", 
    duration: "long", 
    description: "Горы, реки, чистый воздух", 
    price: 150000,
    image: "images/Altay.jpeg",
    mapLink: "https://www.google.com/maps/place/Республика+Алтай"
},
{ 
    name: "Санкт-Петербург", 
    type: "city", 
    budget: "medium", 
    duration: "short", 
    description: "Эрмитаж, разводные мосты", 
    price: 80000,
    image: "https://img.goodfon.ru/wallpaper/big/d/e3/sankt-peterburg-piter-st-3495.webp",
    mapLink: "https://www.google.com/maps/place/Санкт-Петербург"
},
{ 
    name: "Сочи", 
    type: "nature", 
    budget: "high", 
    duration: "short", 
    description: "Море, горы, олимпийский парк", 
    price: 180000,
    image: "https://avatars.mds.yandex.net/get-marketcms/1490511/img-70e05b40-23a4-415a-a6c4-55fad381dc26.jpeg/optimize",
    mapLink: "https://www.google.com/maps/place/Сочи"
}
];

function renderDestinations(filteredDestinations) {
    const container = document.getElementById('resultsContainer');
    if (!container) return; 
    
    container.innerHTML = '';
    
    if (filteredDestinations.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">Ничего не найдено</p></div>';
        return;
    }
    
    filteredDestinations.forEach(dest => {
        const card = `
            <div style="min-width: 320px; max-width: 350px; flex-shrink: 0;">
                <div class="card h-100">
                    <img src="${dest.image}" class="card-img-top" alt="${dest.name}" style="height: 220px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${dest.name}</h5>
                        <p class="card-text">${dest.description}</p>
                        <p class="card-text">
                            <small class="text-muted">
                                ${dest.price.toLocaleString()} ₽ | 
                                ${dest.duration === 'short' ? '1-7 дней' : dest.duration === 'medium' ? '7-14 дней' : '14+ дней'}
                            </small>
                        </p>
                        <a href="${dest.mapLink}" target="_blank" class="btn btn-outline-primary btn-sm mt-auto">
                            Посмотреть на карте
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function filterDestinations() {
    const cityChecked = document.getElementById('filterCity')?.checked || false;
    const natureChecked = document.getElementById('filterNature')?.checked || false;
    const budget = document.getElementById('filterBudget')?.value || 'all';
    const duration = document.getElementById('filterDuration')?.value || 'all';
    
    const filtered = destinations.filter(dest => {
        let typeMatch = true;
        if (cityChecked && !natureChecked) {
            typeMatch = dest.type === 'city';
        } else if (!cityChecked && natureChecked) {
            typeMatch = dest.type === 'nature';
        }
        
        let budgetMatch = true;
        if (budget === 'low') {
            budgetMatch = dest.price <= 50000;
        } else if (budget === 'medium') {
            budgetMatch = dest.price > 50000 && dest.price <= 200000;
        } else if (budget === 'high') {
            budgetMatch = dest.price > 200000;
        }
        
        let durationMatch = true;
        if (duration === 'short') {
            durationMatch = dest.duration === 'short';
        } else if (duration === 'medium') {
            durationMatch = dest.duration === 'medium';
        } else if (duration === 'long') {
            durationMatch = dest.duration === 'long';
        }
        
        return typeMatch && budgetMatch && durationMatch;
    });
    
    renderDestinations(filtered);
}

if (document.getElementById('resultsContainer')) {
    if (document.getElementById('filterCity')) {
        document.getElementById('filterCity').addEventListener('change', filterDestinations);
        document.getElementById('filterNature').addEventListener('change', filterDestinations);
        document.getElementById('filterBudget').addEventListener('change', filterDestinations);
        document.getElementById('filterDuration').addEventListener('change', filterDestinations);
    }
    renderDestinations(destinations);
}


let userNotes = [];

function renderNotes() {
    const container = document.getElementById('notesList');
    if (!container) return;
    
    if (userNotes.length === 0) {
        container.innerHTML = '<p class="text-muted">Заметок пока нет</p>';
        return;
    }
    
    container.innerHTML = '';
    userNotes.forEach((note, index) => {
        const noteElement = `
            <div class="border-bottom mb-2 pb-2">
                <strong>${escapeHtml(note.title)}</strong>
                <p class="mb-0 small">${escapeHtml(note.text)}</p>
                <div class="mt-1">
                    <button class="btn btn-danger btn-sm" onclick="deleteNote(${index})">Удалить</button>
                    <button class="btn btn-info btn-sm ms-2" onclick="shareNote('${escapeHtml(note.title)}', '${escapeHtml(note.text)}')">Поделиться</button>
                </div>
            </div>
        `;
        container.innerHTML += noteElement;
    });
}
//чтобы можно было делиться заметками
function shareNote(title, text) {
    const shareText = `Моя заметка: ${title}\n${text}`;
    navigator.clipboard.writeText(shareText);
    alert('Заметка скопирована! Теперь её можно отправить другу.');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const textInput = document.getElementById('noteText');
    
    if (!titleInput || !textInput) return;
    
    const title = titleInput.value;
    const text = textInput.value;
    
    if (title === '' || text === '') {
        alert('Заполните название и текст заметки');
        return;
    }
    
    userNotes.push({ title: title, text: text });
    renderNotes();
    
    titleInput.value = '';
    textInput.value = '';
}

function deleteNote(index) {
    userNotes.splice(index, 1);
    renderNotes();
}

if (document.getElementById('notesList')) {
    renderNotes();
    const addBtn = document.getElementById('addNoteBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addNote);
    }
}

//Бюджеты
let totalBudget = 0;
let expenses = [];

function updateBudgetDisplay() {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const balance = totalBudget - totalExpenses;
    
    document.getElementById('totalIncome').textContent = totalBudget.toLocaleString();
    document.getElementById('totalExpenses').textContent = totalExpenses.toLocaleString();
    document.getElementById('balance').textContent = balance.toLocaleString();
    
    const expensesList = document.getElementById('expensesItems');
    if (expensesList) {
        expensesList.innerHTML = '';
        expenses.forEach((exp, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${exp.name}: ${exp.amount.toLocaleString()} ₽
                <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Удалить</button>
            `;
            expensesList.appendChild(li);
        });
    }
}

function addBudget() {
    const incomeInput = document.getElementById('income');
    if (incomeInput && incomeInput.value) {
        totalBudget += Number(incomeInput.value);
        incomeInput.value = '';
        updateBudgetDisplay();
    }
}

function addExpense() {
    const nameInput = document.getElementById('expenseName');
    const amountInput = document.getElementById('expenseAmount');
    
    if (nameInput && amountInput && nameInput.value && amountInput.value) {
        expenses.push({
            name: nameInput.value,
            amount: Number(amountInput.value)
        });
        nameInput.value = '';
        amountInput.value = '';
        updateBudgetDisplay();
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateBudgetDisplay();
}

if (document.getElementById('addIncomeBtn')) {
    document.getElementById('addIncomeBtn').addEventListener('click', addBudget);
    document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
    updateBudgetDisplay();
}

// профиль пользователя
let userProfile = {
    name: "Гость",
    email: "не указан",
    registered: new Date().toLocaleDateString()
};

async function loadProfile() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        userProfile = {
            name: user.name,
            email: user.email,
            registered: new Date().toLocaleDateString()
        };
        currentUser = user;
        updateProfileDisplay();
    } else {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            userProfile = JSON.parse(savedProfile);
        }
        updateProfileDisplay();
    }
}

function updateProfileDisplay() {
    const nameSpan = document.getElementById('profileName');
    const emailSpan = document.getElementById('profileEmail');
    const dateSpan = document.getElementById('profileDate');
    
    if (nameSpan) nameSpan.textContent = userProfile.name;
    if (emailSpan) emailSpan.textContent = userProfile.email;
    if (dateSpan) dateSpan.textContent = userProfile.registered;
}

function editProfile() {
    const newName = prompt('Введите ваше имя:', userProfile.name);
    const newEmail = prompt('Введите ваш email:', userProfile.email);
    
    if (newName) userProfile.name = newName;
    if (newEmail) userProfile.email = newEmail;
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateProfileDisplay();
    alert('Профиль обновлен!');
}

if (document.getElementById('profileName')) {
    loadProfile();
}

// Регистрация через API
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;
        
        if (!name || !email || !password || !confirm) {
            alert('Заполните все поля');
            return;
        }
        
        if (password !== confirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (password.length < 6) {
            alert('Пароль должен быть не менее 6 символов');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/users`);
            const users = await response.json();
            
            if (users.find(u => u.email === email)) {
                alert('Пользователь с таким email уже существует');
                return;
            }
            
            const newUser = { id: Date.now(), name, email, password };
            const createResponse = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            
            if (createResponse.ok) {
                alert('Регистрация успешна! Теперь войдите в аккаунт.');
                window.location.href = 'login.html';
            } else {
                alert('Ошибка при регистрации');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка сервера. Убедитесь, что JSON Server запущен: json-server --watch db.json --port 3000');
        }
    });
}

// Вход через API
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Заполните все поля');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/users`);
            const users = await response.json();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('token', `fake-token-${user.id}`);
                currentUser = user;
                alert(`Добро пожаловать, ${user.name}!`);
                window.location.href = 'profile.html';
            } else {
                alert('Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Ошибка сервера. Убедитесь, что JSON Server запущен');
        }
    });
}

// Выход из аккаунта
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    currentUser = null;
    userProfile = {
        name: "Гость",
        email: "не указан",
        registered: new Date().toLocaleDateString()
    };
    
    alert('Вы вышли из аккаунта');
    
    window.location.href = 'index.html';
}

// темная и светлая темы
const themeToggle = document.getElementById('themeToggle');
const htmlTag = document.documentElement;

function setTheme(theme) {
    htmlTag.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? 'Светлая' : 'Тёмная';
    }
}

function toggleTheme() {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

if (themeToggle) {
    themeToggle.removeEventListener('click', toggleTheme);
    themeToggle.addEventListener('click', toggleTheme);
}

const savedThemeLight = localStorage.getItem('theme');
if (savedThemeLight) {
    setTheme(savedThemeLight);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
} else {
    setTheme('light');
}