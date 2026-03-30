const dictionaries = {
    task: { 'cv': 'Computer Vision', 'nlp': 'NLP', 'audio': 'Audio', 'rl': 'Reinforcement Learning', 'img_clf': 'Image Search', 'obj_det': 'Object Detection', 'text_gen': 'Text Generation', 'translation': 'Translation' },
    framework: { 'pytorch': 'PyTorch', 'tensorflow': 'TensorFlow', 'jax': 'JAX' },
    license: { 'mit': 'MIT', 'apache-2.0': 'Apache 2.0', 'gpl-3.0': 'GPL-3.0', 'cc-by-4.0': 'CC BY 4.0', 'cc0': 'CC0' },
    modality: { 'images': 'Изображения', 'text': 'Текст', 'tabular': 'Таблицы', 'audio-video': 'Аудио/Видео' }
};

function applyProfileStats(user) {
    const getCount = (arr) => Array.isArray(arr) ? arr.length : 0;

    const modelsCountNode = document.getElementById('profileModelsCount');
    const datasetsCountNode = document.getElementById('profileDatasetsCount');
    const ratingCountNode = document.getElementById('profileRatingCount');
    const subscriptionsCountNode = document.getElementById('profileSubscriptionsCount');

    if (modelsCountNode) {
        modelsCountNode.innerText = String(getCount(user.modelIds));
    }

    if (datasetsCountNode) {
        datasetsCountNode.innerText = String(getCount(user.datasetIds));
    }

    if (ratingCountNode) {
        ratingCountNode.innerText = String(Number(user.starsCount ?? 0));
    }
    
    const subsCount = Array.isArray(user.subscriptions) ? user.subscriptions.length : Number(user.subscriptionsCount ?? 0);
    if (subscriptionsCountNode) {
        subscriptionsCountNode.innerText = String(subsCount);
    }
}

function renderProfileCards(items, type, gridId, emptyId) {
    const grid = document.getElementById(gridId);
    const emptyState = document.getElementById(emptyId);
    if (!grid) return;

    const isEmpty = !items || items.length === 0;
    
    grid.classList.toggle('d-none', isEmpty);
    if (emptyState) emptyState.classList.toggle('d-none', !isEmpty);

    if (isEmpty) {
        grid.innerHTML = '';
        return;
    }

    const isDataset = type === 'dataset';
    const icon = isDataset ? 'bi-database' : 'bi-cpu';

    grid.innerHTML = items.map(item => {
        let badges = item.task ? `<span class="badge bg-primary flex-shrink-0">${dictionaries.task[item.task] || item.task}</span>` : '';
        
        if (isDataset) {
            if (item.modality) badges += `<span class="badge bg-success flex-shrink-0">${dictionaries.modality[item.modality] || item.modality}</span>`;
            if (item.format) badges += `<span class="badge bg-info text-dark flex-shrink-0">${item.format.toUpperCase()}</span>`;
        }
        else {
            if (item.framework) badges += `<span class="badge bg-secondary flex-shrink-0">${dictionaries.framework[item.framework] || item.framework}</span>`;
        }
        
        if (item.license) badges += `<span class="badge border text-secondary bg-light flex-shrink-0">${dictionaries.license[item.license] || item.license}</span>`;

        return `
            <div class="col-12 col-md-6 col-xl-4">
                <article class="card h-100 border-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <a href="${type}_page.html?id=${item.id}" class="text-decoration-none text-dark h5 mb-0 stretched-link">${item.name}</a>
                            <i class="bi ${icon} text-muted"></i>
                        </div>
                        <div class="mb-2 d-flex flex-wrap gap-2">${badges}</div>
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
    }).join('');
}

async function fetchItemsByIds(resource, ids) {
    if (!ids || ids.length === 0) return [];

    const params = new URLSearchParams();
    ids.forEach(id => params.append('id', String(id)));

    const { data } = await api.get(`/${resource}`, { params });
    const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
    const itemsById = new Map(dataArray.map(item => [Number(item.id), item]));
    const orderedItems = ids.map(id => itemsById.get(Number(id))).filter(Boolean);

    return orderedItems;
}

async function loadProfilePageData() {
    const storedUser = window.authSession?.getStoredUser();

    try {
        const response = await api.get("/users/" + storedUser.id);
        const user = response.data;
        applyProfileStats(user);

        const [models, datasets] = await Promise.all([
            fetchItemsByIds('models', user.modelIds),
            fetchItemsByIds('datasets', user.datasetIds)
        ]);

        renderProfileCards(models, 'model', 'profileModelsGrid', 'profileModelsEmptyState');
        renderProfileCards(datasets, 'dataset', 'profileDatasetsGrid', 'profileDatasetsEmptyState');
    }
    catch (error) {
        applyProfileStats(storedUser || {});
        renderProfileCards([], 'model', 'profileModelsGrid', 'profileModelsEmptyState');
        renderProfileCards([], 'dataset', 'profileDatasetsGrid', 'profileDatasetsEmptyState');
    }
}

window.addEventListener('DOMContentLoaded', loadProfilePageData);