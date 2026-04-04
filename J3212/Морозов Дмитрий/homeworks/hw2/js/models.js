function showNotification(message, type = 'info', containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Контейнер уведомлений #${containerId} не найден`);
        return;
    }
    
    container.textContent = '';
    container.className = `alert alert-${type} mt-3`;
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'assertive');
    container.setAttribute('aria-atomic', 'true');
    
    container.textContent = message;
    container.classList.remove('visually-hidden');
    container.focus?.();
    
    if (type === 'success') {
        setTimeout(() => {
            container.classList.add('visually-hidden');
            container.textContent = '';
        }, 5000);
    }
}

async function initModels() {
    const tableBody = document.querySelector('#models-tbody');
    if (!tableBody) return;
    
    let allModels = [];
    let allExperiments = [];

    async function loadModels() {
        try {
            const response = await api.get('/models');
            allModels = response.data;
            renderModels(allModels);
            updateStats(allModels);
        } catch (error) {
            console.error('Ошибка загрузки моделей:', error);
            showNotification('Не удалось загрузить модели', 'danger', 'models-error');
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
                    <button class="btn btn-sm btn-primary deploy-btn" data-bs-toggle="modal" data-bs-target="#deployModal" 
                            aria-label="Развернуть модель ${model.name}">Deploy</button>
                    <button class="btn btn-sm btn-secondary view-btn" data-bs-toggle="modal" data-bs-target="#infoModal" 
                            aria-label="Посмотреть информацию о модели ${model.name}">View</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" 
                            aria-label="Удалить модель ${model.name}">Delete</button>
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
                    
                    const expLink = document.getElementById('info-experiment-link');
                    expLink.href = `experiment-detail.html?id=${model.experimentId || ''}`;
                    expLink.textContent = model.experimentId || '—';
                    
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
                
                const deleteNameEl = document.getElementById('delete-model-name');
                if (deleteNameEl) {
                    deleteNameEl.textContent = `"${modelName}"`;
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
                showNotification('Заполните все обязательные поля!', 'warning', 'models-error');
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
                    const newLog = `[${timestamp}] INFO: Model ${name} ${version} registered`;
                    
                    await api.patch(`/experiments/${experimentId}`, {
                        logs: [...(experiment.logs || []), newLog],
                        artifacts: [...(experiment.artifacts || []), {
                            name: fileInput ? fileInput.name : `${name}_${version}.pkl`,
                            type: 'Model',
                            size: fileInput ? `${(fileInput.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
                            date: new Date().toISOString().split('T')[0]
                        }]
                    });
                }
                
                showNotification('Модель добавлена!', 'success', 'models-error');
                const modal = bootstrap.Modal.getInstance(document.getElementById('addModelModal'));
                if (modal) modal.hide();
                
                await loadModels();
            } catch (error) {
                console.error('Ошибка добавления модели:', error);
                showNotification('Ошибка при добавлении модели', 'danger', 'models-error');
            }
        });
    }

    const confirmDeploy = document.getElementById('confirm-deploy');
    if (confirmDeploy) {
        confirmDeploy.addEventListener('click', async function() {
            const modelNameInput = document.getElementById('deploy-model-name')?.value;
            const environment = document.getElementById('deploy-environment')?.value;
            
            if (!modelNameInput) {
                showNotification('Ошибка: имя модели не найдено', 'danger', 'models-error');
                return;
            }

            const [name, version] = modelNameInput.split(' ');
            const modelToUpdate = allModels.find(m => m.name === name && m.version === version);

            if (!modelToUpdate) {
                showNotification('Ошибка: модель не найдена в списке', 'danger', 'models-error');
                return;
            }

            try {
                await api.patch(`/models/${modelToUpdate.id}`, { status: environment });
                
                let msg = environment === 'Archived' 
                    ? `Модель "${modelNameInput}" архивирована` 
                    : `Модель "${modelNameInput}" развернута в ${environment}`;
                
                showNotification(msg, 'success', 'models-error');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('deployModal'));
                if (modal) modal.hide();
                
                await loadModels();
            } catch (error) {
                console.error('Ошибка обновления статуса:', error);
                showNotification('Ошибка при изменении статуса модели', 'danger', 'models-error');
            }
        });
    }

    const confirmDeleteModel = document.getElementById('confirm-delete-model');
    if (confirmDeleteModel) {
        confirmDeleteModel.addEventListener('click', async function() {
            const deleteModelId = document.getElementById('delete-model-id')?.value;
            
            if (!deleteModelId) {
                showNotification('Ошибка: ID модели не найден', 'danger', 'models-error');
                return;
            }

            try {
                await api.delete(`/models/${deleteModelId}`);
                showNotification('Модель успешно удалена', 'success', 'models-error');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                if (modal) modal.hide();
                
                await loadModels();
            } catch (error) {
                console.error('Ошибка удаления модели:', error);
                showNotification('Ошибка при удалении модели', 'danger', 'models-error');
            }
        });
    }

    const addModal = document.getElementById('addModelModal');
    if (addModal) {
        addModal.addEventListener('shown.bs.modal', () => document.getElementById('model-name')?.focus());
    }
    
    const deployModalEl = document.getElementById('deployModal');
    if (deployModalEl) {
        deployModalEl.addEventListener('shown.bs.modal', () => document.getElementById('deploy-environment')?.focus());
    }

    await loadModels();
    await loadExperimentsForSelect();
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
            link.removeAttribute('aria-current');
            
            const linkPage = parseInt(link.getAttribute('data-page'));
            if (linkPage === currentPage) {
                parent.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) prevBtn.classList.toggle('disabled', currentPage === 1);
        if (nextBtn) nextBtn.classList.toggle('disabled', currentPage === totalPages);
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
    updatePagination();
}

document.addEventListener('DOMContentLoaded', function() {
    initModels();
    initModelsPagination();
});