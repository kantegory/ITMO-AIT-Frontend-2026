<template>
  <section class="auth-hero" aria-labelledby="authHeroTitle">
    <div class="auth-hero__content">
      <span class="badge rounded-pill text-bg-light mb-3 px-3 py-2">mors and co</span>
      <h1 class="display-5 fw-bold mb-3" id="authHeroTitle">Tarelka</h1>
      <p class="lead mb-4">Управляйте доходами, расходами, бюджетами и подключёнными сервисами в одном месте.</p>

      <div class="hero-stats">
        <div class="hero-stat"><strong>SPA</strong><span>одностраничное приложение</span></div>
        <div class="hero-stat"><strong>Vue</strong><span>компоненты и маршруты</span></div>
        <div class="hero-stat"><strong>API</strong><span>axios + JSON Server</span></div>
      </div>

      <div class="hero-notes mt-4">
        <div class="hero-note-card">
          <IconSprite name="pie-chart" />
          <div>
            <h2>Аналитика</h2>
            <p>Отчёты строятся по тем же транзакциям, что и личный кабинет.</p>
          </div>
        </div>
        <div class="hero-note-card">
          <IconSprite name="shield-check" />
          <div>
            <h2>Компонентный подход</h2>
            <p>Повторяющиеся блоки вынесены в отдельные Vue-компоненты.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconSprite from './IconSprite.vue';
</script>
