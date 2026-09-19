<template>
  <section
    class="glass-panel p-2 mb-5 overflow-hidden"
    aria-label="Фотохроника экспедиции"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="position-relative">
      <!-- Индикаторы слайдов -->
      <div class="carousel-indicators mb-2">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          type="button"
          :class="{ active: currentSlide === index }"
          :aria-current="currentSlide === index ? 'true' : undefined"
          :aria-label="`Снимок ${index + 1}`"
          @click="goToSlide(index)"
        ></button>
      </div>

      <!-- Контейнер и скользящая полоса кадров -->
      <div class="carousel-inner rounded overflow-hidden" style="height: 480px;">
        <div
          class="slider-track d-flex h-100"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="slider-slide position-relative flex-shrink-0 w-100 h-100"
          >
            <img
              :src="`/${slide.img}`"
              class="d-block w-100 h-100"
              style="object-fit: cover;"
              :alt="slide.title"
            >
            <div class="carousel-caption d-none d-md-block text-start carousel-caption-glass p-3 rounded">
              <h3 class="text-main mb-1 fs-5">{{ slide.title }}</h3>
              <p class="fs-7 text-muted-custom mb-0">{{ slide.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки управления слайдером -->
      <button
        class="carousel-control-prev"
        type="button"
        aria-label="Предыдущий снимок"
        @click="prevSlide"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        aria-label="Следующий снимок"
        @click="nextSlide"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  }
})

const currentSlide = ref(0)
let autoplayTimer = null

const nextSlide = () => {
  if (props.slides.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % props.slides.length
}

const prevSlide = () => {
  if (props.slides.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Автоматическое переключение каждые 5 секунд с остановкой при наведении
const startAutoplay = () => {
  stopAutoplay()
  if (props.slides.length > 1) {
    autoplayTimer = setInterval(nextSlide, 5000)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// Перезапуск таймера при смене списка слайдов
watch(() => props.slides, () => {
  currentSlide.value = 0
  startAutoplay()
}, { immediate: true })

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<style scoped>
.slider-track {
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}
</style>