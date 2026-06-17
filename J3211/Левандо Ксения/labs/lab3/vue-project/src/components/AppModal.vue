<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  title: String,
  message: String,
  type: { type: String, default: "primary" },
  show: Boolean
});

const emit = defineEmits(["close"]);

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value);
});

watch(() => props.show, (val) => {
  if (val) modalInstance.show();
  else modalInstance.hide();
});

function close() {
  emit("close");
}
</script>

<template>
  <div ref="modalRef" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div
          class="modal-header"
          :class="{
            'bg-danger text-white': type === 'error',
            'bg-success text-white': type === 'success',
            'bg-warning': type === 'warning',
            'bg-info text-white': type === 'info'
          }"
        >
          <h5>{{ title }}</h5>
          <button class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body" v-html="message"></div>

        <div class="modal-footer">
          <button class="btn btn-primary" @click="close">
            OK
          </button>
        </div>

      </div>
    </div>
  </div>
</template>