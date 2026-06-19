import { ref } from 'vue';

export function useFormValidation() {
  const wasValidated = ref(false);

  function validateForm(formRef) {
    wasValidated.value = true;
    if (!formRef) return false;
    return formRef.checkValidity();
  }

  function resetValidation() {
    wasValidated.value = false;
  }

  return { wasValidated, validateForm, resetValidation };
}
