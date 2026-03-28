document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initRegister();
    initExperiments();
    initExperimentDetail();
    initModels();
    initDashboard();
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
    
    async function loadExperiments() {
        try {
            const response = await api.get('/experiments');
            allExperiments = response.data;
            renderExperiments(allExperiments);
        } catch (error) {
            console.error('Ошибка загрузки экспериментов:', error);
            alert('Не удалось загрузить эксперименты. Убедитесь, что JSON Server запущен.');
        }
    }
    
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
        
        if (typeof window.updateExperimentsPagination === 'function') {
            window.updateExperimentsPagination();
        }
    }
    
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
        console.log('Найдено экспериментов:', filtered.length);
        if (typeof window.updateExperimentsPagination === 'function') {
            window.updateExperimentsPagination();
        }
    }
    
    await loadExperiments();
    
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

async function initExperimentDetail() {
    const expNameEl = document.getElementById('exp-name');
    if (!expNameEl) {
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const expId = urlParams.get('id');
    
    if (!expId) {
        console.error('ID эксперимента не указан в URL');
        expNameEl.textContent = 'Ошибка: эксперимент не найден';
        return;
    }
    
    let experimentData = null;
    
    async function loadExperiment() {
        try {
            const response = await api.get(`/experiments/${expId}`);
            experimentData = response.data;
            populateExperimentData(experimentData);
        } catch (error) {
            console.error('Ошибка загрузки эксперимента:', error);
            expNameEl.textContent = 'Ошибка загрузки данных';
            alert('Не удалось загрузить данные эксперимента');
        }
    }
    
    function populateExperimentData(exp) {
        const expIdEl = document.getElementById('exp-id');
        const expStatus = document.getElementById('exp-status');
        const expDate = document.getElementById('exp-date');
        
        if (expNameEl) expNameEl.textContent = exp.name || '—';
        if (expIdEl) expIdEl.textContent = exp.id || '—';
        if (expStatus) {
            expStatus.textContent = exp.status || '—';
            if (exp.status === 'Completed') expStatus.className = 'text-success';
            else if (exp.status === 'Running') expStatus.className = 'text-warning';
            else if (exp.status === 'Failed') expStatus.className = 'text-danger';
            else expStatus.className = 'text-secondary';
        }
        if (expDate) expDate.textContent = exp.date || '—';
        
        const accuracy = document.getElementById('metric-accuracy');
        const loss = document.getElementById('metric-loss');
        
        if (accuracy) {
            accuracy.textContent = exp.metrics?.accuracy !== null ? exp.metrics.accuracy.toFixed(2) : '—';
        }
        if (loss) {
            loss.textContent = exp.metrics?.loss !== null ? exp.metrics.loss.toFixed(2) : '—';
        }
        
        const logsContainer = document.getElementById('logs-container');
        if (logsContainer) {
            if (exp.logs && exp.logs.length > 0) {
                logsContainer.innerHTML = exp.logs.map(log => 
                    `<div class="log-line mb-1">${escapeHtml(log)}</div>`
                ).join('');
            } else {
                logsContainer.innerHTML = '<p class="text-muted">Логи отсутствуют</p>';
            }
        }
        
        const artifactsTbody = document.getElementById('artifacts-tbody');
        if (artifactsTbody) {
            if (exp.artifacts && exp.artifacts.length > 0) {
                artifactsTbody.innerHTML = exp.artifacts.map(artifact => `
                    <tr>
                        <td>${escapeHtml(artifact.name)}</td>
                        <td>${escapeHtml(artifact.type)}</td>
                        <td>${escapeHtml(artifact.size)}</td>
                        <td>${escapeHtml(artifact.date)}</td>
                        <td>
                            <a href="#" class="btn btn-sm btn-primary">Скачать</a>
                        </td>
                    </tr>
                `).join('');
            } else {
                artifactsTbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Артефакты отсутствуют</td></tr>';
            }
        }
        
        const paramsTbody = document.getElementById('params-tbody');
        if (paramsTbody) {
            if (exp.params && Object.keys(exp.params).length > 0) {
                paramsTbody.innerHTML = Object.entries(exp.params).map(([key, value]) => `
                    <tr>
                        <td>${escapeHtml(key)}</td>
                        <td>${escapeHtml(String(value))}</td>
                    </tr>
                `).join('');
            } else {
                paramsTbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Параметры отсутствуют</td></tr>';
            }
        }
        
        const deleteIdInput = document.getElementById('delete-exp-id');
        if (deleteIdInput) deleteIdInput.value = exp.id;
        
        const cloneNameInput = document.getElementById('clone-name');
        if (cloneNameInput && exp.name) {
            cloneNameInput.value = exp.name + '_copy';
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', async function() {
            const deleteId = document.getElementById('delete-exp-id')?.value;
            
            if (!deleteId) {
                alert('Ошибка: ID эксперимента не найден');
                return;
            }
            
            try {
                await api.delete(`/experiments/${deleteId}`);
                alert('Эксперимент удалён');
                window.location.href = 'experiments.html';
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Ошибка при удалении эксперимента');
            }
        });
    }
    
    const confirmClone = document.getElementById('confirm-clone');
    if (confirmClone) {
        confirmClone.addEventListener('click', async function() {
            const newName = document.getElementById('clone-name')?.value;
            
            if (!newName) {
                alert('Введите название для клонированного эксперимента');
                return;
            }
            
            try {
                await api.post('/experiments', {
                    name: newName,
                    date: new Date().toISOString().split('T')[0],
                    metric: experimentData?.metric || null,
                    status: 'Pending',
                    tags: experimentData?.tags || [],
                    logs: [`[INFO] Cloned from ${experimentData?.name || 'unknown'}`],
                    artifacts: [],
                    params: experimentData?.params || {},
                    metrics: experimentData?.metrics || { accuracy: null, loss: null }
                });
                
                alert('Эксперимент клонирован');
                window.location.href = 'experiments.html';
            } catch (error) {
                console.error('Ошибка клонирования:', error);
                alert('Ошибка при клонировании эксперимента');
            }
        });
    }
    
    await loadExperiment();
}


function initModelsPagination() {
    const tbody = document.getElementById('models-tbody');
    if (!tbody) return;

    const rowsPerPage = 6;
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
        const pageLinks = document.querySelectorAll('#models-pagination .page-link');
        pageLinks.forEach(function(link) {
            const parent = link.parentElement;
            parent.classList.remove('active');
            
            const linkPage = parseInt(link.getAttribute('data-page'));
            if (linkPage === currentPage) {
                parent.classList.add('active');
            }
        });
        
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.classList.toggle('disabled', currentPage === 1);
        }
        
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', currentPage === totalPages);
        }
    }

    const pageLinks = document.querySelectorAll('#models-pagination .page-link');
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

    window.updateModelsPagination = updatePagination;
    window.showModelsPage = showPage;

    updatePagination();
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

async function initModels() {
    const tableBody = document.querySelector('#models-tbody');
    if (!tableBody) return;

    let allModels = [];
    let allExperiments = [];

    // Загрузка моделей из API
    async function loadModels() {
        try {
            const response = await api.get('/models');
            allModels = response.data;
            renderModels(allModels);
            updateStats(allModels);
        } catch (error) {
            console.error('Ошибка загрузки моделей:', error);
            alert('Не удалось загрузить модели');
        }
    }

    async function loadExperimentsForSelect() {
        try {
            const response = await api.get('/experiments');
            allExperiments = response.data;
            const select = document.getElementById('experiment-select');
            if (select) {
                select.innerHTML = '<option value="">Выберите эксперимент</option>';
                allExperiments.forEach(exp => {
                    const option = document.createElement('option');
                    option.value = exp.id;
                    option.textContent = exp.name;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки экспериментов для селекта:', error);
        }
    }

    function renderModels(models) {
        tableBody.innerHTML = '';
        
        models.forEach(function(model) {
            const row = document.createElement('tr');
            row.setAttribute('data-id', model.id);
            row.setAttribute('data-model-name', model.name);
            row.setAttribute('data-model-version', model.version);
            row.setAttribute('data-model-status', model.status);
            row.setAttribute('data-model-metric', model.metric || '');
            row.setAttribute('data-experiment-id', model.experimentId || '');
            
            const statusClass = model.status === 'Production' ? 'text-success' : 
                               model.status === 'Staging' ? 'text-warning' : 'text-secondary';
            
            row.innerHTML = `
                <td><a href="#" class="model-link">${model.name}</a></td>
                <td>${model.version}</td>
                <td><span class="${statusClass}">${model.status}</span></td>
                <td>${model.metric ? model.metric.toFixed(2) : '—'}</td>
                <td><a href="experiment-detail.html?id=${model.experimentId || ''}">${model.experimentId || '—'}</a></td>
                <td>${model.date || '—'}</td>
                <td>
                    <button class="btn btn-sm btn-primary deploy-btn" data-bs-toggle="modal" data-bs-target="#deployModal">Deploy</button>
                    <button class="btn btn-sm btn-secondary view-btn" data-bs-toggle="modal" data-bs-target="#infoModal">View</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        if (typeof window.updateModelsPagination === 'function') {
            window.updateModelsPagination();
        }
    }

    function updateStats(models) {
        const productionCount = models.filter(m => m.status === 'Production').length;
        const stagingCount = models.filter(m => m.status === 'Staging').length;
        const archivedCount = models.filter(m => m.status === 'Archived').length;
        
        const statProd = document.getElementById('stat-production');
        const statStaging = document.getElementById('stat-staging');
        const statArchived = document.getElementById('stat-archived');
        
        if (statProd) statProd.textContent = productionCount;
        if (statStaging) statStaging.textContent = stagingCount;
        if (statArchived) statArchived.textContent = archivedCount;
    }

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-btn')) {
            const row = e.target.closest('tr');
            if (row) {
                const model = allModels.find(m => m.id === row.getAttribute('data-id'));
                if (model) {
                    document.getElementById('info-model-name').textContent = model.name;
                    document.getElementById('info-model-version').textContent = model.version;
                    document.getElementById('info-model-status').textContent = model.status;
                    document.getElementById('info-experiment-link').href = `experiment-detail.html?id=${model.experimentId || ''}`;
                    document.getElementById('info-experiment-link').textContent = model.experimentId || '—';
                    
                    if (model.metrics) {
                        document.getElementById('info-metric-accuracy').textContent = model.metrics.accuracy?.toFixed(2) || '—';
                        document.getElementById('info-metric-precision').textContent = model.metrics.precision?.toFixed(2) || '—';
                        document.getElementById('info-metric-recall').textContent = model.metrics.recall?.toFixed(2) || '—';
                        document.getElementById('info-metric-f1').textContent = model.metrics.f1?.toFixed(3) || '—';
                    }
                }
            }
        }
        
        if (e.target.classList.contains('deploy-btn')) {
            const row = e.target.closest('tr');
            if (row) {
                const modelName = row.getAttribute('data-model-name');
                const modelVersion = row.getAttribute('data-model-version');
                const deployInput = document.getElementById('deploy-model-name');
                if (deployInput) {
                    deployInput.value = `${modelName} ${modelVersion}`;
                }
            }
        }

        if (e.target.classList.contains('delete-btn')) {
            const row = e.target.closest('tr');
            if (row) {
                const modelId = row.getAttribute('data-id');
                const modelName = row.getAttribute('data-model-name');
                
                const deleteIdInput = document.getElementById('delete-model-id');
                if (deleteIdInput) {
                    deleteIdInput.value = modelId;
                }
                
                const deleteModalBody = document.querySelector('#deleteModal .modal-body p');
                if (deleteModalBody) {
                    deleteModalBody.textContent = `Вы уверены, что хотите удалить модель "${modelName}"?`;
                }
            }
        }
    });

    const confirmAddModel = document.getElementById('confirm-add-model');
    if (confirmAddModel) {
        confirmAddModel.addEventListener('click', async function() {
            const name = document.getElementById('model-name')?.value;
            const version = document.getElementById('model-version')?.value;
            const experimentId = document.getElementById('experiment-select')?.value;
            const description = document.getElementById('model-description')?.value;
            const fileInput = document.getElementById('model-file')?.files[0];
            
            if (!name || !version) {
                alert('Заполните все обязательные поля!');
                return;
            }
            
            try {
                await api.post('/models', {
                    name,
                    version,
                    experimentId: experimentId || null,
                    description: description || '',
                    fileName: fileInput ? fileInput.name : null,
                    fileSize: fileInput ? fileInput.size : null,
                    status: 'Staging',
                    metric: 0,
                    date: new Date().toISOString().split('T')[0],
                    metrics: { accuracy: 0, precision: 0, recall: 0, f1: 0 }
                });
                
                if (experimentId) {
                    const expResponse = await api.get(`/experiments/${experimentId}`);
                    const experiment = expResponse.data;
                    
                    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
                    const newLog = `[${timestamp}] INFO: Model ${name} ${version} registered from this experiment`;
                    const updatedLogs = [...(experiment.logs || []), newLog];
                    
                    const newArtifact = {
                        name: fileInput ? fileInput.name : `${name}_${version}.pkl`,
                        type: 'Model',
                        size: fileInput ? `${(fileInput.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
                        date: new Date().toISOString().split('T')[0]
                    };
                    const updatedArtifacts = [...(experiment.artifacts || []), newArtifact];
                    
                    await api.patch(`/experiments/${experimentId}`, {
                        logs: updatedLogs,
                        artifacts: updatedArtifacts
                    });
                    
                    console.log('Эксперимент обновлён: добавлен лог и артефакт');
                }
                
                alert('Модель добавлена!');
                window.location.reload();
            } catch (error) {
                console.error('Ошибка добавления модели:', error);
                alert('Ошибка при добавлении модели');
            }
        });
    }

    const confirmDeploy = document.getElementById('confirm-deploy');
    if (confirmDeploy) {
        confirmDeploy.addEventListener('click', async function() {
            const modelNameInput = document.getElementById('deploy-model-name')?.value;
            const environment = document.getElementById('deploy-environment')?.value;
            
            if (!modelNameInput) {
                alert('Ошибка: имя модели не найдено');
                return;
            }

            const [name, version] = modelNameInput.split(' ');
            const modelToUpdate = allModels.find(m => m.name === name && m.version === version);

            if (!modelToUpdate) {
                alert('Ошибка: модель не найдена в списке');
                return;
            }

            try {
                await api.patch(`/models/${modelToUpdate.id}`, {
                    status: environment
                });

                console.log(`Модель ${modelToUpdate.id} обновлена: ${environment}`);
                
                if (environment === 'Archived') {
                    alert(`Модель "${modelNameInput}" архивирована`);
                } else {
                    alert(`Модель "${modelNameInput}" развернута в ${environment}`);
                }
                
                window.location.reload();
            } catch (error) {
                console.error('Ошибка обновления статуса:', error);
                alert('Ошибка при изменении статуса модели');
            }
        });
    }

    const confirmDeleteModel = document.getElementById('confirm-delete-model');
    if (confirmDeleteModel) {
        confirmDeleteModel.addEventListener('click', async function() {
            const deleteModelId = document.getElementById('delete-model-id')?.value;
            
            if (!deleteModelId) {
                alert('Ошибка: ID модели не найден');
                return;
            }

            try {
                await api.delete(`/models/${deleteModelId}`);
                
                console.log(`Модель ${deleteModelId} удалена`);
                alert('Модель успешно удалена');
                window.location.reload();
            } catch (error) {
                console.error('Ошибка удаления модели:', error);
                alert('Ошибка при удалении модели');
            }
        });
    }

    await loadModels();
    await loadExperimentsForSelect();
}

async function initDashboard() {
    const statsExperiments = document.getElementById('stat-total-experiments');
    const statsModels = document.getElementById('stat-models-registry');
    const statsRunning = document.getElementById('stat-running-now');
    const statsFiles = document.getElementById('stat-files-saved');
    const recentTbody = document.getElementById('recent-experiments-tbody');
    
    if (!statsExperiments && !recentTbody) return;
    
    let allExperiments = [];
    let allModels = [];
    
    async function loadDashboardData() {
        try {
            const [expResponse, modelResponse] = await Promise.all([
                api.get('/experiments'),
                api.get('/models')
            ]);
            
            allExperiments = expResponse.data;
            allModels = modelResponse.data;
            
            updateStats(allExperiments, allModels);
            renderRecentExperiments(allExperiments);
            loadExperimentsForUploadSelect();
        } catch (error) {
            console.error('Ошибка загрузки дашборда:', error);
            alert('Не удалось загрузить данные дашборда');
        }
    }
    
    function updateStats(experiments, models) {
        const totalExperiments = experiments.length;
        const modelsInRegistry = models.length;
        const runningNow = experiments.filter(e => e.status === 'Running').length;
        
        const filesSaved = experiments.reduce((sum, exp) => {
            return sum + (exp.artifacts?.length || 0);
        }, 0);
        
        if (statsExperiments) statsExperiments.textContent = totalExperiments;
        if (statsModels) statsModels.textContent = modelsInRegistry;
        if (statsRunning) statsRunning.textContent = runningNow;
        if (statsFiles) statsFiles.textContent = filesSaved;
    }
    
    function renderRecentExperiments(experiments) {
        if (!recentTbody) return;
        
        const recent = experiments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4);
        
        recentTbody.innerHTML = '';
        
        recent.forEach(exp => {
            const row = document.createElement('tr');
            const metricDisplay = exp.metric ? exp.metric.toFixed(2) + ' acc' : '—';
            
            row.innerHTML = `
                <td><a href="experiment-detail.html?id=${exp.id}">${exp.name}</a></td>
                <td>${exp.date}</td>
                <td>${metricDisplay}</td>
                <td>${exp.status}</td>
                <td>
                    <a href="experiment-detail.html?id=${exp.id}" class="btn btn-sm btn-primary">Просмотр</a>
                </td>
            `;
            
            recentTbody.appendChild(row);
        });
    }
    
    async function loadExperimentsForUploadSelect() {
        try {
            const response = await api.get('/experiments');
            const experiments = response.data;
            
            const select = document.getElementById('upload-experiment-select-modal');
            if (select) {
                select.innerHTML = '<option value="">Выберите эксперимент</option>';
                experiments.forEach(exp => {
                    const option = document.createElement('option');
                    option.value = exp.id;
                    option.textContent = exp.name;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки экспериментов для селекта:', error);
        }
    }
    
    const confirmNewExperimentModal = document.getElementById('confirm-new-experiment-modal');
    if (confirmNewExperimentModal) {
        confirmNewExperimentModal.addEventListener('click', async function() {
            const name = document.getElementById('experiment-name-modal')?.value;
            const modelType = document.getElementById('model-type-modal')?.value;
            
            if (!name) {
                alert('Введите название эксперимента');
                return;
            }
            
            try {
                await api.post('/experiments', {
                    name,
                    date: new Date().toISOString().split('T')[0],
                    metric: null,
                    status: 'Pending',
                    tags: [],
                    logs: [`[INFO] Experiment ${name} created`],
                    artifacts: [],
                    params: { model_type: modelType },
                    metrics: { accuracy: null, loss: null }
                });
                
                alert('Эксперимент создан!');
                window.location.reload();
            } catch (error) {
                console.error('Ошибка создания эксперимента:', error);
                alert('Ошибка при создании эксперимента');
            }
        });
    }

    const confirmUploadModelModal = document.getElementById('confirm-upload-model-modal');
    if (confirmUploadModelModal) {
        confirmUploadModelModal.addEventListener('click', async function() {
            const name = document.getElementById('upload-model-name-modal')?.value;
            const version = document.getElementById('upload-model-version-modal')?.value;
            const experimentId = document.getElementById('upload-experiment-select-modal')?.value;
            const description = document.getElementById('upload-model-description-modal')?.value;
            const fileInput = document.getElementById('upload-model-file-modal')?.files[0];
            
            if (!name || !version) {
                alert('Заполните название и версию модели');
                return;
            }
            
            try {
                await api.post('/models', {
                    name,
                    version,
                    experimentId: experimentId || null,
                    description: description || '',
                    fileName: fileInput ? fileInput.name : null,
                    fileSize: fileInput ? fileInput.size : null,
                    status: 'Staging',
                    metric: 0,
                    date: new Date().toISOString().split('T')[0],
                    metrics: { accuracy: 0, precision: 0, recall: 0, f1: 0 }
                });
                
                if (experimentId) {
                    const expResponse = await api.get(`/experiments/${experimentId}`);
                    const experiment = expResponse.data;
                    
                    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
                    const newLog = `[${timestamp}] INFO: Model ${name} ${version} registered from dashboard`;
                    const updatedLogs = [...(experiment.logs || []), newLog];
                    
                    const newArtifact = {
                        name: fileInput ? fileInput.name : `${name}_${version}.pkl`,
                        type: 'Model',
                        size: fileInput ? `${(fileInput.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
                        date: new Date().toISOString().split('T')[0]
                    };
                    const updatedArtifacts = [...(experiment.artifacts || []), newArtifact];
                    
                    await api.patch(`/experiments/${experimentId}`, {
                        logs: updatedLogs,
                        artifacts: updatedArtifacts
                    });
                    
                    console.log('Эксперимент обновлён: добавлен лог и артефакт');
                }
                
                alert('Модель загружена!');
                window.location.reload();
            } catch (error) {
                console.error('Ошибка загрузки модели:', error);
                alert('Ошибка при загрузке модели');
            }
        });
    }

    const downloadStatsBtn = document.getElementById('download-stats-btn');
    if (downloadStatsBtn) {
        downloadStatsBtn.addEventListener('click', downloadStats);
    }
    
    await loadDashboardData();
}

function downloadStats() {
    const totalExperiments = document.getElementById('stat-total-experiments')?.textContent || '0';
    const modelsInRegistry = document.getElementById('stat-models-registry')?.textContent || '0';
    const runningNow = document.getElementById('stat-running-now')?.textContent || '0';
    const filesSaved = document.getElementById('stat-files-saved')?.textContent || '0';
    
    const userEmail = localStorage.getItem('userEmail') || 'Не авторизован';
    const downloadDate = new Date().toLocaleString('ru-RU');
    
    const statsContent = `
=====================================
   ML Pipeline — Статистика дашборда
=====================================

Дата выгрузки: ${downloadDate}
Пользователь: ${userEmail}

-------------------------------------
              СТАТИСТИКА
-------------------------------------

Эксперименты:
   Всего запущено: ${totalExperiments}
   Запущено сейчас: ${runningNow}

Модели:
   В реестре: ${modelsInRegistry}

Файлы:
   Сохранено файлов: ${filesSaved}

-------------------------------------
           ИНФОРМАЦИЯ
-------------------------------------

Приложение: ML Pipeline
Версия: 1.0.0
Среда: Development
    `.trim();
    
    const blob = new Blob([statsContent], { type: 'text/plain;charset=utf-8' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ml-stats-${new Date().toISOString().split('T')[0]}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Статистика скачана');
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