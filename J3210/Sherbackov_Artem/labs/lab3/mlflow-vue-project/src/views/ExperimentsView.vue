<script setup>
import { ref, computed, onMounted } from "vue";
import { useExperimentStore } from "@/stores/experiments";
import { useDate } from "@/composables/useDate";
import BaseLayout from "@/layouts/BaseLayout.vue";
import ExperimentCreateModal from "@/components/experiments/ExperimentCreateModal.vue";

const store = useExperimentStore();
const { formatDate } = useDate();

const searchQuery = ref("");
const selectedTag = ref("All");
const selectedIds = ref([]);

onMounted(() => store.fetchExperiments());

const filteredExperiments = computed(() => {
  return store.experiments.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesTag =
      selectedTag.value === "All" || (exp.tags && exp.tags.includes(selectedTag.value));
    return matchesSearch && matchesTag;
  });
});

const toggleSelectAll = (event) => {
  selectedIds.value = event.target.checked ? filteredExperiments.value.map((e) => e.id) : [];
};

const handleConfirmDelete = async () => {
  const success = await store.deleteExperiments(selectedIds.value);
  if (success) {
    selectedIds.value = [];
  }
};
</script>

<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1>Experiments</h1>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newExpModal">
          Create
        </button>
        <button
          class="btn"
          :class="selectedIds.length ? 'btn-danger' : 'btn-outline-danger'"
          :disabled="!selectedIds.length"
          data-bs-toggle="modal"
          data-bs-target="#deleteConfirmModal"
        >
          Delete ({{ selectedIds.length }})
        </button>
      </div>
    </header>

    <section class="card mb-4 shadow-sm border-0">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-8">
            <input
              v-model="searchQuery"
              type="search"
              class="form-control"
              placeholder="Search experiments..."
            />
          </div>
          <div class="col-md-4">
            <select v-model="selectedTag" class="form-select">
              <option value="All">All Tags</option>
              <option v-for="tag in store.allTags" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="card shadow-sm border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 40px">
                <input type="checkbox" class="form-check-input" @change="toggleSelectAll" />
              </th>
              <th>Name</th>
              <th>Created</th>
              <th>Description</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exp in filteredExperiments" :key="exp.id">
              <td>
                <input
                  type="checkbox"
                  :value="exp.id"
                  v-model="selectedIds"
                  class="form-check-input"
                />
              </td>
              <td>
                <router-link
                  :to="`/experiments/${exp.id}`"
                  class="text-decoration-none fw-semibold"
                >
                  {{ exp.name }}
                </router-link>
              </td>
              <td class="text-muted">{{ formatDate(exp.createdAt) }}</td>
              <td>{{ exp.model || "—" }}</td>
              <td>
                <span
                  v-for="tag in exp.tags"
                  :key="tag"
                  class="badge bg-light text-dark border me-1"
                >
                  {{ tag }}
                </span>
              </td>
            </tr>
            <tr v-if="!filteredExperiments.length">
              <td colspan="5" class="text-center py-4 text-muted">No experiments found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-body py-4 text-center">
            <h5>Confirm Deletion</h5>
            <p>Are you sure you want to delete {{ selectedIds.length }} experiment(s)?</p>
            <div class="d-flex justify-content-center gap-2 mt-4">
              <button class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button class="btn btn-danger" data-bs-dismiss="modal" @click="handleConfirmDelete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ExperimentCreateModal id="newExpModal" />
  </BaseLayout>
</template>
