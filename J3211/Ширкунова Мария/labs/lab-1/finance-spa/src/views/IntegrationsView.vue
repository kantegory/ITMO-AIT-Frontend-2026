<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />
  <main class="container py-5">
    <h2 class="mb-4">Подключение банков</h2>
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="card p-3 text-center border-primary shadow-sm">
          <h4>СберБанк</h4>
          <p>Автоматический импорт транзакций</p>
          <button class="btn btn-primary">Подключить</button>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card p-3 text-center shadow-sm">
          <h4>Tinkoff</h4>
          <p>Автоматический импорт транзакций</p>
          <button class="btn btn-outline-dark">Отключено</button>
        </div>
      </div>
    </div>
  </main>
</template>
