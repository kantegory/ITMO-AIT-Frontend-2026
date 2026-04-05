const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
    console.log('n3n frontend loaded');

    // === Переключение темы ===
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleText = document.getElementById('theme-toggle-text');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (themeToggleText) {
            themeToggleText.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
        }
    }

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light' || savedTheme === 'dark') {
        applyTheme(savedTheme);
    }

    if (themeToggle) {
        if (!savedTheme && themeToggleText) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeToggleText.textContent = prefersDark ? 'Светлая тема' : 'Тёмная тема';
        }

        themeToggle.addEventListener('click', function () {
            const currentTheme =
                document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Пытаемся прочитать текущего пользователя из localStorage
    const currentUserRaw = localStorage.getItem('currentUser');
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

    // === Поиск рабочих пространств на странице search.html ===
    const resultsList = document.getElementById('results-list');
    const searchForm = document.getElementById('search-form');

    if (resultsList && searchForm) {
        const queryInput = document.getElementById('search-query');
        const typeSelect = document.getElementById('filter-type');
        const resetBtn = document.getElementById('reset-filters');

        let allWorkspaces = [];

        function renderResults(items) {
        resultsList.innerHTML = '';
        if (!items.length) {
            resultsList.innerHTML =
            '<li class="list-group-item small text-muted">Ничего не найдено</li>';
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            li.className =
            'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
            <div>
                <div>${item.name}</div>
                ${item.description ? `<div class="small text-muted">${item.description}</div>` : ''}
            </div>
            <span class="badge bg-secondary text-capitalize">${item.type || 'other'}</span>
            `;
            resultsList.appendChild(li);
        });
        }

        // # Загрузка рабочих пространств с сервера #
        function loadWorkspaces() {
        fetch(`${API_URL}/workspaces`)
            .then(res => res.json())
            .then(data => {
            allWorkspaces = data;
            renderResults(allWorkspaces);
            })
            .catch(err => {
            console.error(err);
            resultsList.innerHTML =
                '<li class="list-group-item small text-danger">Ошибка загрузки данных</li>';
            });
        }

        loadWorkspaces();

        // # Обработка отправки формы поиска #
        searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = queryInput.value.trim().toLowerCase();
        const t = typeSelect.value;

        const filtered = allWorkspaces.filter(item => {
            const byName = !q || item.name.toLowerCase().includes(q);
            const byType = !t || item.type === t;
            return byName && byType;
        });

        renderResults(filtered);
        });

        // # Сброс фильтров и возврат к полному списку #
        resetBtn.addEventListener('click', function () {
        queryInput.value = '';
        typeSelect.value = '';
        renderResults(allWorkspaces);
        });
    }

    // === Регистрация: проверка уникальности email и создание пользователя ===
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const passwordError = document.getElementById('password-error');

    if (registerForm && passwordInput && passwordConfirmInput && passwordError) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const pass = passwordInput.value.trim();
        const passConfirm = passwordConfirmInput.value.trim();

        // Проверка совпадения паролей
        if (pass !== passConfirm) {
        passwordError.textContent = 'Пароли не совпадают';
        passwordError.classList.remove('d-none');
        return;
        }
        passwordError.classList.add('d-none');

        // Проверяем, что пользователя с таким email ещё нет
        fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(users => {
            if (users.length > 0) {
            // пользователь уже существует
            passwordError.textContent = 'Пользователь с таким email уже зарегистрирован';
            passwordError.classList.remove('d-none');
            return;
            }

            // Создаём нового пользователя
            return fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass })
            });
        })
        .then(res => {
            if (!res || !res.ok) return;
            return res.json();
        })
        .then(newUser => {
            if (!newUser) return;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'dashboard.html'; 
        })
        .catch(err => {
            console.error(err);
            passwordError.textContent = 'Ошибка регистрации';
            passwordError.classList.remove('d-none');
        });
    });

        passwordConfirmInput.addEventListener('input', function () {
            passwordError.classList.add('d-none');
        });
    }

    // === Логин: проверка существующего пользователя ===
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm && loginError) {
        loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email') || '';
        const password = formData.get('password') || '';

            fetch(
            `${API_URL}/users?email=${encodeURIComponent(
                email
            )}&password=${encodeURIComponent(password)}`
            )
            .then(res => res.json())
            .then(users => {
                if (users.length === 1) {
                loginError.classList.add('d-none');
                localStorage.setItem('currentUser', JSON.stringify(users[0]));
                window.location.href = 'dashboard.html';
                } else {
                loginError.textContent =
                    'Неверный email или пароль. Зарегистрируйтесь, если аккаунта ещё нет.';
                loginError.classList.remove('d-none');
                }
            })
            .catch(err => {
                console.error(err);
                loginError.textContent = 'Ошибка при обращении к серверу';
                loginError.classList.remove('d-none');
            });
        });
    }

    // === Проверка смены пароля на profile.html ===
    const profilePasswordForm = document.getElementById('profile-password-form');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    const profilePasswordError = document.getElementById('profile-password-error');

    if (profilePasswordForm && newPasswordInput && newPasswordConfirmInput && profilePasswordError) {
        // # Проверка совпадения нового пароля и подтверждения #
        profilePasswordForm.addEventListener('submit', function (e) {
            const p1 = newPasswordInput.value.trim();
            const p2 = newPasswordConfirmInput.value.trim();

            if (p1 !== p2) {
            e.preventDefault();
            profilePasswordError.classList.remove('d-none');
            } else {
            profilePasswordError.classList.add('d-none');
            }
        });

        newPasswordConfirmInput.addEventListener('input', function () {
            profilePasswordError.classList.add('d-none');
        });
    }

    // === Смена пароля в профиле (через API, с проверкой текущего) ===
    const currentPasswordInput = document.getElementById('current-password');

    if (
    profilePasswordForm &&
    currentPasswordInput &&
    newPasswordInput &&
    newPasswordConfirmInput &&
    profilePasswordError &&
    currentUser
    ) {
    profilePasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentPass = currentPasswordInput.value.trim();
        const newPass = newPasswordInput.value.trim();
        const newPassConfirm = newPasswordConfirmInput.value.trim();

        // 1) Проверка совпадения нового пароля и подтверждения
        if (newPass !== newPassConfirm) {
        profilePasswordError.textContent = 'Новый пароль и подтверждение не совпадают';
        profilePasswordError.classList.remove('d-none');
        return;
        }

        // 2) Получаем свежие данные пользователя с сервера
        fetch(`${API_URL}/users/${currentUser.id}`)
        .then(res => {
            if (!res.ok) throw new Error('Не удалось загрузить пользователя');
            return res.json();
        })
        .then(userFromServer => {
            // 3) Проверяем текущий пароль
            if (userFromServer.password !== currentPass) {
            profilePasswordError.textContent = 'Текущий пароль введён неверно';
            profilePasswordError.classList.remove('d-none');
            return;
            }

            profilePasswordError.classList.add('d-none');

            // 4) Обновляем пароль на сервере
            return fetch(`${API_URL}/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPass })
            });
        })
        .then(res => {
            if (!res) return; // если выше был return без запроса
            if (!res.ok) throw new Error('Ошибка при обновлении пароля');
            return res.json();
        })
        .then(updatedUser => {
            if (!updatedUser) return;

            // 5) Обновляем currentUser в localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Очищаем поля
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            newPasswordConfirmInput.value = '';

            // Сообщение об успехе
            profilePasswordError.textContent = 'Пароль успешно обновлён';
            profilePasswordError.classList.remove('text-danger');
            profilePasswordError.classList.add('text-success');
            profilePasswordError.classList.remove('d-none');

            setTimeout(() => {
            profilePasswordError.classList.add('d-none');
            profilePasswordError.classList.remove('text-success');
            profilePasswordError.classList.add('text-danger');
            }, 2000);
        })
        .catch(err => {
            console.error(err);
            profilePasswordError.textContent = 'Ошибка при обновлении пароля';
            profilePasswordError.classList.remove('d-none');
        });
    });

    newPasswordConfirmInput.addEventListener('input', function () {
        profilePasswordError.classList.add('d-none');
    });
    }

    // === Профиль: элементы DOM ===
    const profileNameInput = document.getElementById('profile-name');
    const profileAvatarText = document.getElementById('profile-avatar-text');
    const profileEmailInput = document.getElementById('profile-email');
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileDisplayEmail = document.getElementById('profile-display-email');
    const profileForm = document.getElementById('profile-form');

    // Если мы на странице профиля и есть текущий пользователь, то заполняем данные
    if (
        profileNameInput &&
        profileEmailInput &&
        profileAvatarText &&
        profileDisplayName &&
        profileDisplayEmail
    ) {
        // Подставляем данные из currentUser, если он есть
        if (currentUser) {
        profileNameInput.value = currentUser.name || '';
        profileEmailInput.value = currentUser.email || '';
        profileDisplayName.textContent = currentUser.name || 'User';
        profileDisplayEmail.textContent = currentUser.email || 'user@n3n.local';
        }

        // Функция для обновления инициалов в аватарке
        function updateAvatarInitials(name) {
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] || '';
        const second = parts[1]?.[0] || '';
        const initials = (first + second).toUpperCase() || 'U';
        profileAvatarText.textContent = initials;
        }

        // начальная установка инициалов
        updateAvatarInitials(profileNameInput.value || '');

        // обновление инициалов при вводе
        profileNameInput.addEventListener('input', function () {
        updateAvatarInitials(profileNameInput.value);
        });

        // Обновление отображаемых данных при сохранении формы
        if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = profileNameInput.value.trim();
            const email = profileEmailInput.value.trim();

            profileDisplayName.textContent = name || 'User';
            profileDisplayEmail.textContent = email || 'user@n3n.local';
            updateAvatarInitials(name);

            if (currentUser) {
            const updatedUser = { ...currentUser, name, email };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
        });
        }
    }

    // === workspaces.html: добавление нового пространства в список ===
    const workspaceForm = document.getElementById('workspace-form');
    const workspaceNameInput = document.getElementById('workspace-name');
    const workspaceDescriptionInput = document.getElementById(
        'workspace-description'
    );
    const workspaceList = document.getElementById('workspace-list');

    if (workspaceForm && workspaceNameInput && workspaceList) {
        function appendWorkspaceToList(ws) {
        const li = document.createElement('li');
        li.className =
            'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <div>
            <div>${ws.name}</div>
            ${ws.description ? `<div class="small text-muted">${ws.description}</div>` : ''}
            </div>
            <a href="workspace-page.html?id=${ws.id}" class="btn btn-sm btn-outline-primary">Открыть</a>
        `;
        workspaceList.appendChild(li);
        }

        // При загрузке можно подтянуть список с сервера
        fetch(`${API_URL}/workspaces${currentUser ? `?ownerId=${currentUser.id}` : ''}`)
        .then(res => res.json())
        .then(list => {
            workspaceList.innerHTML = '';
            list.forEach(appendWorkspaceToList);
        })
        .catch(err => {
            console.error(err);
        });

        workspaceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = workspaceNameInput.value.trim();
        const description = workspaceDescriptionInput
            ? workspaceDescriptionInput.value.trim()
            : '';

        if (!name) {
            return;
        }

        const newWorkspace = {
        name,
        description,
        type: 'other',
        ownerId: currentUser ? currentUser.id : null,
        graph: {}
        };

        fetch(`${API_URL}/workspaces`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newWorkspace)
        })
            .then(res => res.json())
            .then(created => {
            appendWorkspaceToList(created);
            workspaceNameInput.value = '';
            if (workspaceDescriptionInput) {
                workspaceDescriptionInput.value = '';
            }
            })
            .catch(err => {
            console.error(err);
            });
        });
    }

    // === Статистика на dashboard.html: количество рабочих пространств ===
    const statActiveEl = document.getElementById('stat-workspaces-active');

    if (statActiveEl && currentUser) {
        fetch(`${API_URL}/workspaces?ownerId=${currentUser.id}`)
        .then(res => res.json())
        .then(list => {
            statActiveEl.textContent = list.length;
        })
        .catch(err => {
            console.error(err);
            // В случае ошибки оставляем 0
        });
    }
    
    // === Сообщество: загрузка тем и FAQ из API ===
    const topicsList = document.getElementById('topics-list');
    const faqAccordion = document.getElementById('faqAccordion');
    const newTopicForm = document.getElementById('new-topic-form');

    // topics
    if (topicsList) {
        function renderTopic(topic) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            ${topic.title}
            <div class="small text-muted">
            ${topic.responses ?? 0} ответ(ов) · последняя активность: ${topic.lastActivity || '—'}
            </div>
        `;
        topicsList.appendChild(li);
        }

        fetch(`${API_URL}/topics`)
        .then(res => res.json())
        .then(data => {
            topicsList.innerHTML = '';
            data.forEach(renderTopic);
        })
        .catch(err => {
            console.error(err);
            topicsList.innerHTML =
            '<li class="list-group-item small text-danger">Ошибка загрузки тем</li>';
        });
    }

    // FAQ
    if (faqAccordion) {
        fetch(`${API_URL}/faqs`)
        .then(res => res.json())
        .then(data => {
            faqAccordion.innerHTML = '';
            data.forEach((faq, index) => {
            const itemId = `faq-item-${faq.id}`;
            const headerId = `faq-header-${faq.id}`;
            const collapseId = `faq-collapse-${faq.id}`;

            const item = document.createElement('div');
            item.className = 'accordion-item';
            item.innerHTML = `
                <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button collapsed" type="button"
                        data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                    ${faq.question}
                </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    ${faq.answer}
                </div>
                </div>
            `;
            faqAccordion.appendChild(item);
            });
        })
        .catch(err => {
            console.error(err);
            faqAccordion.innerHTML =
            '<div class="small text-danger p-3">Ошибка загрузки FAQ</div>';
        });
    }

    // создание новой темы из модалки
    if (newTopicForm && topicsList) {
        newTopicForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(newTopicForm);
        const title = formData.get('title')?.toString().trim() || '';
        const body = formData.get('body')?.toString().trim() || '';

        if (!title) {
            return;
        }

        const newTopic = {
            title,
            body,
            responses: 0,
            lastActivity: 'только что'
        };

        fetch(`${API_URL}/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTopic)
        })
            .then(res => res.json())
            .then(created => {
            // добавляем новую тему в список
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                ${created.title}
                <div class="small text-muted">
                ${created.responses ?? 0} ответ(ов) · последняя активность: ${created.lastActivity || '—'}
                </div>
            `;
            topicsList.appendChild(li);

            // очищаем форму
            newTopicForm.reset();

            // закрываем модалку
            const modalEl = document.getElementById('newTopicModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
            })
            .catch(err => {
            console.error(err);
            });
        });
    }
    
    // === Редактор графа на workspace-page.html (Drawflow) ===
    const graphArea = document.getElementById('graph-area');

    if (graphArea) {
        // Получаем id workspace из query-параметра ?id=...
        const params = new URLSearchParams(window.location.search);
        const workspaceId = params.get('id');

        if (!workspaceId) {
        console.warn('workspaceId не передан в URL');
        return;
        }

        // Загружаем workspace с сервера, чтобы получить его graph
        fetch(`${API_URL}/workspaces/${workspaceId}`)
            .then(res => res.json())
            .then(workspace => {
            const editor = new Drawflow(graphArea);
            editor.reroute = true;
            editor.start();

            // === Палитра блоков под графом ===
            const palette = document.getElementById('node-palette');

            function createNode(type, posX, posY) {
                const baseOptions = {
                api:   { label: 'API',    inputs: 1, outputs: 1},
                llm:   { label: 'LLM',    inputs: 1, outputs: 1},
                tg:    { label: 'Telegram', inputs: 1, outputs: 1},
                telegram: { label: 'Telegram', inputs: 1, outputs: 1}
                };

                const cfg = baseOptions[type] || baseOptions.api;

                const html = `
                <div style="padding:4px 8px; background:${cfg.color}; border-radius:4px;">
                    ${cfg.label}
                </div>
                `;

                editor.addNode(
                type,
                cfg.inputs,
                cfg.outputs,
                posX,
                posY,
                type,
                {},
                html
                );
            }

            if (palette) {
                palette.addEventListener('click', function (e) {
                const btn = e.target.closest('[data-node-type]');
                if (!btn) return;

                const type = btn.getAttribute('data-node-type');

                // координаты относительно графа (чуть вправо/вниз)
                const rect = graphArea.getBoundingClientRect();
                const posX = editor.precanvas.scrollLeft + (rect.width / 2) - 100;
                const posY = editor.precanvas.scrollTop + (rect.height / 2) - 50;

                createNode(type, posX, posY);
                });
            }

            // Адаптируем размер под контейнер
            graphArea.style.position = 'relative';
            graphArea.style.overflow = 'hidden';

            // Если у workspace уже есть сохранённый граф — загружаем его
            if (workspace.graph && Object.keys(workspace.graph).length > 0) {
            editor.import(workspace.graph);
            } else {
            // Иначе создаём маленький демо-граф из двух нод
            editor.addNode(
                'start',
                0,
                1,
                100,
                200,
                'start',
                {},
                '<div class="p-1">Старт</div>'
            );
            editor.addNode(
                'log',
                1,
                0,
                400,
                200,
                'log',
                {},
                '<div class="p-1">Лог</div>'
            );
            editor.addConnection(1, 2, 'output_1', 'input_1');
            }

            // Сохраняем граф по нажатию «Сохранить»
            const saveBtn = document.querySelector('button.btn-outline-secondary');
            if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                const data = editor.export();
                fetch(`${API_URL}/workspaces/${workspaceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ graph: data })
                })
                .then(res => res.json())
                .then(() => {
                    console.log('Граф сохранён для workspace', workspaceId);
                })
                .catch(console.error);
            });
            }

            // Кнопка «Запустить (демо)» пока просто выводит граф в консоль
            const runBtn = document.querySelector('button.btn-primary');
            if (runBtn) {
            runBtn.addEventListener('click', function () {
                console.log('Текущий граф:', editor.export());
            });
            }
        })
        .catch(err => {
            console.error(err);
        });
    }
});