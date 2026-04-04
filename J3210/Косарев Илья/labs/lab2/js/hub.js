const resultsGrid = document.getElementById('resultsGrid');
const searchResultsCount = document.getElementById('searchResultsCount');
const hubSearchForm = document.getElementById('hubSearchForm');
const searchInput = document.getElementById('searchInput');
const filtersForm = document.getElementById('filtersForm');
const applyFiltersButton = document.getElementById('applyFilters');
const activeFilterChips = document.getElementById('activeFilterChips');

const dictionaries = {
    task: { 'cv': 'Computer Vision', 'nlp': 'NLP', 'audio': 'Audio', 'rl': 'Reinforcement Learning', 'img_clf': 'Image Search', 'obj_det': 'Object Detection', 'text_gen': 'Text Generation', 'translation': 'Translation' },
    framework: { 'pytorch': 'PyTorch', 'tensorflow': 'TensorFlow', 'jax': 'JAX' },
    license: { 'mit': 'MIT', 'apache-2.0': 'Apache 2.0', 'gpl-3.0': 'GPL-3.0', 'cc-by-4.0': 'CC BY 4.0', 'cc0': 'CC0' },
    modality: { 'images': 'Изображения', 'text': 'Текст', 'tabular': 'Таблицы', 'audio-video': 'Аудио/Видео' }
};

const fieldMap = {
    modelTask: { queryKey: 'task', dict: dictionaries.task, multi: false },
    modelFramework: { queryKey: 'framework_like', dict: dictionaries.framework, multi: true },
    modelLicense: { queryKey: 'license_like', dict: dictionaries.license, multi: true },
    datasetTask: { queryKey: 'task', dict: dictionaries.task, multi: false },
    datasetModality: { queryKey: 'modality_like', dict: dictionaries.modality, multi: true },
    datasetLicense: { queryKey: 'license_like', dict: dictionaries.license, multi: true }
};

function getHubContext() {
    const isDataset = document.getElementById('filter-datasets-tab').classList.contains('active');
    return {
        isDataset,
        endpoint: isDataset ? 'datasets' : 'models',
        itemType: isDataset ? 'dataset' : 'model',
        panelSelector: isDataset ? '#filter-datasets' : '#filter-models'
    };
}

function buildQueryAndChips(ctx) {
    const params = new URLSearchParams();
    const chips = [];

    const query = searchInput.value.trim();
    if (query) {
        params.append('q', query);
        chips.push({ label: `Поиск: ${query}`, name: 'q', value: query });
    }

    const groupedFilters = {};
    const inputs = document.querySelectorAll(`${ctx.panelSelector} input:checked, ${ctx.panelSelector} select`);

    inputs.forEach((input) => {
        if (!input.value) return;
        if (!groupedFilters[input.name]) groupedFilters[input.name] = [];
        groupedFilters[input.name].push(input.value);
    });

    Object.entries(groupedFilters).forEach(([name, values]) => {
        const cfg = fieldMap[name];
        params.append(cfg.queryKey, cfg.multi ? `^(${values.join('|')})$` : values[0]);
        values.forEach((value) => {
            chips.push({ label: cfg.dict[value] || value, name, value });
        });
    });

    return { params, chips };
}

function getCardHtml(item, type) {
    const isDataset = type === 'dataset';
    const iconClass = isDataset ? 'bi-database' : 'bi-cpu';
    const pageUrl = `${type}_page.html?id=${item.id}`;

    const taskBadge = item.task ? `<span class="badge bg-primary flex-shrink-0">${dictionaries.task[item.task] || item.task}</span>` : '';
    const licenseBadge = item.license ? `<span class="badge border text-secondary bg-light flex-shrink-0">${dictionaries.license[item.license] || item.license}</span>` : '';

    let extraBadges = '';
    if (isDataset) {
        if (item.modality) extraBadges += `<span class="badge bg-success flex-shrink-0">${dictionaries.modality[item.modality] || item.modality}</span>`;
        if (item.format) extraBadges += `<span class="badge bg-info text-dark flex-shrink-0">${item.format.toUpperCase()}</span>`;
        if (item.size_gb != null) extraBadges += `<span class="badge border text-dark bg-white flex-shrink-0">${item.size_gb} GB</span>`;
    } else {
        if (item.framework) extraBadges += `<span class="badge bg-secondary flex-shrink-0">${dictionaries.framework[item.framework] || item.framework}</span>`;
    }

    return `
        <div class="col-12 col-md-6 col-xl-4">
            <article class="card h-100 border-2">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <a href="${pageUrl}" class="text-decoration-none text-dark h5 mb-0 stretched-link">${item.name}</a>
                        <i class="bi ${iconClass} text-muted"></i>
                    </div>
                    <div class="mb-2 d-flex flex-wrap gap-2">${taskBadge} ${extraBadges} ${licenseBadge}</div>
                    <p class="card-text text-muted small">${item.description || 'Описание отсутствует'}</p>
                </div>
                <div class="card-footer bg-white d-flex justify-content-end align-items-center">
                    <small class="text-muted me-2"><i class="bi bi-eye-fill"></i> ${item.views || 0}</small>
                    <small class="text-muted me-2"><i class="bi bi-chat-left-text-fill"></i> ${item.comments || 0}</small>
                    <small class="text-muted me-2"><i class="bi bi-diagram-3-fill"></i> ${item.forks || 0}</small>
                    <small class="text-muted"><i class="bi bi-star-fill text-warning"></i> ${item.stars || 0}</small>
                </div>
            </article>
        </div>
    `;
}

async function loadHubData() {
    const ctx = getHubContext();
    const queryData = buildQueryAndChips(ctx);
    renderChips(queryData.chips);

    try {
        const response = await api.get(`/${ctx.endpoint}`, { params: queryData.params });
        const data = response.data;
        const typeLabel = ctx.isDataset ? 'датасетов' : 'моделей';

        searchResultsCount.textContent = `Найдено: ${data.length} ${typeLabel}`;

        if (!data.length) {
            resultsGrid.innerHTML = '<div class="col-12"><p class="text-muted fs-5">По вашему запросу ничего не найдено.</p></div>';
            return;
        }

        resultsGrid.innerHTML = data.map((item) => getCardHtml(item, ctx.itemType)).join('');
    } catch (error) {
        resultsGrid.innerHTML = '<div class="col-12"><p class="text-danger">Ошибка подключения к серверу.</p></div>';
    }
}

function renderChips(chips) {
    if (chips.length === 0) {
        activeFilterChips.innerHTML = '<span class="text-muted">Нет активных фильтров</span>';
        return;
    }

    activeFilterChips.innerHTML = chips.map(chip => `
        <span class="badge rounded-pill text-bg-primary d-flex align-items-center gap-1 flex-shrink-0 py-2 px-3 fs-6 fw-normal">
            ${chip.label}
            <button type="button" class="btn btn-link p-0 border-0 text-white filter-chip-remove" 
                    data-name="${chip.name}" data-value="${chip.value}" aria-label="Удалить фильтр">
                <i class="bi bi-x-lg ms-2"></i>
            </button>
        </span>
    `).join('');
}
hubSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loadHubData();
});

applyFiltersButton.addEventListener('click', loadHubData);

filtersForm.addEventListener('reset', () => {
    setTimeout(loadHubData, 0); 
});

activeFilterChips.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.filter-chip-remove');
    if (!removeBtn) return;

    const { name, value } = removeBtn.dataset;

    if (name === 'q') {
        searchInput.value = '';
    } else {
        const input = document.querySelector(`[name="${name}"][value="${value}"], select[name="${name}"]`);
        if (input.type === 'checkbox') input.checked = false;
        else input.value = '';
    }

    loadHubData();
});

window.addEventListener('DOMContentLoaded', loadHubData);