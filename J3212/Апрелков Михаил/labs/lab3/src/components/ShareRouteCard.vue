<template>
  <section class="card tripatropa-card mb-4" aria-labelledby="share-route-title">
    <div class="card-body">
      <h2 class="h5 mb-3" id="share-route-title">Поделиться маршрутом</h2>
      <p class="text-muted-sm">Скопируйте ссылку и отправьте её друзьям.</p>
      <div class="input-group mb-3">
        <span class="input-group-text">
          <i class="bi bi-link-45deg"></i>
        </span>
        <label for="shareRouteInput" class="visually-hidden">Ссылка на маршрут</label>
        <input
          type="text"
          class="form-control"
          id="shareRouteInput"
          :value="url"
          readonly
        />
        <button class="btn btn-primary" type="button" @click="copy">
          <i class="bi bi-clipboard me-1"></i> Копировать
        </button>
      </div>
      <div v-if="status" class="text-muted-sm">{{ status }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  url: { type: String, required: true }
});
const status = ref("");

async function copy() {
  try {
    await navigator.clipboard.writeText(props.url);
    status.value = "Ссылка скопирована";
  } catch (e) {
    status.value = "Не удалось скопировать";
  }
  setTimeout(() => (status.value = ""), 2000);
}
</script>
