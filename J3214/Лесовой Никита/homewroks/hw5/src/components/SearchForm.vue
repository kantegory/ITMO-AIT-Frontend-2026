<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["update:modelValue", "reset"]);

function updateSearch(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <form class="search-form" @submit.prevent>
    <div class="field">
      <label for="destination-search">Название города или региона</label>
      <input
        id="destination-search"
        type="search"
        :value="modelValue"
        placeholder="Например, Казань"
        autocomplete="off"
        @input="updateSearch"
      >
    </div>
    <button type="button" class="secondary-button" @click="emit('reset')">Сбросить</button>
  </form>
</template>
