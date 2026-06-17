import { ref } from "vue";

const modal = ref({
  show: false,
  title: "",
  message: "",
  type: "primary"
});

const confirmModal = ref({
  show: false,
  title: "",
  message: "",
  action: null
});

function showModal(title, message, type = "primary") {
  modal.value = { show: true, title, message, type };
}

function showConfirmModal(title, message, action) {
  confirmModal.value = { show: true, title, message, action };
}

function handleConfirm() {
  if (confirmModal.value.action) {
    confirmModal.value.action();
  }
}

export function useModal() {
  return {
    modal,
    confirmModal,
    showModal,
    showConfirmModal,
    handleConfirm
  };
}