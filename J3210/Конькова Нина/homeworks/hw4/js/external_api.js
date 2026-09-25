async function fetchHFModels() {
    const grid = document.getElementById('hf-models-grid');
    if (!grid) return;

    try {
        const response = await fetch('https://huggingface.co/api/models?sort=downloads&direction=-1&limit=8');
        const models = await response.json();

        grid.innerHTML = '';

        const row1 = document.createElement('div'); row1.className = "row mb-4";
        const row2 = document.createElement('div'); row2.className = "row mb-4";
        const row3 = document.createElement('div'); row3.className = "row mb-4";

        models.forEach((m, index) => {
            let colClass, cardClass;
            const modelName = m.modelId.split('/').pop();

            if (index === 0) {
                colClass = "col-12";
                cardClass = "bg-primary text-white p-4";
            } else if (index <= 3) {
                colClass = "col-md-4";
                cardClass = "bg-white shadow-sm p-3 border-0";
            } else {
                colClass = "col-md-3";
                cardClass = "bg-white border p-2 small";
            }

            const card = `
                <div class="${colClass}">
                    <div class="card h-100 ${cardClass} stat-card">
                        <div class="card-body">
                            <h6 class="fw-bold mb-1">${modelName}</h6>
                            <p class="text-truncate opacity-75 mb-2">${m.author || 'OpenSource'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-info text-dark">📥 ${m.downloads.toLocaleString()}</span>
                                <svg class="icon me-2" aria-hidden="true" width="16" height="16">
                                    <use href="img/sprite.svg#icon-dashboard"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            if (index === 0) row1.innerHTML += card;
            else if (index <= 3) row2.innerHTML += card;
            else row3.innerHTML += card;
        });

        grid.append(row1, row2, row3);
    } catch (err) {
        grid.innerHTML = `<div class="alert alert-danger">API Error: ${err.message}</div>`;
    }
}
fetchHFModels();