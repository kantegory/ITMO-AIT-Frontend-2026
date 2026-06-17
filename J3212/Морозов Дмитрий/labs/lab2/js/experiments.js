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


document.addEventListener('DOMContentLoaded', function() {
    initExperiments();
    initExperimentsPagination();
});