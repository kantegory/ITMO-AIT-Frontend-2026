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


document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});