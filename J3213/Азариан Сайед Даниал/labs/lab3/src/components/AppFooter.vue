<template>
  <footer class="py-4 border-top bg-white">
    <div class="container">
      <div class="home-footer-layout">
        <p class="m-0 text-secondary footer-brand">EventPass</p>
        <RouterLink class="footer-logo-link" to="/" aria-label="Логотип EventPass">
          <svg class="footer-logo-icon" aria-hidden="true">
            <use href="/assets/icons-sprite.svg#icon-ticket"></use>
          </svg>
        </RouterLink>
        <div class="d-flex gap-3 footer-links">
          <a href="#" class="text-secondary text-decoration-none">Помощь</a>
          <a href="https://t.me/Tr1pel" class="text-secondary text-decoration-none">Контакты</a>
          <a href="#" class="text-secondary text-decoration-none">Политика</a>
        </div>
      </div>
    </div>
  </footer>
</template>
