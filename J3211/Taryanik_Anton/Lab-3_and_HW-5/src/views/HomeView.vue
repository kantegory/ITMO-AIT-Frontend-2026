<template>
  <div>
    <GuestNavbar :showLogin="true" />
    <main class="container">
      <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 85vh;">
        <div class="text-center" style="margin-top: -8vh; animation: fadeIn 0.8s ease-out;">
          <h1 class="display-5 fw-bold mb-3">Разметка данных для ML</h1>
          <p class="text-muted fs-5 mb-4 mx-auto" style="max-width: 600px;">
            Профессиональный инструмент для аннотации изображений и управления качеством обучения моделей.
          </p>
          <div class="d-flex justify-content-center gap-3 mb-5">
            <router-link to="/registration" class="btn btn-primary px-5 py-3 shadow-sm">Начать работу</router-link>
            <router-link to="/login" class="btn btn-outline-primary px-5 py-3">Войти</router-link>
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="card h-100 p-3 border-0 shadow-sm">
                <div class="mb-2">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lf-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M9 9h6v6H9z"></path>
                  </svg>
                </div>
                <div class="fw-bold small text-dark">Bounding Box</div>
                <div class="text-muted small" style="font-size: 0.75rem;">Детекция объектов</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card h-100 p-3 border-0 shadow-sm">
                <div class="mb-2">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lf-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <div class="fw-bold small text-dark">Polygon</div>
                <div class="text-muted small" style="font-size: 0.75rem;">Сегментация</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card h-100 p-3 border-0 shadow-sm">
                <div class="mb-2">
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--lf-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div class="fw-bold small text-dark">Quality</div>
                <div class="text-muted small" style="font-size: 0.75rem;">Контроль качества</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import GuestNavbar from '../components/GuestNavbar.vue'
</script>