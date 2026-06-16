<template>
  <main class="container py-4">
    <section class="hub-card text-center">
      <h1 class="fw-bold mb-2">Страница не найдена</h1>
      <p class="muted mb-4">Такого маршрута нет в приложении.</p>
      <RouterLink :to="{ name: 'search' }" class="btn btn-primary">Вернуться к поиску</RouterLink>
    </section>
  </main>
</template>
