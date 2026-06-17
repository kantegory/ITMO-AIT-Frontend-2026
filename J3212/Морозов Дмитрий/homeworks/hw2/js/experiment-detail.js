
function initTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-content-section').forEach(section => {
                section.classList.remove('active');
                section.hidden = true;
            });
            
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                target.classList.add('active');
                target.hidden = false;
            }
            
            tabButtons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
            this.setAttribute('aria-selected', 'true');
        });
    });
}


function showExperimentNotification(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type, 'experiment-error');
    } else {
        const container = document.getElementById('experiment-error');
        if (container) {
            container.textContent = message;
            container.className = `alert alert-${type} mt-3`;
            container.classList.remove('visually-hidden');
            container.focus?.();
        }
    }
}

async function initExperimentDetail() {
    const expNameEl = document.getElementById('exp-name');
    if (!expNameEl) return;
    
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
            showExperimentNotification('Не удалось загрузить данные эксперимента', 'danger');
            if (expNameEl) expNameEl.textContent = 'Ошибка загрузки данных';
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
            expStatus.className = 'badge'; 
    
            if (exp.status === 'Completed') {
                expStatus.classList.add('bg-success', 'text-white');
            } else if (exp.status === 'Running') {
                expStatus.classList.add('bg-warning', 'text-dark');
            } else if (exp.status === 'Failed') {
                expStatus.classList.add('bg-danger', 'text-white');
            } else {
                expStatus.classList.add('bg-secondary', 'text-white');
            }
        }
        if (expDate) expDate.textContent = exp.date || '—';
        
        const accuracy = document.getElementById('metric-accuracy');
        const loss = document.getElementById('metric-loss');
        
        if (accuracy) {
            const accValue = exp.metrics?.accuracy !== null ? exp.metrics.accuracy.toFixed(2) : '—';
            accuracy.textContent = accValue;
            accuracy.setAttribute('aria-label', `Точность: ${accValue === '—' ? 'не указана' : accValue}`);
        }
        if (loss) {
            const lossValue = exp.metrics?.loss !== null ? exp.metrics.loss.toFixed(2) : '—';
            loss.textContent = lossValue;
            loss.setAttribute('aria-label', `Функция потерь: ${lossValue === '—' ? 'не указана' : lossValue}`);
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
                            <a href="#" class="btn btn-sm btn-primary" 
                               aria-label="Скачать артефакт: ${escapeHtml(artifact.name)}">Скачать</a>
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
                        <th scope="row">${escapeHtml(key)}</th>
                        <td>${escapeHtml(String(value))}</td>
                    </tr>
                `).join('');
            } else {
                paramsTbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Параметры отсутствуют</td></tr>';
            }
        }
        
        const deleteIdInput = document.getElementById('delete-exp-id');
        const deleteNameEl = document.getElementById('delete-exp-name');
        if (deleteIdInput) deleteIdInput.value = exp.id;
        if (deleteNameEl) deleteNameEl.textContent = exp.name || 'этот';
        
        const cloneNameInput = document.getElementById('clone-name');
        if (cloneNameInput && exp.name) {
            cloneNameInput.value = exp.name + '_copy';
        }
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    const confirmDelete = document.getElementById('confirm-delete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', async function() {
            const deleteId = document.getElementById('delete-exp-id')?.value;
            
            if (!deleteId) {
                showExperimentNotification('Ошибка: ID эксперимента не найден', 'danger');
                return;
            }
            
            try {
                await api.delete(`/experiments/${deleteId}`);
                showExperimentNotification('Эксперимент удалён', 'success');
                setTimeout(() => {
                    window.location.href = 'experiments.html';
                }, 1500);
            } catch (error) {
                console.error('Ошибка удаления:', error);
                showExperimentNotification('Ошибка при удалении эксперимента', 'danger');
            }
        });
    }
    
    const confirmClone = document.getElementById('confirm-clone');
    if (confirmClone) {
        confirmClone.addEventListener('click', async function() {
            const newName = document.getElementById('clone-name')?.value?.trim();
            const description = document.getElementById('clone-description')?.value?.trim();
            
            if (!newName) {
                const nameInput = document.getElementById('clone-name');
                if (nameInput) {
                    nameInput.classList.add('is-invalid');
                    nameInput.setAttribute('aria-invalid', 'true');
                    nameInput.focus();
                }
                showExperimentNotification('Введите название для клонированного эксперимента', 'warning');
                return;
            }
            
            try {
                await api.post('/experiments', {
                    name: newName,
                    description: description || '',
                    date: new Date().toISOString().split('T')[0],
                    metric: experimentData?.metric || null,
                    status: 'Pending',
                    tags: experimentData?.tags || [],
                    logs: [`[INFO] Cloned from ${experimentData?.name || 'unknown'}`],
                    artifacts: [],
                    params: experimentData?.params || {},
                    metrics: experimentData?.metrics || { accuracy: null, loss: null }
                });
                
                showExperimentNotification('Эксперимент клонирован', 'success');
                setTimeout(() => {
                    window.location.href = 'experiments.html';
                }, 1500);
            } catch (error) {
                console.error('Ошибка клонирования:', error);
                showExperimentNotification('Ошибка при клонировании эксперимента', 'danger');
            }
        });
    }
    
    const deleteModal = document.getElementById('deleteModal');
    const cloneModal = document.getElementById('cloneModal');
    
    if (deleteModal) {
        deleteModal.addEventListener('shown.bs.modal', function() {
            document.getElementById('confirm-delete')?.focus();
        });
    }
    
    if (cloneModal) {
        cloneModal.addEventListener('shown.bs.modal', function() {
            const nameInput = document.getElementById('clone-name');
            if (nameInput) {
                nameInput.focus();
                nameInput.select?.();
            }
        });
        
        const cloneNameInput = document.getElementById('clone-name');
        if (cloneNameInput) {
            cloneNameInput.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                this.setAttribute('aria-invalid', 'false');
            });
        }
    }
    
    const tabs = document.querySelectorAll('.nav-pills .nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const direction = e.key === 'ArrowRight' ? 1 : -1;
                const currentIndex = Array.from(tabs).indexOf(this);
                const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
                tabs[nextIndex].focus();
            }
        });
    });
    
    await loadExperiment();
}

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initExperimentDetail();
});