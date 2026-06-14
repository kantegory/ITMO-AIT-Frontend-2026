<template>
  <section class="container">
    <div class="hero-card p-4 p-lg-5">
      <div class="home-hero-grid align-items-start g-4">
        <div class="w-100">
          <div class="home-hero-head">
            <h1 class="section-title home-hero-title mb-0">Миграция сервиса личных финансов на Vue</h1>
            <svg class="home-bank-icon" aria-hidden="true"><use href="/icons/sprite.svg#icon-bank"></use></svg>
          </div>
          <p class="lead muted mb-4 mt-3">
            В приложении есть клиентская маршрутизация, axios для работы с API, composable для авторизации и темы,
            а также повторно используемые компоненты для отчётов и списка транзакций.
          </p>
          <div class="d-flex flex-wrap gap-3">
            <RouterLink class="btn btn-primary btn-lg" to="/dashboard">Кабинет</RouterLink>
            <RouterLink class="btn btn-outline-primary btn-lg" to="/transactions">Транзакции</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-1">
      <div class="col-md-4">
        <article class="stat-card h-100">
          <div class="badge-soft mb-3">
            <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-user"></use></svg>
            Auth composable
          </div>
          <h2 class="h4">Авторизация</h2>
          <p class="muted mb-0">Логика входа, регистрации и хранения сессии вынесена в отдельный composable.</p>
        </article>
      </div>
      <div class="col-md-4">
        <article class="stat-card h-100">
          <div class="badge-soft mb-3">
            <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-filter"></use></svg>
            Vue Router
          </div>
          <h2 class="h4">Маршрутизация</h2>
          <p class="muted mb-0">Страницы разделены на route-компоненты, а доступ к защищённым экранам ограничен guard.</p>
        </article>
      </div>
      <div class="col-md-4">
        <article class="stat-card h-100">
          <div class="badge-soft mb-3">
            <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-chart"></use></svg>
            Axios + fallback
          </div>
          <h2 class="h4">Работа с API</h2>
          <p class="muted mb-0">Если моковый API не запущен, приложение остаётся рабочим благодаря локальному fallback-хранилищу.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
