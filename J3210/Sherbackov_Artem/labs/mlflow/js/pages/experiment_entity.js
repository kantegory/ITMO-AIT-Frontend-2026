import api from '../api.js';

let allRuns = []; 
let currentExperiment = null;

export async function initExperimentEntityPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const experimentId = urlParams.get('id');

    if (!experimentId) {
        document.getElementById('experimentTitle').textContent = 'Experiment ID not found';
        return;
    }

    try {
        const expRes = await api.get(`/660/experiments/${experimentId}`);
        currentExperiment = expRes.data;
        document.getElementById('experimentTitle').textContent = `Experiment: ${currentExperiment.name}`;

        const runsRes = await api.get(`/660/runs?experimentId=${experimentId}`);
        allRuns = runsRes.data;

        setupEventListeners();
        render();

    } catch (error) {
        console.error('Error loading experiment details:', error);
        document.getElementById('experimentTitle').textContent = 'No runs';
        alert('Failed to load experiment. Check if ID exists in db.json');
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (searchInput) searchInput.addEventListener('input', render);
    if (statusFilter) statusFilter.addEventListener('change', render);
    if (sortFilter) sortFilter.addEventListener('change', render);
}

function render() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusVal = document.getElementById('statusFilter')?.value || 'all';
    const sortVal = document.getElementById('sortFilter')?.value || 'createdAt';

    let filtered = allRuns.filter(run => {
        const matchesSearch = run.name.toLowerCase().includes(searchTerm);
        const matchesStatus = statusVal === 'all' || run.status === statusVal;
        return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
        if (sortVal === 'metricValue' || sortVal === 'duration') {
            return (b[sortVal] || 0) - (a[sortVal] || 0);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    renderRunsTable(filtered);
    
    const statsLabel = document.getElementById('runsStats');
    if (statsLabel) {
        statsLabel.textContent = `Showing 1-${filtered.length} of ${filtered.length} runs`;
    }
}

function renderRunsTable(runs) {
    const tableBody = document.getElementById('runsTableBody');
    if (!tableBody) return;

    if (runs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No runs matches your criteria</td></tr>';
        return;
    }

    tableBody.innerHTML = runs.map(run => `
        <tr>
            <td><a href="run_entity.html?id=${run.id}" class="fw-semibold text-decoration-none">
                    ${run.name}
                </a>
            </td>
            <td>${new Date(run.createdAt).toLocaleString()}</td>
            <td>
                <span class="badge ${run.status === 'Finished' ? 'bg-success' : 'bg-warning text-dark'}">
                    ${run.status}
                </span>
            </td>
            <td>
                <span class="badge bg-primary">
                    ${run.metricName}: ${run.metricValue}
                </span>
            </td>
            <td>
                <a href="model_entity.html?id=${run.modelId}" class="badge bg-secondary text-decoration-none">
                    model_id: ${run.modelId}
                </a>
            </td>
            <td>${formatDuration(run.duration)}</td>
        </tr>
    `).join('');
}

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}