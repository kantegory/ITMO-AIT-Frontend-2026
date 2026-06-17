import { getExperiments, createExperiment } from '../experiments.js';

export async function initExperimentsListPage() {
    const tableBody = document.getElementById('experimentsTableBody');
    if (!tableBody) return;

    await refreshTable();

    const newExpForm = document.querySelector('#newExperimentModal form');
    newExpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('expName').value;
        const model = document.getElementById('expModel').value;

        if (!name || !model) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await createExperiment(name, model);
            await refreshTable();
            
            const modalElement = document.getElementById('newExperimentModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            
            newExpForm.reset();
        } catch (error) {
            console.error('Failed to create experiment:', error);
        }
    });
}

async function refreshTable() {
    const experiments = await getExperiments();
    renderTable(experiments);
}

function renderTable(list) {
    const tableBody = document.getElementById('experimentsTableBody');
    const statsLabel = document.getElementById('tableStats');
    
    if (statsLabel) {
        const count = list.length;
        statsLabel.textContent = `Showing ${count > 0 ? 1 : 0}-${count} of ${count} experiments`;
    }

    if (list.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No experiments found</td></tr>';
        return;
    }

    tableBody.innerHTML = list.map(exp => `
        <tr>
            <td><input class="form-check-input row-checkbox" type="checkbox" value="${exp.id}"></td>
            <td>
                <a href="experiment_entity.html?id=${exp.id}" class="text-decoration-none fw-semibold">
                    ${exp.name}
                </a>
            </td>
            <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
            <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
            <td>${exp.model || '—'}</td>
            <td><span class="badge bg-primary">v1.0</span></td>
        </tr>
    `).join('');
}