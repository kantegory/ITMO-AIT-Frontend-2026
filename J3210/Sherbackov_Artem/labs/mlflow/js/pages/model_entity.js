import api from '../api.js';

export async function initModelEntityPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const modelId = urlParams.get('id');

    if (!modelId) {
        alert('Model ID not found in URL');
        window.location.href = 'models.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const modelRes = await api.get(`/660/modelss/${modelId}`);
        const model = modelRes.data;

        const expRes = await api.get(`/660/experiments?userId=${user.id}&model=${model.name}`);
        const versions = expRes.data;

        renderModelDetails(model, versions);
        
    } catch (error) {
        console.error('Error fetching model details:', error);
        alert('Failed to load model details.');
    }
}

function renderModelDetails(model, versions) {
    document.getElementById('modelNameDisplay').textContent = model.name;
    document.getElementById('modelStageDisplay').textContent = model.version || 'v1.0';

    document.getElementById('totalVersionsDisplay').textContent = versions.length;

    if (versions.length > 0) {
        const bestVersion = versions.reduce((prev, current) => {
            const prevVal = parseFloat(prev.metricValue) || 0;
            const currVal = parseFloat(current.metricValue) || 0;
            return (currVal > prevVal) ? current : prev;
        }, versions[0]);

        document.getElementById('bestMetricName').textContent = bestVersion.metricName || 'Accuracy';
        document.getElementById('bestMetricValue').textContent = bestVersion.metricValue || '-';
    }

    const tableBody = document.getElementById('versionsTableBody');
    
    if (versions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No versions found for this model.</td></tr>';
        return;
    }

    tableBody.innerHTML = versions.reverse().map((v, index) => `
        <tr>
            <td>v${v.id}</td>
            <td>${v.metricValue || 'N/A'}</td>
            <td>
                <span class="badge ${v.status === 'success' ? 'bg-success' : 'bg-warning text-dark'}">
                    ${v.status || 'Done'}
                </span>
            </td>
            <td>${new Date(v.createdAt || v.date).toLocaleDateString()}</td>
            <td>
                <a href="experiment_entity.html?id=${v.id}" class="btn btn-sm btn-outline-primary">
                    View
                </a>
            </td>
        </tr>
    `).join('');
}