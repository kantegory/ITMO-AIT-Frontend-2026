<template>
  <div class="planet-wrapper">
    <img
      src="/assets/images/Earth.png"
      alt=""
      :class="['planet-img', { active: activePlanet === 'earth' }]"
      aria-hidden="true"
    >
    <img
      src="/assets/images/Moon.png"
      alt=""
      :class="['planet-img', { active: activePlanet === 'moon' }]"
      aria-hidden="true"
    >
    <img
      src="/assets/images/Mars.png"
      alt=""
      :class="['planet-img', { active: activePlanet === 'mars' }]"
      aria-hidden="true"
    >
    <img
      src="/assets/images/Encelade.png"
      alt=""
      :class="['planet-img', { active: activePlanet === 'enceladus' }]"
      aria-hidden="true"
    >

    <div class="safety-card glass-panel p-4" aria-live="polite">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge-gold px-2 py-1 fs-7 rounded">{{ currentInfo.badge }}</span>
        <span class="text-muted-custom fs-7">{{ currentInfo.code }}</span>
      </div>
      <h2 class="text-uppercase letter-spacing-2 fs-6 text-main mb-3">
        {{ currentInfo.title }}
      </h2>
      <ul class="list-unstyled mb-0 safety-list">
        <li class="d-flex justify-content-between mb-2 border-bottom border-secondary border-opacity-25 pb-2">
          <span class="text-muted-custom">Гравитация:</span>
          <span class="fw-medium text-main">{{ currentInfo.gravity }}</span>
        </li>
        <li class="d-flex justify-content-between mb-2 border-bottom border-secondary border-opacity-25 pb-2">
          <span class="text-muted-custom">Длительность:</span>
          <span class="fw-medium text-main">{{ currentInfo.duration }}</span>
        </li>
        <li class="d-flex justify-content-between">
          <span class="text-muted-custom">Подготовка:</span>
          <span class="fw-medium text-main">{{ currentInfo.training }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  destination: {
    type: String,
    default: ''
  }
})

const planetsInfo = {
  earth: {
    title: 'Орбитальная станция МКС-2',
    code: 'EXP-00 // ORBIT',
    gravity: '0.00 G (Невесомость)',
    duration: '3-5 суток',
    training: 'Класс I (3 дня)',
    badge: 'Околоземная орбита'
  },
  moon: {
    title: 'Орбитальная станция "Селена"',
    code: 'EXP-01 // LUNA',
    gravity: '0.16 G',
    duration: '7 суток',
    training: 'Класс II (14 дней)',
    badge: 'Флагман сезона'
  },
  mars: {
    title: 'Марсианский аванпост',
    code: 'EXP-04 // MARS',
    gravity: '0.38 G',
    duration: '180 суток',
    training: 'Класс IV (3 мес.)',
    badge: 'Дальний рубеж'
  },
  enceladus: {
    title: 'Гейзеры Энцелада',
    code: 'EXP-06 // SATURN',
    gravity: '0.011 G',
    duration: '360 суток',
    training: 'Класс V (1 год)',
    badge: 'Глубокий космос'
  }
}

const activePlanet = computed(() => {
  return planetsInfo[props.destination] ? props.destination : 'moon'
})

const currentInfo = computed(() => {
  return planetsInfo[activePlanet.value]
})
</script>