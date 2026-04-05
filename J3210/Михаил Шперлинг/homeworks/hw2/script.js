document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'http://localhost:3000';
    
    let currentUser = null;
    try {
        const rawUser = localStorage.getItem('user');
        if (rawUser && rawUser !== 'undefined') {
            currentUser = JSON.parse(rawUser);
        }
    } catch (error) {
        localStorage.removeItem('user');
    }

    const navAuth = document.querySelector('#navbarNav .d-flex');
    if (currentUser && navAuth) {
        navAuth.innerHTML = `
            <span class="text-light me-3 mt-2 fw-bold">@${currentUser.username || 'User'}</span>
            <a href="profile.html" class="btn btn-secondary me-2" aria-label="Личный кабинет"><i class="bi bi-person-circle" aria-hidden="true"></i></a>
            <button id="logoutBtn" class="btn btn-outline-danger">Выйти</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    if (window.location.pathname.includes('profile.html')) {
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('profileName').textContent = currentUser.username;
        document.getElementById('profileEmail').textContent = currentUser.email;
        const avatar = document.getElementById('profileAvatar');
        avatar.src = `https://ui-avatars.com/api/?name=${currentUser.username}&background=6366f1&color=fff&size=150`;
        avatar.style.display = 'block';

        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                document.getElementById('editUsername').value = currentUser.username;
                document.getElementById('editEmail').value = currentUser.email;
                const editModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
                editModal.show();
            });
        }

        const editProfileForm = document.getElementById('editProfileForm');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!editProfileForm.checkValidity()) {
                    editProfileForm.classList.add('was-validated');
                    return;
                }
                const newUsername = document.getElementById('editUsername').value;
                const newEmail = document.getElementById('editEmail').value;
                try {
                    const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: newUsername, email: newEmail })
                    });
                    if (response.ok) {
                        const updatedUser = await response.json();
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }

        fetch(`${API_URL}/models?author=${currentUser.username}`)
            .then(res => res.json())
            .then(models => {
                const profileResources = document.getElementById('profileResources');
                document.getElementById('profileModelsCount').textContent = models.length;
                if (models.length === 0) {
                    profileResources.innerHTML = '<p class="text-muted p-3">Вы еще не загрузили ни одной модели.</p>';
                    return;
                }
                profileResources.innerHTML = '';
                models.forEach(model => {
                    profileResources.innerHTML += `
                        <a href="model.html?id=${model.id}&type=models" class="list-group-item list-group-item-action p-3">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h5 class="mb-1 fw-bold text-primary">${model.title}</h5>
                                <span class="badge bg-primary">Модель</span>
                            </div>
                            <p class="mb-2 text-muted">${model.desc}</p>
                            <div>
                                <span class="badge border bg-light text-dark">${model.task.toUpperCase()}</span>
                                <span class="badge border bg-light text-dark">${model.framework}</span>
                            </div>
                        </a>
                    `;
                });
            })
            .catch(err => {
                document.getElementById('profileResources').innerHTML = '<div class="alert alert-danger m-3">Ошибка сервера</div>';
            });
    }

    if (window.location.pathname.includes('model.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        const itemType = urlParams.get('type') || 'models';

        if (!itemId) {
            document.getElementById('pageContent').innerHTML = '<h3 class="text-center mt-5">Элемент не найден</h3>';
        } else {
            fetch(`${API_URL}/${itemType}/${itemId}`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('modelDetailTitle').textContent = data.title;
                    document.getElementById('breadcrumbName').textContent = data.title;
                    if (data.author) document.getElementById('modelDetailAuthor').textContent = `Автор: @${data.author}`;
                    document.getElementById('modelDetailDesc').textContent = data.desc;
                    document.getElementById('starCount').textContent = data.stars || 0;
                    document.getElementById('downloadCount').textContent = data.downloads || 0;
                    document.getElementById('installCode').textContent = `pip install transformers\n\nmodel = from_pretrained("${data.author || 'hub'}/${data.title}")`;

                    document.getElementById('starBtn').addEventListener('click', async function() {
                        const icon = this.querySelector('.bi');
                        icon.classList.remove('bi-star');
                        icon.classList.add('bi-star-fill', 'text-warning');
                        const current = parseInt(document.getElementById('starCount').textContent) || 0;
                        document.getElementById('starCount').textContent = current + 1;
                        await fetch(`${API_URL}/${itemType}/${itemId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ stars: current + 1 })
                        });
                    }, { once: true });

                    document.getElementById('downloadBtn').addEventListener('click', async function() {
                        const current = parseInt(document.getElementById('downloadCount').textContent) || 0;
                        document.getElementById('downloadCount').textContent = current + 1;
                        alert('Файл начал скачиваться!');
                        await fetch(`${API_URL}/${itemType}/${itemId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ downloads: current + 1 })
                        });
                    });
                });

            const loadComments = () => {
                fetch(`${API_URL}/comments?modelId=${itemId}`)
                    .then(res => res.json())
                    .then(comments => {
                        const list = document.getElementById('commentsList');
                        list.innerHTML = '';
                        if (comments.length === 0) {
                            list.innerHTML = '<p class="text-muted">Здесь пока нет комментариев.</p>';
                        } else {
                            comments.forEach(c => {
                                list.innerHTML += `
                                    <div class="card mb-2 border-0 bg-light">
                                        <div class="card-body py-2 px-3">
                                            <strong class="text-primary">@${c.author}</strong> <small class="text-muted">${c.date}</small>
                                            <p class="mb-0 mt-1">${c.text}</p>
                                        </div>
                                    </div>
                                `;
                            });
                        }
                    });
            };
            loadComments();

            const commentForm = document.getElementById('commentForm');
            if (commentForm) {
                commentForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    if (!currentUser) {
                        alert('Войдите, чтобы оставить комментарий');
                        return;
                    }
                    const text = document.getElementById('commentText').value;
                    await fetch(`${API_URL}/comments`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            modelId: itemId,
                            author: currentUser.username,
                            text: text,
                            date: new Date().toLocaleDateString()
                        })
                    });
                    document.getElementById('commentText').value = '';
                    loadComments();
                });
            }
        }
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!registerForm.checkValidity()) {
                registerForm.classList.add('was-validated');
                return;
            }
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                if (response.ok) {
                    const newUser = await response.json();
                    localStorage.setItem('user', JSON.stringify(newUser));
                    window.location.href = 'profile.html';
                }
            } catch (error) { console.error(error); }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!loginForm.checkValidity()) {
                loginForm.classList.add('was-validated');
                return;
            }
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            try {
                const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
                const users = await response.json();
                if (users.length > 0) {
                    localStorage.setItem('user', JSON.stringify(users[0]));
                    window.location.href = 'profile.html';
                } else {
                    alert('Неверный email или пароль!');
                }
            } catch (error) { console.error(error); }
        });
    }

    const dataContainer = document.getElementById('dataContainer');
    const isDatasetsPage = window.location.pathname.includes('datasets.html');
    const endpoint = isDatasetsPage ? 'datasets' : 'models';

    async function fetchData() {
        if (!dataContainer) return;
        dataContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div></div>';
        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            if (!response.ok) throw new Error();
            const data = await response.json();
            renderCards(data);
        } catch (error) {
            dataContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger" role="alert">Ошибка сети</div></div>';
        }
    }

    function renderCards(items) {
        if (!dataContainer) return;
        dataContainer.innerHTML = '';
        if (items.length === 0) {
            dataContainer.innerHTML = '<p class="text-muted">Пусто</p>';
            return;
        }
        items.forEach(item => {
            const badgeType = isDatasetsPage ? 'Датасет' : 'Модель';
            const badgeColor = isDatasetsPage ? 'bg-success' : 'bg-primary';
            const extraBadge = isDatasetsPage 
                ? `<span class="badge bg-light text-dark border">${item.format ? item.format.toUpperCase() : ''}</span>`
                : `<span class="badge bg-light text-dark border">${item.framework ? item.framework : ''}</span>`;
            const taskBadgeColor = item.task === 'cv' ? 'bg-success bg-opacity-10 text-success border-success' : 
                                   item.task === 'audio' ? 'bg-danger bg-opacity-10 text-danger border-danger' : 
                                   'bg-info-soft text-primary border-primary';

            const authorHTML = item.author ? `<small class="text-muted d-block mb-2">Автор: @${item.author}</small>` : '';

            const cardHTML = `
                <div class="col model-col" data-task="${item.task}" data-framework="${item.framework || ''}" data-format="${item.format || ''}">
                    <div class="card h-100 shadow-sm border-0 model-card">
                        <div class="card-body">
                            <h5 class="card-title"><a href="model.html?id=${item.id}&type=${endpoint}" class="text-decoration-none">${item.title}</a></h5>
                            ${authorHTML}
                            <p class="card-text text-muted small">${item.desc}</p>
                            <div class="mb-3">
                                <span class="badge ${badgeColor}">${badgeType}</span>
                                <span class="badge border ${taskBadgeColor}">${item.task.toUpperCase()}</span>
                                ${extraBadge}
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted" aria-label="Оценка: ${item.stars || 0} звезд, Скачиваний: ${item.downloads || 0}">
                                    <i class="bi bi-star-fill text-warning" aria-hidden="true"></i> ${item.stars || 0} • 
                                    <i class="bi bi-download" aria-hidden="true"></i> ${item.downloads || 0}
                                </small>
                                <span class="text-muted small">${item.size || '0 MB'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            dataContainer.innerHTML += cardHTML;
        });
        rebindFilters();
    }

    function rebindFilters() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const taskFilters = document.querySelectorAll('.task-filter');
        const frameworkSelect = document.getElementById('frameworkSelect');
        const formatSelect = document.getElementById('formatSelect');

        function applyFilters() {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const activeTasks = Array.from(taskFilters).filter(cb => cb.checked).map(cb => cb.value);
            const selectedFramework = frameworkSelect ? frameworkSelect.value : 'all';
            const selectedFormat = formatSelect ? formatSelect.value : 'all';
            const modelCols = document.querySelectorAll('.model-col');

            modelCols.forEach(col => {
                const card = col.querySelector('.model-card');
                if (!card) return;
                const title = card.querySelector('.card-title').innerText.toLowerCase();
                const desc = card.querySelector('.card-text').innerText.toLowerCase();
                const task = col.getAttribute('data-task');
                const framework = col.getAttribute('data-framework');
                const format = col.getAttribute('data-format');

                const matchesText = title.includes(query) || desc.includes(query);
                const matchesTask = activeTasks.length === 0 || activeTasks.includes(task);
                const matchesFramework = selectedFramework === 'all' || selectedFramework === framework;
                const matchesFormat = selectedFormat === 'all' || selectedFormat === format;

                if (matchesText && matchesTask && matchesFramework && matchesFormat) {
                    col.style.display = 'block';
                } else {
                    col.style.display = 'none';
                }
            });
        }

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (searchBtn) searchBtn.addEventListener('click', applyFilters);
        taskFilters.forEach(cb => cb.addEventListener('change', applyFilters));
        if (frameworkSelect) frameworkSelect.addEventListener('change', applyFilters);
        if (formatSelect) formatSelect.addEventListener('change', applyFilters);
    }

    const openCreateModalBtn = document.getElementById('openCreateModalBtn');
    if (openCreateModalBtn) {
        openCreateModalBtn.addEventListener('click', () => {
            if (!currentUser) {
                alert('Только зарегистрированные пользователи могут создавать модели.');
                window.location.href = 'login.html';
                return;
            }
            const createModal = new bootstrap.Modal(document.getElementById('createModelModal'));
            createModal.show();
        });
    }

    const createModelForm = document.getElementById('createModelForm');
    if (createModelForm) {
        createModelForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!createModelForm.checkValidity()) {
                createModelForm.classList.add('was-validated');
                return;
            }
            const newModel = {
                title: document.getElementById('modelTitle').value,
                desc: document.getElementById('modelDesc').value,
                task: document.getElementById('modelTask').value,
                framework: document.getElementById('modelFramework').value,
                author: currentUser.username, 
                downloads: 0,
                stars: 0,
                size: "0 MB"
            };
            try {
                const response = await fetch(`${API_URL}/models`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newModel)
                });
                if (response.ok) {
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('createModelModal'));
                    modalInstance.hide();
                    createModelForm.reset();
                    createModelForm.classList.remove('was-validated');
                    fetchData();
                }
            } catch (error) {
                console.error(error);
            }
        });
    }

    fetchData();
});