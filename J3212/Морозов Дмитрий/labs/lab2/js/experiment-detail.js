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

document.addEventListener('DOMContentLoaded', function() {
    initExperimentDetail();
});