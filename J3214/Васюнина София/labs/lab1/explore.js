let allModels = [];
let filteredModels = [];
const itemsPerPage = 6;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetchModels();
    setupSidebarFilters();
    setupSearch();
});

// get data wuth async func
async function fetchModels() {
    const spinner = document.getElementById('loading-spinner');

    try {
        const response = await fetch('https://huggingface.co/api/models?sort=downloads&direction=-1&limit=60');

        if(!response.ok){
            throw new Error(`HTTP error >:( status: ${response.status}`);
        }
        
        allModels = await response.json();
        filteredModels = [...allModels];

        spinner.style.display = 'none';

        
        setupTagFilter();
        renderPage(1);
    } catch (error) {
        console.error('error while loading models:', error);
        const container = document.getElementById('models-container');
        if (container) {
            container.innerHTML = `<div class="col-12 text-center py-5 text-danger">Не удалось загрузить модели. Проверьте консоль F12.</div>`;
        }
    }
}

// setting filters
function setupSidebarFilters() {
    const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
    const resetBtn = document.querySelector('.filter-sidebar .btn-outline-info');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = false);
            const tagFilter = document.getElementById('tag-filter');
            if (tagFilter) tagFilter.value = 'all';
            applyFilters();
        });
    }
}

function setupTagFilter() {
    const filterSelect = document.getElementById('tag-filter');
    if (!filterSelect) return;

    const tags = new Set();
    allModels.forEach(model => {
        if (model.pipeline_tag) {
            tags.add(model.pipeline_tag);
        }
    });

    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag.replace(/-/g, ' ');
        option.classList.add('text-dark');
        filterSelect.appendChild(option);
    });
    
    filterSelect.addEventListener('change', applyFilters);
}

function applyFilters() {
    const nlp = document.getElementById('nlp')?.checked;
    const cv = document.getElementById('cv')?.checked;
    const audio = document.getElementById('audio')?.checked;
    const dropdownTag = document.getElementById('tag-filter')?.value;

    const nlpTags = ['text-generation', 'text-classification', 'token-classification', 'translation', 'summarization', 'question-answering', 'fill-mask', 'conversational'];
    const cvTags = ['image-classification', 'image-segmentation', 'object-detection', 'image-to-image', 'text-to-image', 'depth-estimation'];
    const audioTags = ['automatic-speech-recognition', 'audio-classification', 'text-to-speech', 'text-to-audio'];

    let activeCategoryTags = [];
    if (nlp) activeCategoryTags.push(...nlpTags);
    if (cv) activeCategoryTags.push(...cvTags);
    if (audio) activeCategoryTags.push(...audioTags);

    filteredModels = allModels.filter(model => {
        const matchesCategory = activeCategoryTags.length === 0 || activeCategoryTags.includes(model.pipeline_tag);
        const matchesDropdown = !dropdownTag || dropdownTag === 'all' || model.pipeline_tag === dropdownTag;

        return matchesCategory && matchesDropdown;
    });

    renderPage(1);
}

// html rendering
function renderPage(page) {
    currentPage = page;
    const container = document.getElementById('models-container');

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const modelsToRender = filteredModels.slice(start, end);

    if (modelsToRender.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5 text-white-50">No models found matching your filters.</div>`;
        updatePaginationUI();
        return;
    }

    let cardsHTML = '';

    modelsToRender.forEach(model => {
        const modelId = model.id || 'unknown/model';
        const modelName = modelId.split('/').pop();
        const author = model.author || 'Community';
        const task = model.pipeline_tag || 'Generic Model';
        const isLiked = (JSON.parse(localStorage.getItem('likedModels')) || []).some(m => m.id === model.id);
        let downloads = model.downloads || 0;
        if (downloads >= 1000) {
            downloads = (downloads / 1000).toFixed(1) + 'k';
        }
        
        cardsHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 bg-transparent border-secondary text-white" style="background-color: var(--card-bg) !important;">
                    <div class="card-body">
                        <h5 class="card-title">${modelName}</h5>
                        <p class="card-text small text-muted">Author: ${author}</p>
                        <span class="badge bg-secondary mb-3">${task}</span>
                        <p class="card-text">⭐ ${downloads} downloads</p>
                        <button onclick="viewDetails('${modelId}')" class="btn btn-outline-dark btn-sm">View Details</button>
                        <button class="btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-danger'}" 
                                onclick="toggleLike('${model.id.replace(/'/g, "\\'")}')">
                            ${isLiked ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = cardsHTML;
    updatePaginationUI();
}

window.viewDetails = function(modelId) {
    const model = allModels.find(m => m.id === modelId);
    if (model) {
        localStorage.setItem('selectedModel', JSON.stringify(model));
        window.location.href = 'item-card.html';
    }
};

window.changePage = function(page) {
    const maxPage = Math.ceil(filteredModels.length / itemsPerPage);
    if (page >= 1 && page <= maxPage) {
        renderPage(page);
    }
};

window.toggleLike = function(modelId) {
    const model = allModels.find(m => m.id === modelId);
    let liked = JSON.parse(localStorage.getItem('likedModels')) || [];
    
    const index = liked.findIndex(m => m.id === modelId);
    if (index > -1) {
        liked.splice(index, 1);
    } else {
        liked.push(model);
    }
    
    localStorage.setItem('likedModels', JSON.stringify(liked));
    renderPage(currentPage);
};

function updatePaginationUI() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const maxPage = Math.ceil(filteredModels.length / itemsPerPage) || 1;

    let paginationHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link bg-transparent text-white border-secondary" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
        </li>
    `;

    for (let i = 1; i <= maxPage; i++) {
        if (i === 1 || i === maxPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link bg-transparent text-white border-secondary" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link bg-transparent text-white border-secondary">...</span></li>`;
        }
    }

    paginationHTML += `
        <li class="page-item ${currentPage === maxPage ? 'disabled' : ''}">
            <a class="page-link bg-transparent text-white border-secondary" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// search setup
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();

        if (query == "") {
            filteredModels = [...allModels];
        } else {
            filteredModels = allModels.filter(model => {
                const name = (model.id || "").toLowerCase();
                const author = (model.author || "").toLowerCase();
                const description = (model.pipeline_tag || "").toLowerCase();
                const tags = (model.tags || []).join(" ").toLowerCase();

                return name.includes(query) || 
                       author.includes(query) || 
                       description.includes(query) || 
                       tags.includes(query);
            });
        }

        currentPage = 1;
        renderPage(1);
    }

    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}