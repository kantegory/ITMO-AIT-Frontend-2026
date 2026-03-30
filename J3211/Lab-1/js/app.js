const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
    console.log('LabelFlow Frontend App Init');

    // Текущий авторизованный пользователь
    let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

    // Защита роутов
    const currentUserPath = window.location.pathname;
    const isAuthPage = currentUserPath.includes('login.html') ||
        currentUserPath.includes('registration.html') ||
        currentUserPath.includes('index.html') ||
        currentUserPath.endsWith('/');

    if (!loggedInUser && !isAuthPage) {
        window.location.href = 'login.html';
        return;
    }
    if (loggedInUser && (currentUserPath.includes('login.html') || currentUserPath.includes('registration.html'))) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Обновление имени
    const updateInitials = (name, targetAvatar) => {
        if (!targetAvatar) return;
        const parts = name.trim().split(' ');
        let initials = (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '');
        targetAvatar.textContent = initials.toUpperCase() || 'U';
    };

    if (loggedInUser) {
        const navAvatars = document.querySelectorAll('.rounded-circle');
        navAvatars.forEach(avatar => updateInitials(loggedInUser.name, avatar));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // Авторизация (login.html)
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (loginError) loginError.classList.add('d-none');

            const email = document.getElementById('emailInput').value.trim();
            const password = document.getElementById('passwordInput').value.trim();

            try {
                const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
                const users = await response.json();

                if (users.length > 0 && users[0].password === password) {
                    localStorage.setItem('currentUser', JSON.stringify(users[0]));
                    const authModalEl = document.getElementById('authModal');
                    if (authModalEl) {
                        const authModal = new bootstrap.Modal(authModalEl);
                        authModal.show();
                        authModalEl.addEventListener('hidden.bs.modal', () => { window.location.href = 'dashboard.html'; });
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    if (loginError) loginError.classList.remove('d-none');
                }
            } catch (error) {
                console.error('Ошибка входа:', error);
                alert('Произошла ошибка при подключении к серверу. Убедитесь, что json-server запущен.');
            }
        });
    }

    // Регистрация (registration.html)
    const registrationForm = document.getElementById('registrationForm');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const regPasswordError = document.getElementById('regPasswordError');
    const regEmailError = document.getElementById('regEmailError');

    if (registrationForm && regPassword && regConfirmPassword && regPasswordError) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            regPasswordError.classList.add('d-none');
            if (regEmailError) regEmailError.classList.add('d-none');

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = regPassword.value.trim();
            const confirmPassword = regConfirmPassword.value.trim();

            if (password !== confirmPassword) {
                regPasswordError.classList.remove('d-none');
                return;
            }

            try {
                const checkRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
                const existingUsers = await checkRes.json();

                if (existingUsers.length > 0) {
                    if (regEmailError) regEmailError.classList.remove('d-none');
                    return;
                }

                const newUser = { name, email, password };
                const createRes = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                if (createRes.ok) {
                    const regModalEl = document.getElementById('regModal');
                    if (regModalEl) new bootstrap.Modal(regModalEl).show();
                }
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                alert('Произошла ошибка при подключении к серверу.');
            }
        });
        regConfirmPassword.addEventListener('input', () => regPasswordError.classList.add('d-none'));
    }

    // Профиль (profile.html)
    const profileForm = document.getElementById('profileForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileDisplayName = document.getElementById('profileDisplayName');
    const profileDisplayEmail = document.getElementById('profileDisplayEmail');
    const profileUpdateSuccess = document.getElementById('profileUpdateSuccess');

    if (profileForm && profileName && profileEmail && profileDisplayName && profileDisplayEmail) {
        profileName.value = loggedInUser.name;
        profileEmail.value = loggedInUser.email;
        profileDisplayName.textContent = loggedInUser.name;
        profileDisplayEmail.textContent = loggedInUser.email;
        if (profileAvatar) updateInitials(loggedInUser.name, profileAvatar);

        profileName.addEventListener('input', (e) => {
            updateInitials(e.target.value, profileAvatar);
            profileDisplayName.textContent = e.target.value || 'Без имени';
        });

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (profileUpdateSuccess) profileUpdateSuccess.classList.add('d-none');

            try {
                // На сервер отправляем только изменение имени, не предоставляем пользователю возможность смены почты
                const res = await fetch(`${API_URL}/users/${loggedInUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: profileName.value.trim() })
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    loggedInUser = updatedUser;
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Обновляем сессию

                    if (profileUpdateSuccess) profileUpdateSuccess.classList.remove('d-none');

                    // Обновляем аватарки в шапке
                    const navAvatars = document.querySelectorAll('.rounded-circle');
                    navAvatars.forEach(avatar => updateInitials(updatedUser.name, avatar));
                }
            } catch (error) {
                console.error('Ошибка обновления профиля:', error);
            }
        });
    }

    // Смена пароля
    const profilePasswordForm = document.getElementById('profilePasswordForm');
    if (profilePasswordForm) {
        profilePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const errorLabel = document.getElementById('profilePasswordError');
            const successLabel = document.getElementById('profilePasswordSuccess');

            errorLabel.classList.add('d-none');
            successLabel.classList.add('d-none');

            if (newPassword !== confirmNewPassword) {
                errorLabel.classList.remove('d-none');
                errorLabel.textContent = 'Новые пароли не совпадают.';
                return;
            }

            if (currentPassword !== loggedInUser.password) {
                errorLabel.classList.remove('d-none');
                errorLabel.textContent = 'Неверный текущий пароль.';
                return;
            }

            try {
                const res = await fetch(`${API_URL}/users/${loggedInUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: newPassword })
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    loggedInUser = updatedUser;
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    successLabel.classList.remove('d-none');
                    profilePasswordForm.reset();
                }
            } catch (error) {
                console.error('Ошибка смены пароля:', error);
            }
        });
    }

    // Загрузка и создание проектов в дашборде (dashboard.html)
    const newProjectForm = document.getElementById('newProjectForm');
    const projectsContainer = document.getElementById('projectsContainer');
    const activeProjectsCount = document.getElementById('activeProjectsCount');

    async function loadProjects() {
        if (!projectsContainer || !loggedInUser) return;
        try {
            const res = await fetch(`${API_URL}/projects?userId=${loggedInUser.id}`);
            const projects = await res.json();

            projectsContainer.innerHTML = '';
            if (activeProjectsCount) activeProjectsCount.textContent = projects.length;

            if (projects.length === 0) {
                projectsContainer.innerHTML = '<div class="col-12 text-muted py-4">У вас пока нет проектов. Создайте первый!</div>';
                return;
            }

            projects.forEach(project => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4';

                let badgeStyle = project.type === 'polygon' ? 'bg-success' : (project.type === 'classification' ? 'bg-info text-dark' : 'bg-primary');
                let typeText = project.type === 'polygon' ? 'Segmentation' : (project.type === 'classification' ? 'Classification' : 'Bounding Box');

                col.innerHTML = `
                  <div class="card h-100 border-0 shadow-sm" style="animation: fadeIn 0.5s;">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${project.name}</h5>
                        <span class="badge ${badgeStyle}">${typeText}</span>
                      </div>
                      <p class="text-muted small mb-3">${project.images || 0} изображений</p>
                      <div class="progress mb-3" style="height: 6px;">
                        <div class="progress-bar ${badgeStyle}" role="progressbar" style="width: ${project.progress || 0}%"></div>
                      </div>
                      <a href="annotation.html" class="btn btn-outline-primary btn-sm w-100">Перейти к разметке</a>
                    </div>
                  </div>
                `;
                projectsContainer.appendChild(col);
            });
        } catch (error) {
            console.error('Ошибка загрузки проектов:', error);
        }
    }
    loadProjects();

    if (newProjectForm) {
        newProjectForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('projectName').value.trim();
            const type = document.getElementById('projectType').value;

            if (!name) return;

            const newProject = { userId: loggedInUser.id, name, type, images: 0, progress: 0 };

            try {
                const res = await fetch(`${API_URL}/projects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProject)
                });

                if (res.ok) {
                    bootstrap.Modal.getOrCreateInstance(document.getElementById('newProjectModal')).hide();
                    newProjectForm.reset();
                    loadProjects();
                }
            } catch (error) {
                console.error('Ошибка создания проекта:', error);
            }
        });
    }

    // Поиск проектов (search.html)
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');

    if (searchForm && searchResults && loggedInUser) {
        const renderProjects = (projects) => {
            searchResults.innerHTML = '';
            if (projects.length === 0) {
                searchResults.innerHTML = '<div class="col-12"><p class="text-muted text-center py-5">Проекты не найдены. Попробуйте изменить фильтры.</p></div>';
                return;
            }
            projects.forEach(p => {
                const badgeClass = p.type === 'polygon' ? 'bg-success' : (p.type === 'classification' ? 'bg-info text-dark' : 'bg-primary');
                let typeText = p.type === 'polygon' ? 'Segmentation' : (p.type === 'classification' ? 'Classification' : 'Bounding Box');
                searchResults.innerHTML += `
                    <div class="col-md-6 col-lg-4">
                      <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                          <h5 class="fw-bold mb-2">${p.name}</h5>
                          <span class="badge ${badgeClass} mb-3">${typeText}</span>
                          <a href="annotation.html" class="btn btn-outline-primary btn-sm w-100">Перейти</a>
                        </div>
                      </div>
                    </div>
                `;
            });
        };

        const loadSearchProjects = async (query = '', type = '') => {
            try {
                let url = `${API_URL}/projects?userId=${loggedInUser.id}`;
                if (query) url += `&name_like=${encodeURIComponent(query)}`;
                if (type && type.toLowerCase() !== 'все типы') url += `&type=${encodeURIComponent(type.toLowerCase())}`;

                const res = await fetch(url);
                const projects = await res.json();
                renderProjects(projects);
            } catch (error) {
                console.error('Ошибка поиска:', error);
            }
        };

        loadSearchProjects();

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loadSearchProjects(document.getElementById('searchInput').value.trim(), document.getElementById('filterType').value);
        });

        document.getElementById('resetSearchBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            document.getElementById('filterType').value = '';
            loadSearchProjects();
        });
    }

    // Команда (workers.html)
    const workersContainer = document.getElementById('workersContainer');
    const inviteForm = document.getElementById('inviteForm');

    if (workersContainer && loggedInUser) {
        const loadWorkers = async () => {
            try {
                const res = await fetch(`${API_URL}/workers?ownerId=${loggedInUser.id}`);
                const workers = await res.json();

                workersContainer.innerHTML = '';
                if (workers.length === 0) {
                    workersContainer.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">В команде пока никого нет. Пригласите первого аннотатора!</td></tr>';
                    return;
                }

                workers.forEach(w => {
                    let roleBadge = w.role === 'Менеджер' ? 'bg-secondary' : 'bg-info text-dark';
                    workersContainer.innerHTML += `
                        <tr>
                            <td class="px-4 py-3 fw-medium">${w.name} <span class="text-muted small">(${w.email})</span></td>
                            <td><span class="badge ${roleBadge}">${w.role}</span></td>
                            <td>${w.filesDone || 0} файлов</td>
                            <td class="text-success fw-bold">${w.accuracy || 100}%</td>
                            <td class="px-4 py-3 text-end"><button class="btn btn-sm btn-light text-muted">Ред.</button></td>
                        </tr>
                    `;
                });
            } catch (error) {
                console.error('Ошибка загрузки команды:', error);
            }
        };

        loadWorkers();

        if (inviteForm) {
            inviteForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newWorker = {
                    ownerId: loggedInUser.id,
                    name: "Новый Участник",
                    email: document.getElementById('inviteEmail').value.trim(),
                    role: document.getElementById('inviteRole').value,
                    filesDone: 0,
                    accuracy: 100
                };

                try {
                    const res = await fetch(`${API_URL}/workers`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newWorker)
                    });

                    if (res.ok) {
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('inviteModal')).hide();
                        inviteForm.reset();
                        loadWorkers();
                    }
                } catch (error) {
                    console.error('Ошибка приглашения:', error);
                }
            });
        }
    }

    // Аннотация (annotation.html)
    const saveAnnotationBtn = document.getElementById('saveAnnotationBtn');
    if (saveAnnotationBtn) {
        saveAnnotationBtn.addEventListener('click', function() {
            new bootstrap.Toast(document.getElementById('saveToast')).show();
        });

        const classListBtns = document.querySelectorAll('#classList .list-group-item');
        classListBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                classListBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});