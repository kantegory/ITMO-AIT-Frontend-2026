document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initRegister();
    initExperiments();
    initExperimentDetail();
    initModels();
    initModelsPagination();
    initExperimentsPagination();
    checkAuth();
});

function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        
        if (!email || !password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const response = await api.get('/users', {
                params: { email }
            });
            
            const user = response.data[0];
            
            if (user && user.password === password) {
                localStorage.setItem('token', user.id);
                localStorage.setItem('userEmail', user.email);
                
                console.log('Вход выполнен:', user.email);
                window.location.href = 'dashboard.html';
            } else {
                alert('Неверный email или пароль');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Ошибка сервера');
        }
    });
}

function initRegister() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        const passwordConfirm = document.getElementById('password-confirm')?.value;
        const terms = document.getElementById('terms')?.checked;
        
        // Валидация полей
        if (!email || !username || !password || !passwordConfirm) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (password !== passwordConfirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (password.length < 8) {
            alert('Пароль должен быть не менее 8 символов');
            return;
        }
        
        if (!terms) {
            alert('Необходимо принять условия использования');
            return;
        }
        
        try {
            const response = await api.post('/users', {
                email,
                username,
                password,
                createdAt: new Date().toISOString().split('T')[0]
            });
            
            console.log('Регистрация успешна:', response.data);
            alert('Регистрация успешна! Теперь вы можете войти');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка при регистрации. Попробуйте другой email');
        }
    });
}

async function initExperiments() {
    const tableBody = document.querySelector('#experiments-table tbody');
    if (!tableBody) return;
    
    const searchInput = document.getElementById('search-name');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const statusInput = document.getElementById('filter-status');
    const metricMinInput = document.getElementById('metric-min');
    const metricMaxInput = document.getElementById('metric-max');
    const tagsInput = document.getElementById('filter-tags');
    const applyButton = document.getElementById('apply-filters');
    const resetButton = document.querySelector('#filters-form button[type="reset"]');
    const resultCount = document.getElementById('result-count');
    
    let allExperiments = [];
    
    // Загрузка экспериментов из API
    async function loadExperiments() {
        try {
            const response = await api.get('/experiments');
            allExperiments = response.data;
            renderExperiments(allExperiments);
        } catch (error) {
            console.error('❌ Ошибка загрузки экспериментов:', error);
            alert('Не удалось загрузить эксперименты. Убедитесь, что JSON Server запущен.');
        }
    }
    
    // Внутри initExperiments(), найдите функцию renderExperiments и обновите:

    function renderExperiments(experiments) {
        tableBody.innerHTML = '';
        
        experiments.forEach(function(exp) {
            const row = document.createElement('tr');
            row.setAttribute('data-date', exp.date);
            row.setAttribute('data-metric', exp.metric || '');
            row.setAttribute('data-status', exp.status);
            row.setAttribute('data-tags', exp.tags?.join(' ') || '');
            row.setAttribute('data-id', exp.id);
            
            const metricDisplay = exp.metric ? exp.metric.toFixed(2) : '—';
            const tagsDisplay = exp.tags ? exp.tags.join('   ') : '';
            
            row.innerHTML = `
                <td><a href="experiment-detail.html?id=${exp.id}">${exp.name}</a></td>
                <td>${exp.date}</td>
                <td>${metricDisplay}</td>
                <td>${tagsDisplay}</td>
                <td>${exp.status}</td>
                <td>
                    <a href="experiment-detail.html?id=${exp.id}" class="btn btn-sm btn-primary">Просмотр</a>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        if (resultCount) {
            resultCount.textContent = experiments.length;
        }
        
        // ✅ Вызываем обновление пагинации после отрисовки
        if (typeof window.updateExperimentsPagination === 'function') {
            window.updateExperimentsPagination();
        }
    }
    
    // Фильтрация (клиентская)
    function filterTable() {
        const searchText = searchInput?.value.toLowerCase().trim() || '';
        const dateFrom = dateFromInput?.value || '';
        const dateTo = dateToInput?.value || '';
        const statusFilter = statusInput?.value || '';
        const metricMin = metricMinInput?.value || '';
        const metricMax = metricMaxInput?.value || '';
        const tagsFilter = tagsInput?.value.toLowerCase().trim() || '';
        
        let filtered = allExperiments.filter(function(exp) {
            let show = true;
            
            if (searchText && !exp.name.toLowerCase().includes(searchText)) {
                show = false;
            }
            
            if (show && dateFrom && exp.date < dateFrom) {
                show = false;
            }
            
            if (show && dateTo && exp.date > dateTo) {
                show = false;
            }
            
            if (show && statusFilter && exp.status !== statusFilter) {
                show = false;
            }
            
            if (show && metricMin && exp.metric < parseFloat(metricMin)) {
                show = false;
            }
            
            if (show && metricMax && exp.metric > parseFloat(metricMax)) {
                show = false;
            }
            
            if (show && tagsFilter) {
                const searchTags = tagsFilter.split(',').map(tag => tag.trim()).filter(t => t);
                if (searchTags.length > 0) {
                    const hasTag = searchTags.some(tag => 
                        exp.tags?.some(expTag => expTag.toLowerCase().includes(tag))
                    );
                    if (!hasTag) show = false;
                }
            }
            
            return show;
        });
        
        renderExperiments(filtered);
        console.log('🔍 Найдено экспериментов:', filtered.length);
        // ✅ Обновляем пагинацию после фильтрации
        if (typeof window.updateExperimentsPagination === 'function') {
            window.updateExperimentsPagination();
        }
    }
    
    // Загружаем данные при старте
    await loadExperiments();
    
    // Навешиваем обработчики
    if (applyButton) {
        applyButton.addEventListener('click', filterTable);
    }
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterTable, 300);
        });
    }
    
    if (dateFromInput) dateFromInput.addEventListener('change', filterTable);
    if (dateToInput) dateToInput.addEventListener('change', filterTable);
    if (statusInput) statusInput.addEventListener('change', filterTable);
    if (metricMinInput) metricMinInput.addEventListener('input', filterTable);
    if (metricMaxInput) metricMaxInput.addEventListener('input', filterTable);
    if (tagsInput) {
        let tagsTimeout;
        tagsInput.addEventListener('input', function() {
            clearTimeout(tagsTimeout);
            tagsTimeout = setTimeout(filterTable, 300);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            setTimeout(filterTable, 50);
        });
    }
    
    window.filterTable = filterTable;
}

function initExperimentDetail() {
    const expName = document.getElementById('experiment-name')?.textContent || 
                    document.getElementById('exp-title')?.textContent || '';
    
    const deleteExpName = document.getElementById('delete-exp-name');
    if (deleteExpName) {
        deleteExpName.textContent = expName;
    }
    
    const cloneNameInput = document.getElementById('clone-name');
    if (cloneNameInput && expName) {
        cloneNameInput.value = expName + '_copy';
    }
    
    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function() {
            console.log('Удаление эксперимента:', expName);
            alert('Эксперимент "' + expName + '" удалён');
            window.location.href = 'experiments.html';
        });
    }
    
    const confirmClone = document.getElementById('confirm-clone');
    if (confirmClone) {
        confirmClone.addEventListener('click', function() {
            const newName = cloneNameInput?.value || expName + '_copy';
            console.log('Клонирование эксперимента:', expName, '->', newName);
            alert('Эксперимент клонирован как "' + newName + '"');
            window.location.href = 'experiments.html';
        });
    }
    
    const tabLinks = document.querySelectorAll('#expTabs .nav-link');
    tabLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initModelsPagination() {
    const modelsTable = document.getElementById('models-table');
    if (!modelsTable) return;
    
    const tbody = document.getElementById('models-tbody');
    if (!tbody) return;
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const rowsPerPage = 6;
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    
    let currentPage = 1;
    
    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        
        rows.forEach(function(row, index) {
            if (index >= start && index < end) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        const pageLinks = document.querySelectorAll('#models-pagination .page-link');
        pageLinks.forEach(function(link) {
            const parent = link.parentElement;
            parent.classList.remove('active');
            
            const linkPage = parseInt(link.getAttribute('data-page'));
            if (linkPage === page) {
                parent.classList.add('active');
            }
        });
        
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', page === 1);
        }
        
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', page === totalPages);
        }
        
        currentPage = page;
    }
    
    const pageLinks = document.querySelectorAll('#models-pagination .page-link');
    pageLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const pageAttr = this.getAttribute('data-page');
            const text = this.textContent.trim();
            
            let targetPage = currentPage;
            
            if (pageAttr) {
                targetPage = parseInt(pageAttr);
            } else if (text.includes('Предыдущая')) {
                targetPage = Math.max(1, currentPage - 1);
            } else if (text.includes('Следующая')) {
                targetPage = Math.min(totalPages, currentPage + 1);
            }
            
            if (targetPage >= 1 && targetPage <= totalPages) {
                showPage(targetPage);
            }
        });
    });
    
    showPage(1);
}

function initExperimentsPagination() {
    const experimentsTable = document.getElementById('experiments-table');
    if (!experimentsTable) return;
    
    const tbody = document.querySelector('#experiments-table tbody');
    if (!tbody) return;
    
    const rowsPerPage = 8;
    let allRows = [];
    let totalPages = 1;
    let currentPage = 1;
    
    function updatePagination() {
        allRows = Array.from(tbody.querySelectorAll('tr'));
        totalPages = Math.ceil(allRows.length / rowsPerPage);
        currentPage = 1;
        showPage(1);
        updatePageLinks();
    }
    
    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        
        allRows.forEach(function(row, index) {
            if (index >= start && index < end) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        currentPage = page;
        updatePageLinks();
    }
    
    function updatePageLinks() {
        const pageLinks = document.querySelectorAll('#experiments-pagination .page-link');
        pageLinks.forEach(function(link) {
            const parent = link.parentElement;
            parent.classList.remove('active');
            
            const linkPage = parseInt(link.getAttribute('data-page'));
            if (linkPage === currentPage) {
                parent.classList.add('active');
            }
        });
        
        const prevBtn = document.getElementById('exp-prev-page');
        const nextBtn = document.getElementById('exp-next-page');
        
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', currentPage === 1);
        }
        
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', currentPage === totalPages);
        }
    }
    
    const pageLinks = document.querySelectorAll('#experiments-pagination .page-link');
    pageLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const pageAttr = this.getAttribute('data-page');
            const text = this.textContent.trim();
            
            let targetPage = currentPage;
            
            if (pageAttr && pageAttr !== 'prev' && pageAttr !== 'next') {
                targetPage = parseInt(pageAttr);
            } else if (text.includes('Предыдущая') || pageAttr === 'prev') {
                targetPage = Math.max(1, currentPage - 1);
            } else if (text.includes('Следующая') || pageAttr === 'next') {
                targetPage = Math.min(totalPages, currentPage + 1);
            }
            
            if (targetPage >= 1 && targetPage <= totalPages) {
                showPage(targetPage);
            }
        });
    });
    
    window.updateExperimentsPagination = updatePagination;
    window.showExperimentsPage = showPage;
    
    updatePagination();
}

function initModels() {
    const modelsTable = document.getElementById('models-table');
    if (!modelsTable) return;
    
    initModelsPagination();
    
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            if (row) {
                const modelName = row.getAttribute('data-model-name');
                const modelVersion = row.getAttribute('data-model-version');
                const modelStatus = row.getAttribute('data-model-status');
                const modelMetric = row.getAttribute('data-model-metric');
                
                document.getElementById('info-model-name').textContent = modelName;
                document.getElementById('info-model-version').textContent = modelVersion;
                document.getElementById('info-model-status').textContent = modelStatus;
                document.getElementById('info-metric-accuracy').textContent = modelMetric;
                document.getElementById('info-metric-precision').textContent = (parseFloat(modelMetric) - 0.02).toFixed(2);
                document.getElementById('info-metric-recall').textContent = (parseFloat(modelMetric) - 0.03).toFixed(2);
                document.getElementById('info-metric-f1').textContent = (parseFloat(modelMetric) - 0.025).toFixed(3);
            }
        });
    });
    
    const deployButtons = document.querySelectorAll('.deploy-btn');
    deployButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const row = button.closest('tr');
            if (row) {
                const modelName = row.getAttribute('data-model-name');
                const modelVersion = row.getAttribute('data-model-version');
                document.getElementById('deploy-model-name').value = modelName + ' ' + modelVersion;
            }
        });
    });
    
    const confirmAddModel = document.getElementById('confirm-add-model');
    if (confirmAddModel) {
        confirmAddModel.addEventListener('click', function() {
            const name = document.getElementById('model-name')?.value;
            const version = document.getElementById('model-version')?.value;
            
            if (!name || !version) {
                alert('Заполните все обязательные поля!');
                return;
            }
            
            console.log('Добавление модели:', name, version);
            alert('Модель "' + name + ' ' + version + '" добавлена');
            window.location.reload();
        });
    }
    
    const confirmDeploy = document.getElementById('confirm-deploy');
    if (confirmDeploy) {
        confirmDeploy.addEventListener('click', function() {
            const modelName = document.getElementById('deploy-model-name')?.value;
            const environment = document.getElementById('deploy-environment')?.value;
            const instances = document.getElementById('deploy-instances')?.value;
            
            console.log('Развертывание:', modelName, environment, instances);
            alert('Модель "' + modelName + '" развернута в ' + environment);
            window.location.reload();
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    console.log('Пользователь вышел из системы');
    window.location.href = 'index.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const isAuthPage = document.getElementById('login-form') || document.getElementById('register-form');

    if (!isAuthPage && !token) {
        console.log('Пользователь не авторизован, редирект на вход');
        window.location.href = 'index.html';
        return;
    }
}