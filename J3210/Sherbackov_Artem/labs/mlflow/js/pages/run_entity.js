import api from '../api.js';

export async function initRunEntityPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const runId = urlParams.get('id');

    if (!runId) {
        document.getElementById('runName').textContent = 'Run ID not found';
        return;
    }

    try {
        const response = await api.get(`/660/runs/${runId}`);
        const run = response.data;

        renderRunDetails(run);

    } catch (error) {
        console.error('Error loading run details:', error);
        document.getElementById('runName').textContent = 'Error loading data (404)';
        alert('Failed to load run details. Check if ID exists in db.json');
    }
}

function renderRunDetails(run) {
    const nameEl = document.getElementById('runName');
    const dateEl = document.getElementById('runDate');
    const metricLabelEl = document.getElementById('metricNameLabel');
    const metricValueEl = document.getElementById('metricValueDisplay');
    const epochsEl = document.getElementById('epochsValue');
    const batchEl = document.getElementById('batchValue');

    if (nameEl) nameEl.textContent = run.name || 'Unnamed Run';
    if (dateEl) dateEl.textContent = new Date(run.createdAt).toLocaleString();
    
    const backLink = document.getElementById('backToExperiment');
    if (backLink && run.experimentId) {
        backLink.href = `experiment_entity.html?id=${run.experimentId}`;
    }

    if (metricLabelEl) metricLabelEl.textContent = run.metricName || 'Metric';
    if (metricValueEl) metricValueEl.textContent = run.metricValue !== undefined ? run.metricValue : '-';
    if (epochsEl) epochsEl.textContent = run.epochs || 'N/A';
    if (batchEl) batchEl.textContent = run.batch || 'N/A';
}