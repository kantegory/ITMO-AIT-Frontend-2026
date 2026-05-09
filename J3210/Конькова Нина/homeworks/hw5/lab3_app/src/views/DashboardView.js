import AppLayout from '../components/AppLayout.js';
import StatCard from '../components/StatCard.js';
import HuggingFaceModels from '../components/HuggingFaceModels.js';
import { experiments } from '../data/mockData.js';

const { computed } = window.Vue;

export default {
    name: 'DashboardView',
    components: {
        AppLayout,
        StatCard,
        HuggingFaceModels
    },
    setup() {
        const recentExperiments = experiments.slice(0, 2);
        const bestAccuracy = computed(() => Math.max(...experiments.map((item) => item.accuracy)));

        function statusClass(status) {
            return {
                Finished: 'bg-success',
                Running: 'bg-warning text-dark',
                Failed: 'bg-danger'
            }[status] || 'bg-secondary';
        }

        return {
            recentExperiments,
            bestAccuracy,
            statusClass
        };
    },
    template: `
        <AppLayout title="Overview">
            <section aria-labelledby="stats-heading" class="mb-4">
                <h2 id="stats-heading" class="visually-hidden">Statistics</h2>
                <div class="row g-3 mb-4">
                    <div class="col-md-3 col-sm-6">
                        <StatCard label="Experiments" :value="24" icon="bi-clipboard2-data" tone="primary" />
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <StatCard label="Active Models" :value="12" icon="bi-cpu" tone="success" />
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <StatCard label="Total Runs" :value="542" icon="bi-play-circle" tone="info" />
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <StatCard label="Best Accuracy" :value="(bestAccuracy * 100).toFixed(1) + '%'" icon="bi-trophy" tone="warning" />
                    </div>
                </div>
            </section>

            <HuggingFaceModels />

            <section aria-labelledby="recent-heading">
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h2 id="recent-heading" class="h5 card-title mb-4">Recent Experiments</h2>
                        <div class="table-responsive">
                            <table class="table align-middle" aria-label="Recent experiments">
                                <thead class="table-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Metric (Acc)</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="experiment in recentExperiments" :key="experiment.id">
                                        <td>{{ experiment.name }}</td>
                                        <td><span class="badge" :class="statusClass(experiment.status)">{{ experiment.status }}</span></td>
                                        <td>{{ experiment.accuracy.toFixed(3) }}</td>
                                        <td>{{ experiment.date }}</td>
                                        <td>
                                            <RouterLink to="/experiments/resnet50-v2" class="btn btn-sm btn-outline-primary">
                                                View
                                            </RouterLink>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    `
};
