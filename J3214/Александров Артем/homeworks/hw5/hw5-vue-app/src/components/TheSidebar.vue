<template>
  <aside class="col-12 col-md-3 col-lg-2 theme-sidebar border-end theme-border p-4 d-flex flex-column justify-content-between sidebar">
    <div>
      <h1 class="h4 theme-text-main fw-bold mb-4" style="letter-spacing: -0.5px;">
        <i class="bi bi-stack me-1"></i> Moneta
      </h1>
      
      <nav class="nav flex-column gap-2">
        <a href="#" class="nav-link active-menu-item p-2 rounded-3">
          <i class="bi bi-layout-sidebar me-2"></i>
          <span>Главная панель</span>
        </a>
        <a href="#" class="nav-link text-secondary p-2 rounded-3">
          <i class="bi bi-search me-2"></i>
          <span>Поиск транзакций</span>
        </a>
        <a href="#" class="nav-link text-secondary p-2 rounded-3">
          <i class="bi bi-wallet me-2"></i>
          <span>Кошелек</span>
        </a>
        <a href="#" class="nav-link text-secondary p-2 rounded-3">
          <i class="bi bi-graph-up-arrow me-2"></i>
          <span>Анализ и отчеты</span>
        </a>
      </nav>
    </div>

    <div>
      <a href="#" class="nav-link text-secondary p-2 rounded-3 mb-1">
        <i class="bi bi-headphones me-2"></i>
        <span>Помощь</span>
      </a>
      <a href="#" class="nav-link text-secondary p-2 rounded-3 mb-1">
        <i class="bi bi-gear me-2"></i>
        <span>Настройки</span>
      </a>
      <a href="#" class="nav-link text-secondary p-2 rounded-3">
        <i class="bi bi-box-arrow-up-left me-2"></i>
        <span>Выйти</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
</script>

<style scoped>
@media (min-width: 768px) {
  aside.sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
}
</style>