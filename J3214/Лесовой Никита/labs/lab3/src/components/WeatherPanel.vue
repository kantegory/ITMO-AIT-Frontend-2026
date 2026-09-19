<script setup>
import { onMounted, ref, watch } from "vue";
import { weatherApi } from "../api";
import { useFormatters } from "../composables/useFormatters";

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
});

const forecast = ref(null);
const isLoading = ref(false);
const error = ref("");
const { formatDate, weatherText } = useFormatters();

async function loadWeather() {
  isLoading.value = true;
  error.value = "";

  try {
    const response = await weatherApi.getForecast(props.latitude, props.longitude);
    forecast.value = response.data;
  } catch (requestError) {
    error.value = "Не удалось получить прогноз погоды.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadWeather);
watch(() => [props.latitude, props.longitude], loadWeather);
</script>

<template>
  <section class="detail-card" aria-labelledby="weather-title">
    <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
      <h2 id="weather-title" class="h4 mb-0">Погода</h2>
      <span class="api-label">Open-Meteo API</span>
    </div>

    <p v-if="isLoading" class="mb-0">Загружаем прогноз…</p>
    <div v-else-if="error" class="alert alert-warning mb-0">{{ error }}</div>
    <template v-else-if="forecast">
      <p class="weather-current">
        Сейчас: <strong>{{ Math.round(forecast.current.temperature_2m) }} °C</strong>,
        {{ weatherText(forecast.current.weather_code).toLowerCase() }}
      </p>
      <div class="weather-grid">
        <div v-for="(date, index) in forecast.daily.time" :key="date" class="weather-day">
          <strong>{{ formatDate(date) }}</strong>
          <span>{{ weatherText(forecast.daily.weather_code[index]) }}</span>
          <span>
            {{ Math.round(forecast.daily.temperature_2m_min[index]) }}…{{ Math.round(forecast.daily.temperature_2m_max[index]) }} °C
          </span>
        </div>
      </div>
    </template>
  </section>
</template>
