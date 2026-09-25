document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('metricChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Epoch 10', 'Epoch 20', 'Epoch 30', 'Epoch 40', 'Epoch 50'],
            datasets: [{
                label: 'Accuracy',
                data: [0.7, 0.82, 0.88, 0.94, 0.98],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 1 }
            }
        }
    });
});