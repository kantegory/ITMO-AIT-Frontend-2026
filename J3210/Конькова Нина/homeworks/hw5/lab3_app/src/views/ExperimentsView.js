import AppLayout from '../components/AppLayout.js';
import { experiments } from '../data/mockData.js';
import { useExperimentFilters } from '../composables/useExperimentFilters.js';

export default {
    name: 'ExperimentsView',
    components: {
        AppLayout
    },
    setup() {
        const filters = useExperimentFilters(experiments);

        function statusClass(status) {
            return {
                Finished: 'bg-success',
                Running: 'bg-warning text-dark',
                Failed: 'bg-danger'
            }[status] || 'bg-secondary';
        }

        return {
            ...filters,
            statusClass
        };
    },
    template: `
        <AppLayout title="Experiments List">
            <section class="card border-0 shadow-sm mb-4" aria-label="Experiment filters">
                <div class="card-body">
                    <div class="row g-3 align-items-end">
                        <div class="col-lg-3 col-md-6">
                            <label for="tableSearch" class="form-label small">Search by name</label>
                            <input v-model="search" type="text" id="tableSearch" class="form-control" placeholder="Type to search...">
                        </div>

                        <div class="col-lg-2 col-md-6">
                            <label for="statusSelect" class="form-label small">Status</label>
                            <select v-model="status" id="statusSelect" class="form-select">
                                <option value="All">All Statuses</option>
                                <option value="Finished">Finished</option>
                                <option value="Running">Running</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>

                        <div class="col-lg-2 col-md-6">
                            <label for="dateFilter" class="form-label small">Date</label>
                            <input v-model="date" type="date" id="dateFilter" class="form-control">
                        </div>

                        <div class="col-lg-3 col-md-6">
                            <label for="accRange" class="form-label small">
                                Min Accuracy: <span class="fw-bold text-primary">{{ Number(minAccuracy).toFixed(2) }}</span>
                            </label>
                            <input v-model.number="minAccuracy" type="range" id="accRange" class="form-range" min="0" max="1" step="0.01">
                        </div>

                        <div class="col-lg-2 col-md-12">
                            <button type="button" class="btn btn-outline-secondary w-100" @click="resetFilters">
                                <i class="bi bi-x-circle me-1" aria-hidden="true"></i>Reset
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="card border-0 shadow-sm">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table align-middle" aria-label="Experiments">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">Experiment Name</th>
                                    <th scope="col">Run ID</th>
                                    <th scope="col">Accuracy</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="experiment in filteredExperiments" :key="experiment.id">
                                    <td>{{ experiment.name }}</td>
                                    <td><code>{{ experiment.id }}</code></td>
                                    <td>{{ experiment.accuracy.toFixed(2) }}</td>
                                    <td><span class="badge" :class="statusClass(experiment.status)">{{ experiment.status }}</span></td>
                                    <td>{{ experiment.date }}</td>
                                    <td>
                                        <RouterLink to="/experiments/resnet50-v2" class="btn btn-sm btn-outline-primary">
                                            Open
                                        </RouterLink>
                                    </td>
                                </tr>
                                <tr v-if="filteredExperiments.length === 0">
                                    <td colspan="6" class="text-center text-muted py-4">No experiments match the filters.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AppLayout>
    `
};
