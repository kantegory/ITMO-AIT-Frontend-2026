<template>
  <div class="card tripatropa-card mb-4 mt-2">
    <div class="card-body">
      <form
        class="row gy-3 gx-3 align-items-end"
        aria-describedby="searchFormHelp"
        @submit.prevent
      >
        <div class="col-md-4">
          <label for="destinationInput" class="form-label">Направление</label>
          <input
            v-model="local.query"
            type="text"
            class="form-control"
            id="destinationInput"
            placeholder="Стамбул, Иран, Дзержинск"
            autocomplete="off"
          />
        </div>
        <div class="col-md-2">
          <label for="typeSelect" class="form-label">Тип</label>
          <select v-model="local.type" class="form-select" id="typeSelect">
            <option value="any">Любой</option>
            <option value="city">Город</option>
            <option value="nature">Природа</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="budgetRange" class="form-label d-flex justify-content-between">
            <span>Бюджет до</span>
            <span class="text-muted-sm">{{ local.budget }} ₽</span>
          </label>
          <input
            v-model.number="local.budget"
            type="range"
            class="form-range"
            min="10000"
            max="200000"
            step="10000"
            id="budgetRange"
          />
        </div>
        <div class="col-md-2">
          <label for="durationSelect" class="form-label">Длительность</label>
          <select v-model="local.duration" class="form-select" id="durationSelect">
            <option value="any">Любая</option>
            <option value="1-3">1–3 дня</option>
            <option value="4-7">4–7 дней</option>
            <option value="8-14">8–14 дней</option>
            <option value="15+">15+ дней</option>
          </select>
        </div>
        <div class="col-md-1 d-grid">
          <button
            type="submit"
            class="btn btn-primary w-100"
            aria-label="Найти маршруты"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div id="searchFormHelp" class="visually-hidden">
          Форма фильтрации маршрутов по направлению, типу, бюджету и длительности.
        </div>
        <div class="col-12 d-flex justify-content-between align-items-center mt-2">
          <div class="text-muted-sm">Найдено {{ countText }}.</div>
          <div>
            <label for="sortSelect" class="form-label me-2 mb-0 text-muted-sm">
              Сортировка
            </label>
            <select
              v-model="local.sort"
              id="sortSelect"
              class="form-select form-select-sm d-inline-block"
              style="width: auto"
            >
              <option value="popular">Популярность</option>
              <option value="price">Цена</option>
              <option value="duration">Длительность</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  countText: { type: String, default: "" },
  initial: {
    type: Object,
    default: () => ({
      query: "",
      type: "any",
      budget: 200000,
      duration: "any",
      sort: "popular"
    })
  }
});

const emit = defineEmits(["change"]);
const local = reactive({ ...props.initial });

watch(
  local,
  (val) => {
    emit("change", { ...val });
  },
  { deep: true, immediate: true }
);
</script>
