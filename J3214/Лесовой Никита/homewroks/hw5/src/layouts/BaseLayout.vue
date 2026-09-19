<template>
  <div class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand fw-bold" to="/">Маршрут</RouterLink>
        <div class="navbar-nav ms-auto">
          <RouterLink class="nav-link" to="/">Направления</RouterLink>
          <RouterLink class="nav-link" to="/about">О проекте</RouterLink>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1">
      <slot />
    </main>

    <footer class="bg-dark text-light py-3 mt-auto">
      <div class="container">Учебный проект на Vue 3</div>
    </footer>
  </div>
</template>
