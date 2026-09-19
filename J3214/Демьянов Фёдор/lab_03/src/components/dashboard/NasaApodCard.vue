<template>
  <section class="bento-card p-4 p-md-5" aria-labelledby="nasaHeading">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-broadcast text-secondary" aria-hidden="true"></i>
        <h2 id="nasaHeading" class="text-uppercase letter-spacing-2 text-muted-custom fs-7 mb-0">
          Внешний телеметрический шлюз // NASA APOD
        </h2>
      </div>
      <span :class="[isOffline ? 'badge-silver' : 'badge-blue', 'px-2 py-1 fs-7 rounded']">
        {{ isOffline ? 'Offline Cache' : 'Public API Online' }}
      </span>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="text-center py-4" role="status">
      <div class="spinner-border text-light mb-2" role="status" style="width: 1.8rem; height: 1.8rem;">
        <span class="visually-hidden">Загрузка данных телеметрии NASA...</span>
      </div>
      <div class="text-muted-custom fs-7 letter-spacing-2 text-uppercase">
        Запрос снимка дня из астрофизической базы NASA...
      </div>
    </div>

    <!-- Контент -->
    <div v-else-if="apodData" aria-live="polite">
      <!-- Видеопоток -->
      <div v-if="apodData.media_type === 'video'" class="overflow-hidden rounded mb-3" style="height: 420px;">
        <iframe
          :src="apodData.url"
          :title="`Астрономическое видео дня NASA: ${apodData.title}`"
          class="w-100 h-100 rounded"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Фотоснимок -->
      <div
        v-else
        class="overflow-hidden rounded mb-3 position-relative bg-black bg-opacity-25 d-flex align-items-center justify-content-center"
        style="height: 420px;"
      >
        <img
          :src="apodData.hdurl || apodData.url"
          :alt="apodData.title"
          class="w-100 h-100 rounded"
          style="object-fit: cover; max-height: 420px;"
        >
      </div>

      <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <h3 class="text-main mb-0 fs-5 fw-bold">{{ apodData.title }}</h3>
        <span class="text-muted-custom fs-7 letter-spacing-2">{{ apodData.date }}</span>
      </div>
      <p class="text-muted-custom fs-7 mb-0" style="line-height: 1.6;">
        {{ apodData.explanation }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNasaApod } from '../../composables/useNasaApod'

const { apodData, isLoading, isOffline, fetchApod } = useNasaApod()

onMounted(fetchApod)
</script>