const mockData = [
    { id: '#exp-1337', name: 'BERT-Transformer-v2', acc: 0.94, date: '2024-03-10', tag: 'production' },
    { id: '#exp-1234', name: 'ResNet-50-Base', acc: 0.88, date: '2024-03-09', tag: 'computer vision' },
    { id: '#exp-0228', name: 'YOLO-v8-Test', acc: 0.69, date: '2024-03-08', tag: 'testing' },
    { id: '#exp-0042', name: 'GPT-2-FineTune', acc: 0.52, date: '2024-03-07', tag: 'nlp' }
];

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.add('d-none'));
    
    const target = document.getElementById(pageId + '-page');
    if (target) target.classList.remove('d-none');

    if (pageId === 'login' || pageId === 'register') {
        document.body.classList.add('no-sidebar');
    } else {
        document.body.classList.remove('no-sidebar');
    }

    if (pageId === 'experiment') {
        initChart();
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(`'${pageId}'`)) {
            link.classList.add('active');
        }
    });
}

function performSearch() {
    const searchDate = document.getElementById('searchDate').value;
    const searchAcc = parseFloat(document.getElementById('searchAcc').value) || 0;
    const searchTag = document.getElementById('searchTag').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    const filtered = mockData.filter(item => {
        const matchDate = searchDate ? item.date === searchDate : true;
        const matchAcc = item.acc >= searchAcc;
        const matchTag = item.tag.includes(searchTag) || item.name.toLowerCase().includes(searchTag) || item.id.includes(searchTag);
        return matchDate && matchAcc && matchTag;
    });

    if (filtered.length > 0) {
        resultsContainer.innerHTML = filtered.map(item => `
            <div class="card p-3 mb-2 d-flex flex-row justify-content-between align-items-center">
                <div>
                    <strong>${item.name}</strong> <span class="badge bg-secondary">${item.tag}</span><br>
                    <small class="text-muted">Дата: ${item.date} | Accuracy: ${item.acc} | ID: ${item.id}</small>
                </div>
                <button class="btn btn-sm btn-primary" onclick="showPage('experiment')">Открыть</button>
            </div>
        `).join('');
    } else {
        resultsContainer.innerHTML = '<div class="alert alert-warning border-0 shadow-sm">Эксперименты не найдены. Попробуйте изменить параметры поиска.</div>';
    }
}

document.getElementById('sidebarCollapse').addEventListener('click', function() {
    document.body.classList.toggle('sidebar-collapsed');
});

function login(e) {
    e.preventDefault();
    showPage('dashboard');
}

function logout() {
    showPage('login');
}

let myChart = null;
function initChart() {
    const ctx = document.getElementById('metricsChart').getContext('2d');
    if (myChart) myChart.destroy();
    
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
            datasets: [{
                label: 'Accuracy',
                data: [0.42, 0.52, 0.67, 0.69, 0.94], 
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showPage('login');
    performSearch(); 
});