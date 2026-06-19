<template>
  <div class="tab-pane fade show active">
    <h2 class="fs-5 fw-bold mb-4">Моё обучение</h2>
    <article class="d-flex flex-column flex-md-row gap-3 align-items-md-center p-3 rounded-4 mb-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);">
      <img src="/img/course1.png" class="rounded-3" style="width:100px; height:70px; object-fit:cover;" alt="Обложка курса">
      <div class="flex-grow-1">
        <h3 class="fs-6 fw-bold mb-1">Vue.js 3 с нуля</h3>
        <div class="d-flex justify-content-between opacity-75 small mb-1">
          <span>Прогресс</span>
          <span>75%</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div class="progress-bar bg-info" style="width: 75%;"></div>
        </div>
      </div>
      <router-link :to="{ name: 'course', params: { id: 1 } }" class="btn glass-btn btn-sm px-4 py-2 mt-2 mt-md-0">
        Продолжить
      </router-link>
    </article>

    <h2 class="fs-5 fw-bold mb-3 mt-5">Сертификаты</h2>
    <article class="d-flex align-items-center gap-3 p-3 rounded-4" style="background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2);">
      <span class="fs-2"><svg width="40" height="40" class="text-success" style="filter: none;"><use href="#icon-trophy"></use></svg></span>
      <div class="flex-grow-1">
        <h3 class="fs-6 fw-bold text-success mb-0">Основы HTML и CSS</h3>
        <span class="opacity-75 small">Выдан: 10 Марта 2026</span>
      </div>

      <button 
        v-tooltip="'Скачивается в формате PDF'" 
        class="btn btn-outline-success btn-sm rounded-pill px-3"
      >
        Скачать
      </button>
    </article>
  </div>
</template>