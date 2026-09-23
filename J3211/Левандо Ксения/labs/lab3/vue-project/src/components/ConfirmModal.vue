<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  title: String,
  message: String,
  show: Boolean
});

const emit = defineEmits(["confirm", "close"]);

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value);
});

watch(() => props.show, (val) => {
  if (val) modalInstance.show();
  else modalInstance.hide();
});

function confirm() {
  emit("confirm");
  emit("close");
}

function close() {
  emit("close");
}
</script>

<template>
  <div ref="modalRef" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5>{{ title }}</h5>
          <button class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          {{ message }}
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="close">
            Cancel
          </button>
          <button class="btn btn-danger" @click="confirm">
            Yes
          </button>
        </div>

      </div>
    </div>
  </div>
</template>