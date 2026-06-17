import { getExperiments, createExperiment } from '../experiments.js';

export async function initDashboardPage() {
    const container = document.getElementById('experimentList');
    if (!container) return;

    const allExperiments = await getExperiments();
    
    const latestExperiments = allExperiments
        .sort((a, b) => b.id - a.id) 
        .slice(0, 6);                

    container.innerHTML = latestExperiments.map(exp => `
        <div class="col">
            <a href="experiment_entity.html?id=${exp.id}" class="text-decoration-none text-dark">
                <div class="card h-100 shadow-sm card-hover">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold mb-0">${exp.name}</h5>
                        </div>
                        <p class="card-text text-muted mb-3">Model: ${exp.model}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-body-secondary">
                                ${new Date(exp.createdAt).toLocaleDateString()}
                            </small>
                            <i class="bi bi-arrow-right text-primary"></i>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');

    const newExpForm = document.querySelector('#newExperimentModal form');
    newExpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('expName').value;
        const model = document.getElementById('expModel').value;
        await createExperiment(name, model);
        location.reload(); 
    });
}