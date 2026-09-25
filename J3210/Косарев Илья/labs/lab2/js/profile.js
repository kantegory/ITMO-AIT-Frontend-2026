const dictionaries = {
    task: { 'cv': 'Computer Vision', 'nlp': 'NLP', 'audio': 'Audio', 'rl': 'Reinforcement Learning', 'img_clf': 'Image Search', 'obj_det': 'Object Detection', 'text_gen': 'Text Generation', 'translation': 'Translation' },
    framework: { 'pytorch': 'PyTorch', 'tensorflow': 'TensorFlow', 'jax': 'JAX' },
    license: { 'mit': 'MIT', 'apache-2.0': 'Apache 2.0', 'gpl-3.0': 'GPL-3.0', 'cc-by-4.0': 'CC BY 4.0', 'cc0': 'CC0' },
    modality: { 'images': 'Изображения', 'text': 'Текст', 'tabular': 'Таблицы', 'audio-video': 'Аудио/Видео' }
};

function applyProfileStats(user) {
    document.getElementById('profileModelsCount').innerText = String((user.modelIds || []).length);
    document.getElementById('profileDatasetsCount').innerText = String((user.datasetIds || []).length);
    document.getElementById('profileRatingCount').innerText = String(user.starsCount || 0);
    document.getElementById('profileSubscriptionsCount').innerText = String((user.subscriptions || []).length);
}

function renderProfileCards(items, type, gridId, emptyId) {
    const grid = document.getElementById(gridId);
    const emptyState = document.getElementById(emptyId);
    const isEmpty = items.length === 0;

    grid.classList.toggle('d-none', isEmpty);
    emptyState.classList.toggle('d-none', !isEmpty);

    if (isEmpty) {
        grid.innerHTML = '';
        return;
    }

    const isDataset = type === 'dataset';
    const iconId = isDataset ? 'database' : 'cpu';

    grid.innerHTML = items.map((item) => {
        let badges = item.task ? `<span class="badge bg-primary flex-shrink-0">${dictionaries.task[item.task] || item.task}</span>` : '';

        if (isDataset) {
            if (item.modality) badges += `<span class="badge bg-success flex-shrink-0">${dictionaries.modality[item.modality]}</span>`;
            if (item.format) badges += `<span class="badge bg-info text-contrast flex-shrink-0">${item.format}</span>`;
        } 
        else {
            if (item.framework) badges += `<span class="badge bg-secondary flex-shrink-0">${dictionaries.framework[item.framework]}</span>`;
        }
        
        if (item.license) badges += `<span class="badge border border-secondary text-contrast flex-shrink-0">${dictionaries.license[item.license]}</span>`;

        return `
            <div class="col-12 col-md-6 col-xl-4">
                <article class="card h-100 border-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <a href="${type}_page.html?id=${item.id}" class="text-decoration-none text-contrast h5 mb-0 stretched-link">${item.name}</a>
                            <svg class="svg-icon text-blunted" aria-hidden="true"><use href="icons.svg#${iconId}"></use></svg>
                        </div>
                        <div class="mb-2 d-flex flex-wrap gap-2">${badges}</div>
                        <p class="card-text text-blunted small">${item.description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-end align-items-center">
                        <small class="text-blunted me-2"><svg class="svg-icon" aria-hidden="true"><use href="icons.svg#eye-fill"></use></svg> ${item.views}</small>
                        <small class="text-blunted me-2"><svg class="svg-icon" aria-hidden="true"><use href="icons.svg#chat-left-text-fill"></use></svg> ${item.comments}</small>
                        <small class="text-blunted me-2"><svg class="svg-icon" aria-hidden="true"><use href="icons.svg#diagram-3-fill"></use></svg> ${item.forks}</small>
                        <small class="text-blunted"><svg class="svg-icon text-warning" aria-hidden="true"><use href="icons.svg#star-fill"></use></svg> ${item.stars}</small>
                    </div>
                </article>
            </div>
        `;
    }).join('');
}

async function fetchItemsByIds(resource, ids) {
    if (ids.length === 0) return [];

    const params = new URLSearchParams();
    ids.forEach((id) => params.append('id', String(id)));

    const response = await api.get(`/${resource}`, { params });
    const items = response.data;
    const itemsById = new Map(items.map((item) => [Number(item.id), item]));

    return ids.map((id) => itemsById.get(Number(id))).filter(Boolean);
}

async function loadProfilePageData() {
    const storedUser = window.authSession.getStoredUser();
    const userResponse = await api.get(`/users/${storedUser.id}`);
    const user = userResponse.data;

    applyProfileStats(user);

    const models = await fetchItemsByIds('models', user.modelIds || []);
    const datasets = await fetchItemsByIds('datasets', user.datasetIds || []);

    renderProfileCards(models, 'model', 'profileModelsGrid', 'profileModelsEmptyState');
    renderProfileCards(datasets, 'dataset', 'profileDatasetsGrid', 'profileDatasetsEmptyState');
}

window.addEventListener('DOMContentLoaded', loadProfilePageData);