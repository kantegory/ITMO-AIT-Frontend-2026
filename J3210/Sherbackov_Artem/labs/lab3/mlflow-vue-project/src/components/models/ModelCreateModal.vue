<script setup>
import { ref } from "vue";
import { useModelStore } from "@/stores/models";

const props = defineProps({
  id: { type: String, required: true },
});

const store = useModelStore();
const form = ref({ name: "", description: "" });

const handleCreate = async () => {
  if (!form.value.name) return;

  const success = await store.createModel({ ...form.value });
  if (success) {
    form.value = { name: "", description: "" };

    const modalElement = document.getElementById(props.id);
    const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  }
};
</script>

<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header">
          <h2 class="modal-title fs-5">Create New Model</h2>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <label class="form-label">Model Name</label>
              <input v-model="form.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="form.description" class="form-control" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-100">Create</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
