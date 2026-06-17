import api from '../api.js';
import { getExperiments, createExperiment } from '../experiments.js';

let allExperiments = [];
let selectedIds = new Set();

export async function initExperimentsListPage() {
    const tableBody = document.getElementById('experimentsTableBody');
    if (!tableBody) return;

    await refreshTable();
    setupEventListeners();
}

async function refreshTable() {
    allExperiments = await getExperiments();
    selectedIds.clear();
    
    const masterCheckbox = document.getElementById('selectAll');
    if (masterCheckbox) masterCheckbox.checked = false;

    renderTable(allExperiments);
    fillTagFilter();
    toggleDeleteButton();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const tagSelect = document.getElementById('tagFilter');
    const deleteBtn = document.getElementById('deleteExpBtn');
    const masterCheckbox = document.getElementById('selectAll');
    const newExpForm = document.getElementById('createExperimentForm');

    searchInput?.addEventListener('input', () => applyFilters());
    tagSelect?.addEventListener('change', () => applyFilters());

    newExpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('expName').value;
        const model = document.getElementById('expModel').value;

        if (!name || !model) return alert('Please fill in all fields');

        try {
            await createExperiment(name, model);
            await refreshTable();
            const modalElement = document.getElementById('newExperimentModal');
            bootstrap.Modal.getInstance(modalElement).hide();
            newExpForm.reset();
        } catch (error) { console.error(error); }
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

        document.getElementById('deleteCount').textContent = selectedIds.size;

        const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        deleteModal.show();
    });

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn?.addEventListener('click', async () => {
        try {
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.textContent = 'Deleting...';

            for (let id of selectedIds) {
                await api.delete(`/660/experiments/${id}`);
            }

            const modalElement = document.getElementById('deleteConfirmModal');
            bootstrap.Modal.getInstance(modalElement).hide();
            
            await refreshTable();
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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedTag = document.getElementById('tagFilter').value;

    const filtered = allExperiments.filter(exp => {
        const matchesName = exp.name.toLowerCase().includes(searchTerm);
        const matchesTag = (selectedTag === 'All') || (exp.tags && exp.tags.includes(selectedTag));
        return matchesName && matchesTag;
    });

    renderTable(filtered);
}

function fillTagFilter() {
    const tagSelect = document.getElementById('tagFilter');
    if (!tagSelect) return;
    
    const tags = new Set();
    allExperiments.forEach(exp => exp.tags?.forEach(t => tags.add(t)));

    let options = '<option selected value="All">All</option>';
    tags.forEach(tag => options += `<option value="${tag}">${tag}</option>`);
    tagSelect.innerHTML = options;
}

function renderTable(list) {
    const tableBody = document.getElementById('experimentsTableBody');
    const statsLabel = document.getElementById('tableStats');
    
    if (statsLabel) {
        statsLabel.textContent = `Showing ${list.length} experiments`;
    }

    if (list.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No experiments found</td></tr>';
        return;
    }

    tableBody.innerHTML = list.map(exp => `
        <tr>
            <td><input class="form-check-input row-checkbox" type="checkbox" value="${exp.id}" ${selectedIds.has(exp.id.toString()) ? 'checked' : ''}></td>
            <td><a href="experiment_entity.html?id=${exp.id}" class="text-decoration-none fw-semibold">${exp.name}</a></td>
            <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
            <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
            <td>${exp.model || '—'}</td>
            <td>
                ${(exp.tags || []).map(t => `<span class="badge bg-light text-dark border me-1">${t}</span>`).join('')}
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
    console.log('Текущий выбор:', Array.from(selectedIds));
}

function toggleDeleteButton() {
    const deleteBtn = document.getElementById('deleteExpBtn');
    if (!deleteBtn) return;

    const hasSelection = selectedIds.size > 0;
    deleteBtn.disabled = !hasSelection;

    if (hasSelection) {
        deleteBtn.classList.replace('btn-outline-danger', 'btn-danger');
    } else {
        deleteBtn.classList.replace('btn-danger', 'btn-outline-danger');
    }
}