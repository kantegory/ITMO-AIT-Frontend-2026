import AppLayout from '../components/AppLayout.js';
import { registeredModels } from '../data/mockData.js';
import { useToast } from '../composables/useToast.js';

const { ref } = window.Vue;

export default {
    name: 'ModelsView',
    components: {
        AppLayout
    },
    setup() {
        const models = ref([...registeredModels]);
        const showForm = ref(false);
        const newModelName = ref('');
        const { showToast } = useToast();

        function stageClass(stage) {
            return {
                Production: 'bg-success',
                Staging: 'bg-warning text-dark',
                Archived: 'bg-secondary'
            }[stage] || 'bg-light text-dark';
        }

        function handleAction(action, model) {
            const messages = {
                Rollback: `Rollback for ${model.name} has started.`,
                Deploy: `${model.name} is being deployed to Production.`,
                Promote: `${model.name} was promoted from Staging to Production.`,
                Archive: `${model.name} was moved to archive.`,
                Restore: `${model.name} was restored from archive.`
            };

            showToast(messages[action] || `${action} initiated for ${model.name}.`);
        }

        function addModel() {
            const name = newModelName.value.trim();
            if (!name) return;

            models.value.unshift({
                name,
                version: 'v0.1.0',
                stage: 'Staging',
                artifactPath: `s3://models/${name.toLowerCase()}/v0.1`,
                modified: new Date().toISOString().slice(0, 10),
                actions: ['Archive', 'Promote']
            });

            showToast(`${name} registered in model registry.`, 'success');
            newModelName.value = '';
            showForm.value = false;
        }

        return {
            models,
            showForm,
            newModelName,
            stageClass,
            handleAction,
            addModel
        };
    },
    template: `
        <AppLayout title="Model Registry">
            <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-primary" type="button" @click="showForm = true">
                    <i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Add Model
                </button>
            </div>

            <section v-if="showForm" class="card border-0 shadow-sm mb-4" aria-label="Register new model">
                <form class="card-body row g-3 align-items-end" @submit.prevent="addModel">
                    <div class="col-md-8">
                        <label for="newModelName" class="form-label">Model Name</label>
                        <input v-model="newModelName" id="newModelName" type="text" class="form-control" placeholder="Recommendation_Ranker">
                    </div>
                    <div class="col-md-4 d-flex gap-2">
                        <button type="submit" class="btn btn-primary flex-grow-1">Register</button>
                        <button type="button" class="btn btn-outline-secondary" @click="showForm = false">Cancel</button>
                    </div>
                </form>
            </section>

            <section class="card border-0 shadow-sm">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table align-middle mb-0" aria-label="Model registry">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4" scope="col">Model Name</th>
                                    <th scope="col">Version</th>
                                    <th scope="col">Stage</th>
                                    <th scope="col">Artifact Path</th>
                                    <th scope="col">Last Modified</th>
                                    <th class="text-end pe-4" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="model in models" :key="model.name + model.version">
                                    <td class="ps-4"><b>{{ model.name }}</b></td>
                                    <td><span class="badge bg-light text-dark">{{ model.version }}</span></td>
                                    <td><span class="badge" :class="stageClass(model.stage)">{{ model.stage }}</span></td>
                                    <td><small class="text-muted">{{ model.artifactPath }}</small></td>
                                    <td>{{ model.modified }}</td>
                                    <td class="text-end pe-4">
                                        <button
                                            v-for="action in model.actions"
                                            :key="action"
                                            class="btn btn-sm me-1"
                                            :class="action === 'Promote' ? 'btn-success' : action === 'Deploy' ? 'btn-dark' : 'btn-outline-dark'"
                                            type="button"
                                            @click="handleAction(action, model)"
                                        >
                                            {{ action }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </AppLayout>
    `
};
