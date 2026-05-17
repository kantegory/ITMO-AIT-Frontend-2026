const API_URL = "http://localhost:3000"; // адрес сервера
const HF_API_BASE = "https://huggingface.co/api/models"; // Внешнее API


// Функция загрузки 7 моделей для главной сетки (1 + 3 + 3)
async function loadModels(filterParams = "") {
    const grid = document.getElementById("model-grid");
    if (!grid) return;

    // спиннер загрузки пока ждем ответ от API
    grid.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-success"></div></div>';

    try {
        // запрос: сортировка по скачиваниям, лимит 7 штук + параметры фильтров
        const url = `${HF_API_BASE}?sort=downloads&direction=-1&limit=7&full=true${filterParams}`;
        const response = await fetch(url);
        const models = await response.json();

        grid.innerHTML = "";
        models.forEach((model, index) => {
            let colClass = (index === 0) ? "col-12 mb-4" : "col-md-4 mb-4";

            // убираем лишнее из названия и проверяем наличие тегов
            const modelName = model.modelId.split('/').pop();
            const author = model.modelId.split('/')[0];
            const downloads = model.downloads ? model.downloads.toLocaleString() : 0;
            const task = model.pipeline_tag || "AI Model";

            // создаем HTML карточки
            grid.innerHTML += `
                <div class="${colClass}">
                    <div class="card h-100 border-0 shadow-sm card-hover ${index === 0 ? 'bg-light-bloom' : ''}">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge bg-primary text-white">${task}</span>
                                <span class="text-muted small">📥 ${downloads}</span>
                            </div>
                            <h5 class="card-title fw-bold">${modelName} ${index === 0 ? '🌟' : ''}</h5>
                            <p class="small text-muted mb-1">Автор: ${author}</p>
                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <span class="small" style="color: var(--bloom-green); font-weight: 500;">
                                    ${model.library_name || 'Transformers'}
                                </span>
                                <a href="https://huggingface.co/${model.modelId}" target="_blank" class="btn btn-sm ${index === 0 ? 'btn-primary' : 'btn-outline-primary'} px-3">Изучить</a>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Ошибка API:", error);
    }
}

// Функция загрузки мировых трендов (8 простых карточек внизу страницы)
async function loadHuggingFaceTrends() {
    const container = document.getElementById('hf-trends-grid');
    if (!container) return;
    try {
        const response = await fetch(`${HF_API_BASE}?sort=downloads&direction=-1&limit=8`);
        const models = await response.json();
        container.innerHTML = '';
        models.forEach((model) => {
            container.innerHTML += `
                <div class="col-md-3 mb-4">
                    <div class="card h-100 card-hover p-3 shadow-sm border-0">
                        <div class="card-body">
                            <h6 class="fw-bold text-truncate">${model.modelId.split('/').pop()}</h6>
                            <p class="small text-muted mb-0">📥 ${model.downloads.toLocaleString()}</p>
                        </div>
                    </div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// Загрузка моделей конкретного пользователя
async function loadUserModels() {
    const container = document.getElementById('user-models-list'); // Добавь этот id в profile.html
    if (!container) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_URL}/models?userId=${currentUser.id}`);
        const models = await response.json();

        container.innerHTML = "";
        if (models.length === 0) {
            container.innerHTML = '<p class="text-muted py-4">Ваш личный сад пока пуст.</p>';
            return;
        }

        models.forEach(model => {
            container.innerHTML += `
                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body d-flex justify-content-between align-items-center p-4">
                        <div class="d-flex align-items-center">
                            <div class="bg-soft-blue p-3 rounded-4 me-3">${model.type === 'model' ? '🌳' : '🍱'}</div>
                            <div>
                                <h6 class="mb-1 fw-bold">${model.name}</h6>
                                <span class="badge bg-light text-dark mb-1">${model.type}</span>
                                <br><small class="text-muted">Личный проект пользователя</small>
                            </div>
                        </div>
                        <button onclick="deleteUserModel('${model.id}')" class="btn btn-sm btn-outline-danger">Удалить</button>
                    </div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// Удаление модели пользователя
window.deleteUserModel = async function(id) {
    if (!confirm("Вы уверены?")) return;
    await fetch(`${API_URL}/models/${id}`, { method: 'DELETE' });
    loadUserModels();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("🏵️ AIBloom: Оранжерея готова к работе!");

    // Логика формы входа (с fetch)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // запрос к json-серверу
                const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
                const users = await response.json();

                if (users.length > 0) {
                    localStorage.removeItem("currentUser"); // Сначала удаляем старого
                    localStorage.setItem("currentUser", JSON.stringify(users[0])); // Записываем нового

                    // если пользователь найден, сохраняем его в память браузера
                    localStorage.setItem("currentUser", JSON.stringify(users[0]));
                    alert(`Добро пожаловать в сад, ${users[0].name}!`);
                    window.location.href = 'profile.html';
                } else {
                    alert("Ошибка: Неверный email или пароль!");
                }
            } catch (error) {
                alert("Ошибка: Нужно запустить json-server!");
            }
        });
    }

    // Логика формы регистрации (с post запросом)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // сбор данных из полей
            const newUser = {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value
            };

            try {
                // отправка данных на сервер
                const response = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    alert('Семена посеяны! Аккаунт успешно создан в базе.');
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error("Ошибка при регистрации:", error);
                alert('Не удалось сохранить пользователя. Проверьте json-server.');
            }
        });
    }

    // Проверка авторизации и обновление профиля
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        // меняем Вход на имя пользователя в навигации (на всех страницах)
        const navLoginLink = document.querySelector('a[href="login.html"]');
        if (navLoginLink) {
            navLoginLink.innerHTML = `👤 ${currentUser.name}`;
            navLoginLink.href = "profile.html";
        }

        // 2. меняем имя в боковой панели профиля (только на profile.html)
        // найти h4 внутри aside
        const profileName = document.querySelector('aside h4');
        if (profileName) {
            profileName.innerText = currentUser.name;
        }

        // подпись под именем
        const profileSubtext = document.querySelector('aside p.text-muted');
        if (profileSubtext) {
            profileSubtext.innerText = `Выращиваю нейросети с 2024 года • ${currentUser.email}`;
        }
    }

    // Логика фильтрации (связь фильтров с API)
    const filterForm = document.getElementById('filterForm');
    const searchBtn = document.getElementById('searchBtn');

    const applyFilters = (e) => {
        if (e) e.preventDefault();
        let tags = [];
        let filterQuery = "";

        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) filterQuery += `&search=${encodeURIComponent(searchInput.value)}`;

        const task = document.getElementById('taskSelect').value;
        if (task) tags.push(task);

        const license = document.getElementById('licenseSelect').value;
        if (license) tags.push(`license:${license}`);

        document.querySelectorAll('.fw-check:checked').forEach(check => tags.push(check.value));

        if (tags.length > 0) filterQuery += `&filter=${tags.join(',')}`;
        loadModels(filterQuery);
    };

    if (filterForm) filterForm.addEventListener('submit', applyFilters);
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);

    // загрузка данных при старте
    loadModels();
    loadHuggingFaceTrends();
    loadUserModels();


    // Логика модального окна загрузки
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const btn = e.target.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = "🌱 Посев...";
            btn.disabled = true;

            const newModel = {
                name: document.getElementById('modelName').value,
                type: document.getElementById('modelType').value,
                userId: currentUser.id, // модель к ID текущего пользователя
                stars: 0
            };

            try {
                await fetch(`${API_URL}/models`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newModel)
                });

                alert('Модель успешно сохранена в вашем личном инвентаре!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('uploadModal'));
                modal.hide();
                uploadForm.reset();
                loadUserModels(); // обновление списка в профиле
            } catch (e) {
                alert('Ошибка при сохранении');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Логика звезд
    const starBtn = document.getElementById('starBtn');
    if (starBtn) {
        const countSpan = starBtn.querySelector('.count');
        let count = parseInt(countSpan.innerText.replace(' ', ''));

        // Проверяем, ставил ли пользователь звезду ранее (в localStorage)
        let isStarred = localStorage.getItem('modelStarred') === 'true';

        if (isStarred) {
            starBtn.classList.replace('btn-outline-primary', 'btn-primary');
        }

        starBtn.addEventListener('click', () => {
            isStarred = !isStarred;
            localStorage.setItem('modelStarred', isStarred);

            if (isStarred) {
                starBtn.classList.replace('btn-outline-primary', 'btn-primary');
                count++;
            } else {
                starBtn.classList.replace('btn-primary', 'btn-outline-primary');
                count--;
            }
            countSpan.innerText = count.toLocaleString();
        });
    }

    // Логика обсуждений (добавление сообщений)
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');
    const commentInput = document.getElementById('commentInput');

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();

            if (text) {
                // новый элемент комментария
                const newComment = document.createElement('div');
                newComment.className = 'd-flex mb-3 pb-3 border-bottom animate-fade-in';
                newComment.innerHTML = `
                    <img src="https://ui-avatars.com/api/?name=Guest&background=F4A261&color=fff" class="rounded-circle me-3" width="40" height="40">
                    <div>
                        <h6 class="mb-0 fw-bold">Вы (Гость) <span class="badge bg-light text-muted fw-normal ms-2">Только что</span></h6>
                        <p class="mb-0 small text-muted">${text}</p>
                    </div>
                `;

                // в начало списка
                commentList.prepend(newComment);
                commentInput.value = '';
            }
        });
    }

    // Логика форков
    const forkBtn = document.getElementById('forkBtn');
    if (forkBtn) {
        forkBtn.addEventListener('click', () => {
            alert('Модель успешно скопирована (форкнута) в ваш сад!');
            const forkCount = forkBtn.querySelector('.count');
            forkCount.innerText = parseInt(forkCount.innerText) + 1;
        });
    }

    // Логика выхода из аккаунта
    const logoutBtn = document.querySelector('a[href="index.html"].btn-outline-danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem("currentUser"); // Удаляем пользователя из памяти
            // После этого ссылка сама перекинет на index.html
        });
    }
});