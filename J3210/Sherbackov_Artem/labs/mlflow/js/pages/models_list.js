import api from '../api.js';
import { getRegisteredModels, createRegisteredModel } from '../models.js';

let allModels = [];
let selectedIds = new Set();

export async function initModelsListPage() {
    const tableBody = document.getElementById('modelsTableBody');
    if (!tableBody) return;

    await refreshModelsTable();
    setupEventListeners();
}

async function refreshModelsTable() {
    allModels = await getRegisteredModels();
    selectedIds.clear();

    const masterCheckbox = document.getElementById('selectAllModels');
    if (masterCheckbox) masterCheckbox.checked = false;

    applyFilters();
    fillTagFilter();
    toggleDeleteButton();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchModelsInput');
    const tagSelect = document.getElementById('tagModelsFilter');
    const deleteBtn = document.getElementById('deleteModelsBtn');
    const masterCheckbox = document.getElementById('selectAllModels');
    const createModelForm = document.getElementById('createModelForm');
    const confirmDeleteBtn = document.getElementById('confirmDeleteModelsBtn');

    searchInput?.addEventListener('input', () => applyFilters());
    tagSelect?.addEventListener('change', () => applyFilters());

    createModelForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('newModelName').value;
        const description = document.getElementById('newModelDescription').value;

        if (!name) return alert('Please fill in the model name');

        try {
            await createRegisteredModel(name, description);
            await refreshModelsTable();
            
            const modalEl = document.getElementById('createModelModal');
            bootstrap.Modal.getInstance(modalEl).hide();
            createModelForm.reset();
        } catch (error) {
            console.error('Failed to create model:', error);
        }
    });

    masterCheckbox?.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const visibleCheckboxes = document.querySelectorAll('.row-checkbox');
        visibleCheckboxes.forEach(cb => {
            cb.checked = isChecked;
            handleSelect(cb.value, isChecked);
        });
        toggleDeleteButton();
    });

    deleteBtn?.addEventListener('click', () => {
        if (selectedIds.size === 0) return;
        document.getElementById('deleteModelsCount').textContent = selectedIds.size;
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModelsConfirmModal'));
        deleteModal.show();
    });

    confirmDeleteBtn?.addEventListener('click', async () => {
        try {
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.textContent = 'Deleting...';

            for (let id of selectedIds) {
                await api.delete(`/660/modelss/${id}`);
            }

            const modalElement = document.getElementById('deleteModelsConfirmModal');
            bootstrap.Modal.getInstance(modalElement).hide();
            
            await refreshModelsTable();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete. Check console/permissions.');
        } finally {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Delete';
        }
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchModelsInput').value.toLowerCase();
    const selectedTag = document.getElementById('tagModelsFilter').value;

    const filtered = allModels.filter(model => {
        const matchesName = model.name.toLowerCase().includes(searchTerm);
        const matchesTag = (selectedTag === 'All') || (model.tags && model.tags.includes(selectedTag));
        return matchesName && matchesTag;
    });

    renderModelsTable(filtered);
}

function fillTagFilter() {
    const tagSelect = document.getElementById('tagModelsFilter');
    if (!tagSelect) return;
    
    const tags = new Set();
    allModels.forEach(model => model.tags?.forEach(t => tags.add(t)));

    let options = '<option selected value="All">All</option>';
    tags.forEach(tag => options += `<option value="${tag}">${tag}</option>`);
    tagSelect.innerHTML = options;
}

function renderModelsTable(list) {
    const tableBody = document.getElementById('modelsTableBody');
    const statsLabel = document.getElementById('modelsStats');

    if (statsLabel) {
        statsLabel.textContent = `Showing ${list.length > 0 ? 1 : 0}-${list.length} of ${list.length} models`;
    }

    if (list.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No models found</td></tr>';
        return;
    }

    tableBody.innerHTML = list.map(model => `
        <tr>
            <td>
                <input class="form-check-input row-checkbox" type="checkbox" value="${model.id}" ${selectedIds.has(model.id.toString()) ? 'checked' : ''}>
            </td>
            <td>
                <a href="model_entity.html?id=${model.id}" class="text-decoration-none fw-semibold">
                    ${model.name}
                </a>
            </td>
            <td>${model.version || 'v1.0'}</td>
            <td><span class="badge bg-success">Production</span></td>
            <td>${model.author || 'Anonymous'}</td>
            <td>${new Date(model.createdAt).toLocaleDateString()}</td>
            <td>
                ${(model.tags || []).map(t => `<span class="badge bg-primary me-1">${t}</span>`).join('')}
            </td>
        </tr>
    `).join('');

    tableBody.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            handleSelect(e.target.value, e.target.checked);
            toggleDeleteButton();
        });
    });
}

function handleSelect(id, isSelected) {
    const stringId = String(id);
    if (isSelected) {
        selectedIds.add(stringId);
    } else {
        selectedIds.delete(stringId);
    }
}

function toggleDeleteButton() {
    const deleteBtn = document.getElementById('deleteModelsBtn');
    if (!deleteBtn) return;

    const hasSelection = selectedIds.size > 0;
    deleteBtn.disabled = !hasSelection;

    if (hasSelection) {
        deleteBtn.classList.replace('btn-outline-danger', 'btn-danger');
    } else {
        deleteBtn.classList.replace('btn-danger', 'btn-outline-danger');
    }
}