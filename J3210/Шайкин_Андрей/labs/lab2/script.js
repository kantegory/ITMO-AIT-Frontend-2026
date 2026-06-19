function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
initTheme();

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

const API_URL = "http://localhost:3000";
let allCourses = []; 

function getAuthToken() { return localStorage.accessToken; }

function checkAuth(redirectIfNotAuth = false) {
    const token = getAuthToken();
    const navAuthBtn = document.getElementById('navAuthBtn');
    if (token && navAuthBtn) navAuthBtn.style.display = 'none';
    if (redirectIfNotAuth && !token) window.location.href = "auth.html";
    if (window.location.pathname.includes('auth.html') && token) window.location.href = "profile.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

async function register(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST", body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) { alert(await res.json()); return; }
        const result = await res.json();
        localStorage.accessToken = result.accessToken;
        localStorage.user = JSON.stringify(result.user);
        window.location.href = "profile.html";
    } catch (e) { console.error(e); }
}

async function login(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST", body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) { alert("Ошибка входа"); return; }
        const result = await res.json();
        localStorage.accessToken = result.accessToken;
        localStorage.user = JSON.stringify(result.user);
        window.location.href = "profile.html";
    } catch (e) { console.error(e); }
}

async function fetchAdviceQuote() {
    const container = document.getElementById('externalApiContainer');
    if (!container) return;
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        container.innerHTML = `<div class="glass p-3 mb-4 border-info border-opacity-25"><small class="text-info d-block mb-1">Совет дня (Внешнее API):</small><span class="fst-italic text-white">"${data.slip.advice}"</span></div>`;
    } catch (e) { console.error(e); }
}

function renderCourses(courses) {
    const container = document.querySelector("#coursesContainer");
    if (!container) return;
    
    container.innerHTML = "";
    if (courses.length === 0) {
        container.innerHTML = '<div class="col-12"><h2 class="text-white-50 text-center mt-5">По вашему запросу ничего не найдено</h2></div>';
        return;
    }

    courses.forEach((course) => {
        const cardHTML = `
        <div class="col-md-6 col-xl-4 d-flex mb-4">
            <article class="glass glass-hover w-100 d-flex flex-column">
                <img src="${course.image}" class="glass-img-top w-100" style="height: 180px;" alt="Обложка курса: ${course.title}">
                <div class="p-4 d-flex flex-column flex-grow-1">
                    <span class="badge ${course.badge} bg-opacity-25 rounded-pill mb-3 border border-opacity-25 d-inline-block" style="width: fit-content;">
                        ${course.category} • ${course.level}
                    </span>
                    <h3 class="fw-bold text-white fs-5">${course.title}</h3>
                    <p class="text-white-50 small flex-grow-1">${course.desc}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <span class="fw-bold text-white fs-5" aria-label="Цена: ${course.price} рублей">${course.price.toLocaleString('ru-RU')} ₽</span>
                        <a href="course.html" class="btn btn-sm glass-btn px-3 py-2" aria-label="Подробнее о курсе: ${course.title}">Подробнее</a>
                    </div>
                </div>
            </article>
        </div>`;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

async function fetchAndRenderCourses() {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (getAuthToken()) headers['Authorization'] = `Bearer ${getAuthToken()}`;
        const res = await fetch(`${API_URL}/courses`, { headers });
        allCourses = await res.json();
        renderCourses(allCourses);
    } catch (e) {
        document.querySelector("#coursesContainer").innerHTML = '<h2 class="text-danger text-center mt-5">Сервер недоступен</h2>';
    }
}

function applyFilters(event) {
    if (event) event.preventDefault();
    const searchTxt = document.getElementById('searchCourse').value.toLowerCase();
    const categoryVal = document.getElementById('categoryFilter').value;
    const maxPrice = Number(document.getElementById('priceRange').value);
    const checkedLevels = [];
    if (document.getElementById('lvl1').checked) checkedLevels.push('Junior');
    if (document.getElementById('lvl2').checked) checkedLevels.push('Middle');
    if (document.getElementById('lvl3').checked) checkedLevels.push('Senior');

    const filtered = allCourses.filter(course => {
        const matchSearch = course.title.toLowerCase().includes(searchTxt) || course.desc.toLowerCase().includes(searchTxt);
        const matchCat = categoryVal === "" || course.category === categoryVal;
        const matchPrice = course.price <= maxPrice;
        const matchLvl = checkedLevels.length === 0 || checkedLevels.includes(course.level);
        return matchSearch && matchCat && matchPrice && matchLvl;
    });
    renderCourses(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    const isProfile = window.location.pathname.includes('profile.html');
    checkAuth(isProfile);

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (isProfile && localStorage.user) {
        const user = JSON.parse(localStorage.user);
        document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.firstName + ' ' + user.lastName);
        document.querySelectorAll('.user-email-display').forEach(el => el.textContent = user.email);
        fetchAdviceQuote(); 
    }

    if (document.getElementById('coursesContainer')) {
        fetchAndRenderCourses(); 
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                document.getElementById('priceValue').textContent = `До ${Number(e.target.value).toLocaleString('ru-RU')} ₽`;
            });
        }
    }
});