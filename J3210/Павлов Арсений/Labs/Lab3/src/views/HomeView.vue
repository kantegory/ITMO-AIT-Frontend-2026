<template>
  <section class="glass-card hero-panel mb-4 reveal">
    <h1 class="page-title">Лабораторная работа 3, вариант 4</h1>
    <p class="page-subtitle mb-3">
      Миграция FinTrack Pro на Vue SPA: клиентская маршрутизация, composable, интеграция с внешним API через axios.
    </p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink class="btn btn-accent" to="/login">Перейти к входу</RouterLink>
      <RouterLink class="btn btn-outline-accent" to="/register">Регистрация</RouterLink>
    </div>
  </section>

  <section class="row g-3">
    <div class="col-md-6 col-xl-4 reveal delay-1">
      <article class="glass-card p-3 p-md-4 h-100">
        <h2 class="h5 section-title">Вход и регистрация</h2>
        <p class="text-muted-custom text-clamp">Авторизация через /login и /register, хранение JWT в localStorage.</p>
      </article>
    </div>
    <div class="col-md-6 col-xl-4 reveal delay-2">
      <article class="glass-card p-3 p-md-4 h-100">
        <h2 class="h5 section-title">Vue Router</h2>
        <p class="text-muted-custom text-clamp">Приватные маршруты защищены navigation guard и meta-полями.</p>
      </article>
    </div>
    <div class="col-md-6 col-xl-4 reveal delay-3">
      <article class="glass-card p-3 p-md-4 h-100">
        <h2 class="h5 section-title">Данные из API</h2>
        <p class="text-muted-custom text-clamp">Счета, операции, бюджеты и интеграции загружаются с mock API.</p>
      </article>
    </div>
  </section>
</template>
