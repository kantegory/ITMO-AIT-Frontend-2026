document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'http://localhost:3000';

    const currentUser = JSON.parse(localStorage.getItem('user'));
    updateNavbar(currentUser);

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
                    alert('Регистрация успешна!');
                    window.location.href = 'profile.html'; 
                }
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                alert('Ошибка соединения с сервером. Убедитесь, что json-server запущен.');
            }
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
            } catch (error) {
                console.error('Ошибка входа:', error);
                alert('Ошибка соединения с сервером.');
            }
        });
    }

    function updateNavbar(user) {
        const navAuth = document.querySelector('.navbar .d-flex');
        if (user && navAuth) {
            navAuth.innerHTML = `
                <span class="text-light me-3 mt-2 fw-bold">@${user.username}</span>
                <a href="profile.html" class="btn btn-secondary me-2"><i class="bi bi-person-circle"></i> Профиль</a>
                <button id="logoutBtn" class="btn btn-outline-danger">Выйти</button>
            `;

            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('user');
                window.location.reload(); 
            });
        }
    }


    const dataContainer = document.getElementById('dataContainer');
    
    const isDatasetsPage = window.location.pathname.includes('datasets.html');
    const endpoint = isDatasetsPage ? 'datasets' : 'models';

    async function fetchData() {
        if (!dataContainer) return; 
        dataContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"></div><p>Загрузка данных...</p></div>';

        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            if (!response.ok) throw new Error('Ошибка ответа сервера');
            
            const data = await response.json();
            renderCards(data); 
        } catch (error) {
            console.error('Ошибка:', error);
            dataContainer.innerHTML = '<div class="col-12"><div class="alert alert-danger">Не удалось загрузить данные. Убедитесь, что json-server запущен (порт 3000).</div></div>';
        }
    }


    function renderCards(items) {
        if (!dataContainer) return;
        dataContainer.innerHTML = '';

        if (items.length === 0) {
            dataContainer.innerHTML = '<p class="text-muted">Данных пока нет.</p>';
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

            const cardHTML = `
                <div class="col model-col" data-task="${item.task}" data-framework="${item.framework || ''}" data-format="${item.format || ''}">
                    <div class="card h-100 shadow-sm border-0 model-card">
                        <div class="card-body">
                            <h5 class="card-title"><a href="model.html" class="text-decoration-none">${item.title}</a></h5>
                            <p class="card-text text-muted small">${item.desc}</p>
                            <div class="mb-3">
                                <span class="badge ${badgeColor}">${badgeType}</span>
                                <span class="badge border ${taskBadgeColor}">${item.task.toUpperCase()}</span>
                                ${extraBadge}
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted"><i class="bi bi-star-fill text-warning"></i> 5.2k • <i class="bi bi-download"></i> ${item.downloads}</small>
                                <span class="text-muted small">${item.size}</span>
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
        const searchBtn = document.querySelector('.input-group .btn-primary');
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

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
            if (searchBtn) searchBtn.addEventListener('click', applyFilters);
        }

        taskFilters.forEach(cb => cb.addEventListener('change', applyFilters));
        
        if (frameworkSelect) frameworkSelect.addEventListener('change', applyFilters);
        if (formatSelect) formatSelect.addEventListener('change', applyFilters);
    }

    fetchData();

});