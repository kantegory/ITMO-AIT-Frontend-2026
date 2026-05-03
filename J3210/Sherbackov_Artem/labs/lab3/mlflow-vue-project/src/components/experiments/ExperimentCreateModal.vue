<script setup>
import { ref } from "vue";
import { useExperimentStore } from "@/stores/experiments";

const props = defineProps({
  id: { type: String, default: "newExpModal" },
});

const store = useExperimentStore();
const form = ref({ name: "", model: "" });

const handleCreate = async () => {
  if (!form.value.name || !form.value.model) return;

  const success = await store.createExperiment({ ...form.value });
  if (success) {
    form.value = { name: "", model: "" };
    const modalEl = document.getElementById(props.id);
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance?.hide();
  }
};
</script>

<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header border-bottom-0">
          <h2 class="modal-title fs-5">Create New Experiment</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4 pt-0">
          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <label class="form-label">Experiment Name</label>
              <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Model</label>
              <input v-model="form.model" type="text" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Create</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
