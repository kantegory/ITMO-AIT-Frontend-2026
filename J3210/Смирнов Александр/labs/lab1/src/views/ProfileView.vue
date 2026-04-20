<template>
    <BaseLayout>
        <h1 class="visually-hidden">Profile</h1>
        <div class="row">
            <div class="col-md-4">
                <div class="item-card text-center">
                    <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px; font-size: 24px;">
                        {{ initials }}
                    </div>
                    <h3>{{ user?.username || "Student User" }}</h3>
                    <p class="text-muted">{{ user?.email || "student@itmo.ru" }}</p>

                    <div class="d-grid gap-2">
                        <input v-model="profileName" type="text" class="form-control form-control-sm" placeholder="New username" />
                        <button type="button" class="btn btn-outline-primary btn-sm" @click="saveProfile">Save profile</button>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <button type="button" class="nav-link text-dark" :class="{ active: activeTab === 'uploads' }" @click="activeTab = 'uploads'">
                            My Uploads
                        </button>
                    </li>
                    <li class="nav-item">
                        <button type="button" class="nav-link text-dark" :class="{ active: activeTab === 'subscriptions' }" @click="activeTab = 'subscriptions'">
                            Subscriptions
                        </button>
                    </li>
                </ul>

                <section v-if="activeTab === 'uploads'">
                    <div class="item-card">
                        <h5 class="mb-3">Upload model or dataset</h5>
                        <form @submit.prevent="upload">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label for="upload-type" class="form-label">Type</label>
                                    <select id="upload-type" v-model="form.type" class="form-select" required>
                                        <option value="model">Model</option>
                                        <option value="dataset">Dataset</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="upload-task" class="form-label">Task</label>
                                    <select id="upload-task" v-model="form.task" class="form-select" required>
                                        <option value="cv">Computer Vision</option>
                                        <option value="nlp">NLP</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="upload-license" class="form-label">License</label>
                                    <select id="upload-license" v-model="form.license" class="form-select" required>
                                        <option value="mit">MIT</option>
                                        <option value="apache">Apache 2.0</option>
                                        <option value="cc">Creative Commons</option>
                                    </select>
                                </div>

                                <div class="col-12">
                                    <label for="upload-name" class="form-label">Name</label>
                                    <input id="upload-name" v-model="form.name" type="text" class="form-control" required />
                                </div>

                                <div class="col-md-6">
                                    <label for="upload-framework" class="form-label">Framework</label>
                                    <input id="upload-framework" v-model="form.framework" type="text" class="form-control" placeholder="pytorch / tensorflow / none" />
                                </div>
                                <div class="col-md-6">
                                    <label for="upload-file" class="form-label">File</label>
                                    <input id="upload-file" type="file" class="form-control" required @change="onFileChange" />
                                </div>

                                <div class="col-md-6">
                                    <label for="upload-metrics" class="form-label">Metrics</label>
                                    <input id="upload-metrics" v-model="form.metrics" type="text" class="form-control" required />
                                </div>
                                <div class="col-md-6">
                                    <label for="upload-usage" class="form-label">Usage Example (code)</label>
                                    <input id="upload-usage" v-model="form.usage" type="text" class="form-control" required />
                                </div>

                                <div class="col-12">
                                    <label for="upload-short-desc" class="form-label">Short description</label>
                                    <input id="upload-short-desc" v-model="form.desc" type="text" class="form-control" maxlength="160" required />
                                </div>

                                <div class="col-12">
                                    <label for="upload-full-desc" class="form-label">Detailed description</label>
                                    <textarea id="upload-full-desc" v-model="form.fullDesc" class="form-control" rows="4" required></textarea>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary mt-3" :disabled="uploading">
                                {{ uploading ? "Uploading..." : "Upload" }}
                            </button>
                        </form>
                    </div>

                    <div v-if="myUploads.length" class="mt-3">
                        <RouterLink
                            v-for="item in myUploads"
                            :key="item.id"
                            :to="`/model/${item.id}`"
                            class="text-decoration-none text-dark"
                        >
                            <div class="item-card">
                                <div class="d-flex justify-content-between align-items-start">
                                    <h5>{{ item.name }}</h5>
                                    <span class="badge" :class="item.type === 'model' ? 'bg-primary' : 'bg-success'">{{ item.type.toUpperCase() }}</span>
                                </div>
                                <p class="text-muted small mb-2">Task: {{ item.task.toUpperCase() }} | License: {{ item.license.toUpperCase() }} | Size: {{ item.size }}</p>
                                <p class="mb-0">{{ item.desc }}</p>
                            </div>
                        </RouterLink>
                    </div>
                    <p v-else class="text-muted">You have not uploaded any models or datasets yet.</p>
                </section>

                <section v-else>
                    <div v-if="subscribedItems.length">
                        <RouterLink
                            v-for="item in subscribedItems"
                            :key="item.id"
                            :to="`/model/${item.id}`"
                            class="text-decoration-none text-dark"
                        >
                            <div class="item-card">
                                <div class="d-flex justify-content-between">
                                    <h5>{{ item.name }}</h5>
                                    <span class="badge" :class="item.type === 'model' ? 'bg-primary' : 'bg-success'">{{ item.type.toUpperCase() }}</span>
                                </div>
                                <p class="text-muted small mb-0">You will receive notifications about new versions and discussions.</p>
                            </div>
                        </RouterLink>
                    </div>
                    <p v-else class="text-muted">No subscriptions yet.</p>
                </section>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { createItem, getItems } from "../api/items";
import { useAuth } from "../composables/useAuth";
import { useUserCollections } from "../composables/useUserCollections";
import BaseLayout from "../layouts/BaseLayout.vue";
import { getInitials } from "../utils/formatters";

const { user, updateProfile } = useAuth();
const { subscriptions } = useUserCollections();

const activeTab = ref("uploads");
const profileName = ref(user.value?.username || "");
const uploading = ref(false);
const selectedFile = ref(null);
const items = ref([]);

const form = reactive({
    type: "model",
    task: "cv",
    license: "mit",
    name: "",
    framework: "",
    metrics: "",
    usage: "",
    desc: "",
    fullDesc: ""
});

const initials = computed(() => getInitials(user.value?.username));

const myUploads = computed(() => {
    return items.value.filter((item) => String(item.authorId || "") === String(user.value?.id || ""));
});

const subscribedItems = computed(() => {
    return items.value.filter((item) => subscriptions.includes(item.id));
});

const resetForm = () => {
    form.type = "model";
    form.task = "cv";
    form.license = "mit";
    form.name = "";
    form.framework = "";
    form.metrics = "";
    form.usage = "";
    form.desc = "";
    form.fullDesc = "";
    selectedFile.value = null;
};

const loadItems = async () => {
    items.value = await getItems();
};

const onFileChange = (event) => {
    selectedFile.value = event.target.files?.[0] || null;
};

const saveProfile = () => {
    const normalized = profileName.value.trim();
    if (!normalized) return;
    updateProfile(normalized);
    profileName.value = normalized;
};

const upload = async () => {
    uploading.value = true;
    try {
        const payload = {
            id: String(Date.now()),
            authorId: user.value?.id,
            type: form.type,
            name: form.name.trim(),
            task: form.task,
            license: form.license,
            framework: (form.framework.trim() || "none").toLowerCase(),
            size: selectedFile.value ? `${(selectedFile.value.size / (1024 * 1024)).toFixed(2)}mb` : "n/a",
            downloads: "0",
            stars: 0,
            metrics: form.metrics.trim(),
            desc: form.desc.trim(),
            fullDesc: form.fullDesc.trim(),
            usage: form.usage.trim()
        };

        await createItem(payload);
        resetForm();
        await loadItems();
    } finally {
        uploading.value = false;
    }
};

onMounted(loadItems);
</script>
