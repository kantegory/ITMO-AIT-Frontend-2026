import AppLayout from '../components/AppLayout.js';
import { artifacts } from '../data/mockData.js';
import { useToast } from '../composables/useToast.js';

export default {
    name: 'ArtifactsView',
    components: {
        AppLayout
    },
    setup() {
        const { showToast } = useToast();

        function iconFor(type) {
            return {
                binary: 'bi-file-earmark-binary',
                code: 'bi-file-earmark-code',
                image: 'bi-file-earmark-image',
                spreadsheet: 'bi-file-earmark-spreadsheet'
            }[type] || 'bi-file-earmark';
        }

        function downloadArtifact(artifact) {
            showToast(`Loading ${artifact.name} from artifact storage.`);
        }

        return {
            artifacts,
            iconFor,
            downloadArtifact
        };
    },
    template: `
        <AppLayout title="Artifact Storage">
            <section class="card border-0 shadow-sm">
                <div class="card-body">
                    <h2 class="h5 mb-3">Files in S3 / Local Storage</h2>
                    <div class="list-group list-group-flush">
                        <button
                            v-for="artifact in artifacts"
                            :key="artifact.name"
                            type="button"
                            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            @click="downloadArtifact(artifact)"
                        >
                            <span><i class="bi me-2" :class="iconFor(artifact.type)" aria-hidden="true"></i>{{ artifact.name }}</span>
                            <span class="badge bg-light text-dark border">{{ artifact.size }}</span>
                        </button>
                    </div>
                </div>
            </section>
        </AppLayout>
    `
};
