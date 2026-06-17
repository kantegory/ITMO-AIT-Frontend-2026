<script setup>
import { ref, computed, onMounted } from "vue";
import { useModelStore } from "@/stores/models";
import BaseLayout from "@/layouts/BaseLayout.vue";
import ModelCreateModal from "@/components/models/ModelCreateModal.vue"; //

const store = useModelStore();

const searchQuery = ref("");
const selectedTag = ref("All");
const selectedIds = ref([]);
const isDeleting = ref(false);

onMounted(() => {
  store.fetchModels();
});

const filteredModels = computed(() => {
  return store.models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesTag =
      selectedTag.value === "All" || (model.tags && model.tags.includes(selectedTag.value));
    return matchesSearch && matchesTag;
  });
});

const toggleSelectAll = (event) => {
  selectedIds.value = event.target.checked ? filteredModels.value.map((m) => m.id) : [];
};

const handleConfirmDelete = async () => {
  isDeleting.value = true;
  const success = await store.deleteModels(selectedIds.value);

  if (success) {
    selectedIds.value = [];
    const modalElement = document.getElementById("deleteModelsConfirmModal");
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  }
  isDeleting.value = false;
};
</script>

<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1>Registered Models</h1>

      <div class="d-flex flex-column flex-md-row gap-2">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModelModal">
          Create Model
        </button>

        <button
          class="btn"
          :class="selectedIds.length ? 'btn-danger' : 'btn-outline-danger'"
          :disabled="!selectedIds.length"
          data-bs-toggle="modal"
          data-bs-target="#deleteModelsConfirmModal"
        >
          Delete ({{ selectedIds.length }})
        </button>
      </div>
    </header>

    <section class="card mb-4 border-0 shadow-sm">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-sm-12 col-md-6">
            <input
              v-model="searchQuery"
              type="search"
              class="form-control"
              placeholder="Search registered models"
            />
          </div>
          <div class="col-sm-12 col-md-3">
            <select v-model="selectedTag" class="form-select">
              <option value="All">All Tags</option>
              <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 40px">
                <input
                  class="form-check-input"
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="
                    selectedIds.length === filteredModels.length && filteredModels.length > 0
                  "
                />
              </th>
              <th>Name</th>
              <th>Latest Version</th>
              <th>Aliased Versions</th>
              <th>Created By</th>
              <th>Last Modified</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="model in filteredModels" :key="model.id">
              <td>
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="model.id"
                  v-model="selectedIds"
                />
              </td>
              <td>
                <router-link :to="`/modelss/${model.id}`" class="text-decoration-none fw-semibold">
                  {{ model.name }}
                </router-link>
              </td>
              <td>{{ model.version || "v1.0" }}</td>
              <td><span class="badge bg-success">Production</span></td>
              <td>{{ model.author || "Anonymous" }}</td>
              <td class="text-muted">{{ new Date(model.createdAt).toLocaleDateString() }}</td>
              <td>
                <span v-for="tag in model.tags" :key="tag" class="badge bg-primary me-1">
                  {{ tag }}
                </span>
              </td>
            </tr>
            <tr v-if="!filteredModels.length">
              <td colspan="7" class="text-center py-4 text-muted">No models found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ModelCreateModal id="createModelModal" />

    <div class="modal fade" id="deleteModelsConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header border-0 pb-0">
            <h2 class="modal-title fs-5">Confirm Deletion</h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body py-4">
            <p class="mb-0 fs-5">
              Are you sure you want to delete <strong>{{ selectedIds.length }}</strong> model(s)?
            </p>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
              :disabled="isDeleting"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleConfirmDelete"
              :disabled="isDeleting"
            >
              {{ isDeleting ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>
