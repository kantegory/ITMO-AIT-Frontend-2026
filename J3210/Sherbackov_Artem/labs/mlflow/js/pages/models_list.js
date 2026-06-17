import { getRegisteredModels, createRegisteredModel } from '../models.js';

export async function initModelsListPage() {
    const tableBody = document.getElementById('modelsTableBody');
    if (!tableBody) return;

    await refreshModelsTable();

    const createModelForm = document.getElementById('createModelForm');
    createModelForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('newModelName').value;
        const description = document.getElementById('newModelDescription').value;

        try {
            await createRegisteredModel(name, description);
            
            await refreshModelsTable();

            const modalEl = document.getElementById('createModelModal');
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
            modalInstance.hide();

            createModelForm.reset();
        } catch (error) {
            console.error('Failed to create model:', error);
        }
    });
}

async function refreshModelsTable() {
    const models = await getRegisteredModels();
    renderModelsTable(models);
}

function renderModelsTable(list) {
    const tableBody = document.getElementById('modelsTableBody');
    const statsLabel = document.getElementById('modelsStats');

    if (statsLabel) {
        statsLabel.textContent = `Showing ${list.length > 0 ? 1 : 0}-${list.length} of ${list.length} models`;
    }

    if (list.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No models found</td></tr>';
        return;
    }

    tableBody.innerHTML = list.map(model => `
        <tr>
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
}