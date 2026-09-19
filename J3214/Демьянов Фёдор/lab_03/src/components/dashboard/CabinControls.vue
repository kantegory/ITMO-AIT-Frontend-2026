<template>
  <section class="bento-card p-4 p-md-5 d-flex flex-column justify-content-between" aria-labelledby="cabinSystemsHeading">
    <h2 id="cabinSystemsHeading" class="text-uppercase letter-spacing-2 text-muted-custom fs-7 mb-4">
      Системы жизнеобеспечения каюты
    </h2>

    <div class="form-check form-switch d-flex justify-content-between align-items-center mb-3 px-0">
      <label class="form-check-label text-main fs-7 fw-medium" for="gravSwitch">
        Искусственная гравитация (1.0G / 0.38G)
      </label>
      <input
        class="form-check-input ms-0 mt-0 shadow-none telemetry-switch"
        type="checkbox"
        role="switch"
        id="gravSwitch"
        :checked="settings?.gravity"
        @change="onToggle('gravity', $event.target.checked, 'Режим гравитации')"
      >
    </div>

    <div class="form-check form-switch d-flex justify-content-between align-items-center mb-3 px-0">
      <label class="form-check-label text-main fs-7 fw-medium" for="foodSwitch">
        Гипоаллергенный рацион питания
      </label>
      <input
        class="form-check-input ms-0 mt-0 shadow-none telemetry-switch"
        type="checkbox"
        role="switch"
        id="foodSwitch"
        :checked="settings?.hypoallergenicFood"
        @change="onToggle('hypoallergenicFood', $event.target.checked, 'Бортовой рацион')"
      >
    </div>

    <div class="form-check form-switch d-flex justify-content-between align-items-center px-0">
      <label class="form-check-label text-main fs-7 fw-medium" for="dimSwitch">
        Автозатемнение иллюминатора каюты
      </label>
      <input
        class="form-check-input ms-0 mt-0 shadow-none telemetry-switch"
        type="checkbox"
        role="switch"
        id="dimSwitch"
        :checked="settings?.windowDimming"
        @change="onToggle('windowDimming', $event.target.checked, 'Затемнение иллюминатора')"
      >
    </div>
  </section>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth'

defineProps({
  settings: {
    type: Object,
    default: () => ({ gravity: true, hypoallergenicFood: false, windowDimming: true })
  }
})

const emit = defineEmits(['notify'])
const { updateCabinSetting } = useAuth()

const onToggle = async (key, value, name) => {
  const statusText = value ? 'АКТИВИРОВАН' : 'ДЕАКТИВИРОВАН'
  emit('notify', `${name}: статус изменен на [${statusText}]`)
  try {
    await updateCabinSetting(key, value)
  } catch (err) {
    emit('notify', 'Сбой связи с сервером при попытке обновить параметры каюты')
  }
}
</script>