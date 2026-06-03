<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />
  <main class="container py-5">
    <section class="card p-4 shadow-sm mb-4">
      <h5>Использование бюджета (Октябрь)</h5>
      <div class="mt-4">
        <p class="mb-1">Продукты (потрачено 8000 из 10000 ₽)</p>
        <div class="progress mb-3">
          <div class="progress-bar bg-warning" style="width: 80%">80%</div>
        </div>
        <p class="mb-1">Развлечения (потрачено 5000 из 5000 ₽)</p>
        <div class="progress mb-3">
          <div class="progress-bar bg-danger" style="width: 100%">100%</div>
        </div>
        <p class="mb-1">Транспорт (потрачено 2000 из 6000 ₽)</p>
        <div class="progress mb-3">
          <div class="progress-bar bg-success" style="width: 33%">33%</div>
        </div>
      </div>
    </section>
    <div class="text-center">
      <router-link to="/integrations" class="btn btn-outline-primary">
        Перейти к интеграциям
      </router-link>
    </div>
  </main>
</template>
