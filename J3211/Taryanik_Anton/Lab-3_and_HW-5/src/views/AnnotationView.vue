<template>
  <div class="bg-light vh-100 d-flex flex-column">
    <header class="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center shadow-sm">
      <div style="min-width: 200px;">
        <router-link to="/dashboard" class="text-white text-decoration-none fw-bold opacity-75 custom-hover">
          Назад к проектам
        </router-link>
      </div>
      <div class="text-center flex-grow-1 text-white-50 small fw-medium text-truncate px-3">
        Autonomous Driving <span class="mx-1">/</span> image_0042.jpg
      </div>
      <div class="d-flex gap-2 justify-content-end" style="min-width: 200px;">
        <button class="btn btn-outline-light btn-sm fw-medium">Пропустить</button>
        <button class="btn btn-primary btn-sm fw-medium shadow-sm" @click="saveAnnotation">Сохранить и Далее</button>
      </div>
    </header>

    <div class="container-fluid flex-grow-1">
      <div class="row h-100">
        <div class="col-md-3 col-lg-2 bg-white border-end p-3 overflow-auto">
          <h6 class="fw-bold text-muted text-uppercase mb-3">Инструменты</h6>
          <div class="btn-group-vertical w-100 mb-4">
            <input v-model="activeTool" type="radio" class="btn-check" value="move" id="toolMove">
            <label class="btn btn-outline-secondary text-start" for="toolMove">Перемещение</label>
            <input v-model="activeTool" type="radio" class="btn-check" value="bbox" id="toolBbox">
            <label class="btn btn-outline-secondary text-start" for="toolBbox">Bounding Box</label>
          </div>

          <h6 class="fw-bold text-muted text-uppercase mb-3">Классы</h6>
          <div class="list-group">
            <button type="button" :class="['list-group-item list-group-item-action', { active: activeClass === 1 }]" @click="activeClass = 1" style="border-left: 4px solid #ef4444;">Автомобиль (1)</button>
            <button type="button" :class="['list-group-item list-group-item-action', { active: activeClass === 2 }]" @click="activeClass = 2" style="border-left: 4px solid #3b82f6;">Пешеход (2)</button>
            <button type="button" :class="['list-group-item list-group-item-action', { active: activeClass === 3 }]" @click="activeClass = 3" style="border-left: 4px solid #10b981;">Светофор (3)</button>
          </div>
        </div>

        <div class="col-md-9 col-lg-10 p-4 d-flex align-items-center justify-content-center" style="background-color: #e2e8f0;">
          <div class="position-relative bg-white shadow-sm border border-secondary" style="width: 800px; height: 500px; background-image: repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%, #f1f5f9), repeating-linear-gradient(45deg, #f1f5f9 25%, var(--lf-bg) 25%, var(--lf-bg) 75%, #f1f5f9 75%, #f1f5f9); background-position: 0 0, 10px 10px; background-size: 20px 20px;">
            <div class="position-absolute top-50 start-50 translate-middle text-muted fw-bold">
              Рабочая область Canvas для изображения
            </div>
            <div class="position-absolute border border-danger border-2" style="top: 30%; left: 40%; width: 150px; height: 100px; background-color: rgba(239, 68, 68, 0.2);">
              <span class="badge bg-danger position-absolute top-0 start-0 translate-middle-y">Автомобиль</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div ref="toastEl" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            Разметка сохранена. Переход к следующему изображению.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

const activeTool = ref('move')
const activeClass = ref(1)
const toastEl = ref(null)
let toastInstance = null

onMounted(() => {
  toastInstance = new bootstrap.Toast(toastEl.value)
})

const saveAnnotation = () => {
  toastInstance.show()
}
</script>