<template>
  <div class="card tripatropa-card mb-3">
    <div class="card-body">
      <h2 class="h6 mb-2">Добавить отзыв</h2>
      <div class="row g-2 align-items-end">
        <div class="col-md-7">
          <label class="form-label mb-1">Текст</label>
          <input
            v-model="text"
            type="text"
            class="form-control"
            placeholder="Краткий отзыв"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label mb-1">Оценка</label>
          <select v-model.number="rating" class="form-select">
            <option :value="5">5</option>
            <option :value="4">4</option>
            <option :value="3">3</option>
            <option :value="2">2</option>
            <option :value="1">1</option>
          </select>
        </div>
        <div class="col-md-2 d-grid">
          <button class="btn btn-primary" type="button" @click="submit">
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);
const text = ref("");
const rating = ref(5);

function submit() {
  const t = text.value.trim();
  if (!t) return;
  emit("submit", { text: t, rating: Number(rating.value) });
  text.value = "";
  rating.value = 5;
}
</script>
