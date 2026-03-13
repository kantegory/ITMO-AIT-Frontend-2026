document.addEventListener('DOMContentLoaded', function () {
    console.log('n3n frontend loaded');

    // === Поиск рабочих пространств на странице search.html ===
    const demoWorkspaces = [
        { name: 'Demo workspace', type: 'marketing' },
        { name: 'Internal tools', type: 'dev' },
        { name: 'Side projects', type: 'other' }
    ];

    const resultsList = document.getElementById('results-list');
    const searchForm = document.getElementById('search-form');

    if (resultsList && searchForm) {
        const queryInput = document.getElementById('search-query');
        const typeSelect = document.getElementById('filter-type');
        const resetBtn = document.getElementById('reset-filters');

        // # Отображение результатов поиска #
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
            <span>${item.name}</span>
            <span class="badge bg-secondary text-capitalize">${item.type}</span>
            `;
            resultsList.appendChild(li);
        });
        }

        renderResults(demoWorkspaces);

        // # Обработка отправки формы поиска #
        searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = queryInput.value.trim().toLowerCase();
        const t = typeSelect.value;

        const filtered = demoWorkspaces.filter(item => {
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
        renderResults(demoWorkspaces);
        });
    }

    // === Проверка совпадения паролей на странице register.html ===
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const passwordError = document.getElementById('password-error');

    if (registerForm && passwordInput && passwordConfirmInput && passwordError) {
        // # Проверка совпадения паролей при отправке формы регистрации #
        registerForm.addEventListener('submit', function (e) {
        const pass = passwordInput.value.trim();
        const passConfirm = passwordConfirmInput.value.trim();

        if (pass !== passConfirm) {
            e.preventDefault();
            passwordError.classList.remove('d-none');
        } else {
            passwordError.classList.add('d-none');
        }
        });

        passwordConfirmInput.addEventListener('input', function () {
        passwordError.classList.add('d-none');
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

    // === Профиль: инициалы в аватарке ===
    const profileNameInput = document.getElementById('profile-name');
    const profileAvatarText = document.getElementById('profile-avatar-text');

    if (profileNameInput && profileAvatarText) {
        // # Функция вычисления и установки инициалов из никнейма #
        function updateAvatarInitials(name) {
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] || '';
        const second = parts[1]?.[0] || '';
        const initials = (first + second).toUpperCase() || 'U';
        profileAvatarText.textContent = initials;
        }

        // начальная установка
        updateAvatarInitials(profileNameInput.value || '');

        // обновление при вводе
        profileNameInput.addEventListener('input', function () {
        updateAvatarInitials(profileNameInput.value);
        });
    }

    // === Профиль: инициалы и отображаемые данные ===
    const profileEmailInput = document.getElementById('profile-email');
    const profileDisplayName = document.getElementById('profile-display-name');
    const profileDisplayEmail = document.getElementById('profile-display-email');
    const profileForm = document.getElementById('profile-form');

    // Связываем форму профиля с отображаемым блоком слева
    if (
        profileNameInput &&
        profileEmailInput &&
        profileAvatarText &&
        profileDisplayName &&
        profileDisplayEmail &&
        profileForm
    ) {
        // # Обновление имени, email и инициалов при сохранении профиля #
        function updateAvatarAndLabels() {
            const name = profileNameInput.value.trim();
            const email = profileEmailInput.value.trim();

            // инициалы из никнейма
            const parts = name.split(/\s+/);
            const first = parts[0]?.[0] || '';
            const second = parts[1]?.[0] || '';
            const initials = (first + second).toUpperCase() || 'U';

            profileAvatarText.textContent = initials;
            profileDisplayName.textContent = name || 'User';
            profileDisplayEmail.textContent = email || 'user@n3n.local';
        }

        // начальная установка
        updateAvatarAndLabels();

        // обновление при сабмите формы (как будто сохраняем)
        profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        updateAvatarAndLabels();
        });
    }

    // === workspaces.html: добавление нового пространства в список ===
    const workspaceForm = document.getElementById('workspace-form');
    const workspaceNameInput = document.getElementById('workspace-name');
    const workspaceDescriptionInput = document.getElementById('workspace-description');
    const workspaceList = document.getElementById('workspace-list');

    if (workspaceForm && workspaceNameInput && workspaceList) {
        // # Обработка создания нового рабочего пространства #
        workspaceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = workspaceNameInput.value.trim();
        const description = workspaceDescriptionInput
            ? workspaceDescriptionInput.value.trim()
            : '';

        if (!name) {
            return;
        }

        // Создаём новый элемент списка
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <div>
            <div>${name}</div>
            ${description ? `<div class="small text-muted">${description}</div>` : ''}
            </div>
            <a href="workspace-page.html" class="btn btn-sm btn-outline-primary">Открыть</a>
        `;

        workspaceList.appendChild(li);

        // Очищаем форму
        workspaceNameInput.value = '';
        if (workspaceDescriptionInput) {
            workspaceDescriptionInput.value = '';
        }
        });
    }
});