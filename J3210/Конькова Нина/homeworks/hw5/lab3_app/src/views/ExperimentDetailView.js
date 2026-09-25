import AppLayout from '../components/AppLayout.js';
import { useToast } from '../composables/useToast.js';

const { ref, onMounted } = window.Vue;

export default {
    name: 'ExperimentDetailView',
    components: {
        AppLayout
    },
    setup() {
        const showLogs = ref(false);
        const { showToast } = useToast();

        onMounted(() => {
            const canvas = document.getElementById('metricChart');
            if (!canvas || !window.Chart) return;

            new window.Chart(canvas, {
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
                        y: {
                            beginAtZero: true,
                            max: 1
                        }
                    }
                }
            });
        });

        function notify(action, fileName = 'model archive') {
            showToast(`${action}: ${fileName}`);
        }

        return {
            showLogs,
            notify
        };
    },
    template: `
        <AppLayout title="Experiment: ResNet50_V2">
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <h2 class="h3 mb-0">Experiment: ResNet50_V2 <span class="badge bg-success fs-6">Finished</span></h2>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary" type="button" @click="notify('Preparing download', 'model weights .pth')">
                        <i class="bi bi-download me-1" aria-hidden="true"></i>Download Model
                    </button>
                    <button class="btn btn-dark" type="button" @click="showLogs = true">
                        <i class="bi bi-terminal me-1" aria-hidden="true"></i>View Logs
                    </button>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-lg-8">
                    <section class="card border-0 shadow-sm p-4 mb-4" aria-labelledby="metrics-chart-heading">
                        <h3 id="metrics-chart-heading" class="h5">Training Metrics</h3>
                        <div class="chart-box">
                            <canvas id="metricChart"></canvas>
                        </div>
                    </section>

                    <section class="card border-0 shadow-sm p-4">
                        <h3 class="h5">Confusion Matrix</h3>
                        <div class="text-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/25/Multi_Category_Confusion_Matrix.png"
                                class="img-fluid rounded border confusion-image"
                                alt="Multi category confusion matrix visualization"
                            >
                        </div>
                    </section>
                </div>

                <div class="col-lg-4">
                    <section class="card border-0 shadow-sm p-4 mb-4" aria-labelledby="summary-heading">
                        <h3 id="summary-heading" class="h5">Metrics Summary</h3>
                        <div class="d-flex justify-content-around text-center py-2">
                            <div><small class="text-muted">Accuracy</small><div class="h4 mb-0">0.982</div></div>
                            <div><small class="text-muted">Loss</small><div class="h4 mb-0">0.015</div></div>
                            <div><small class="text-muted">F1-Score</small><div class="h4 mb-0">0.979</div></div>
                        </div>
                    </section>

                    <section class="card border-0 shadow-sm p-4 mb-4" aria-labelledby="store-heading">
                        <h3 id="store-heading" class="h5">Artifact Store</h3>
                        <div class="list-group list-group-flush">
                            <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0" @click="notify('Downloading', 'model.pth')">
                                <span><i class="bi bi-file-earmark-code me-1"></i>model.pth</span>
                                <span class="btn btn-sm btn-link">Download</span>
                            </button>
                            <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0" @click="notify('Generating preview', 'train_plots.png')">
                                <span><i class="bi bi-file-earmark-image me-1"></i>train_plots.png</span>
                                <span class="btn btn-sm btn-link">View</span>
                            </button>
                            <button type="button" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0" @click="notify('Opening', 'validation_results.csv')">
                                <span><i class="bi bi-file-earmark-spreadsheet me-1"></i>validation_results.csv</span>
                                <span class="btn btn-sm btn-link">Open</span>
                            </button>
                        </div>
                    </section>

                    <section class="card border-0 shadow-sm p-4" aria-labelledby="params-heading">
                        <h3 id="params-heading" class="h5">Parameters</h3>
                        <table class="table table-sm table-borderless mb-0">
                            <tbody>
                                <tr><td class="text-muted px-0">Batch Size</td><td class="text-end fw-bold">32</td></tr>
                                <tr><td class="text-muted px-0">Optimizer</td><td class="text-end fw-bold">Adam</td></tr>
                                <tr><td class="text-muted px-0">Learning Rate</td><td class="text-end fw-bold">0.001</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>

            <div v-if="showLogs" class="modal-backdrop-custom" role="presentation" @click.self="showLogs = false">
                <section class="modal-panel bg-dark text-white" role="dialog" aria-modal="true" aria-labelledby="logs-heading">
                    <div class="d-flex justify-content-between align-items-center border-bottom border-secondary p-3">
                        <h3 id="logs-heading" class="h5 mb-0">System Logs</h3>
                        <button type="button" class="btn-close btn-close-white" aria-label="Close logs" @click="showLogs = false"></button>
                    </div>
                    <div class="p-3">
                        <pre class="mb-0"><code>[INFO] Loading weights...
[INFO] Training started on GPU:0
[INFO] Epoch 1: Loss 0.45, Acc 0.61
[INFO] Epoch 2: Loss 0.32, Acc 0.75
[INFO] Epoch 50: Loss 0.015, Acc 0.982</code></pre>
                    </div>
                </section>
            </div>
        </AppLayout>
    `
};
