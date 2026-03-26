import api from '../api.js';

export async function initExperimentEntityPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const experimentId = urlParams.get('id');

    if (!experimentId) {
        document.getElementById('experimentTitle').textContent = 'Experiment not found';
        return;
    }

    try {
        const response = await api.get(`/660/experiments/${experimentId}`);
        const experiment = response.data;

        document.getElementById('experimentTitle').textContent = `Experiment: ${experiment.name}`;

        renderRunsTable(experiment);

    } catch (error) {
        console.error('Error loading experiment details:', error);
        document.getElementById('experimentTitle').textContent = 'Error loading data';
    }
}

function renderRunsTable(experiment) {
    const tableBody = document.getElementById('runsTableBody');
    const statsLabel = document.getElementById('runsStats');

    const mockRuns = [
        { id: 1, name: 'run_initial', status: 'Finished', accuracy: 0.85, duration: '5m 10s' },
        { id: 2, name: 'run_optimized', status: 'Finished', accuracy: 0.92, duration: '12m 45s' }
    ];

    if (statsLabel) {
        statsLabel.textContent = `Showing 1-${mockRuns.length} of ${mockRuns.length} runs`;
    }

    tableBody.innerHTML = mockRuns.map(run => `
        <tr>
            <td>
                <a href="#" class="fw-semibold text-decoration-none">${run.name}</a>
            </td>
            <td>${new Date(experiment.createdAt).toLocaleDateString()}</td>
            <td>
                <span class="badge ${run.status === 'Finished' ? 'bg-success' : 'bg-warning'}">
                    ${run.status}
                </span>
            </td>
            <td>
                <span class="badge bg-primary">accuracy: ${run.accuracy}</span>
            </td>
            <td>
                <span class="badge bg-secondary">model=${experiment.model}</span>
            </td>
            <td>${run.duration}</td>
        </tr>
    `).join('');
}