<template>
  <nav class="sidebar d-none d-md-block" role="navigation" aria-label="Основная навигация">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/dashboard">
            <svg class="nav-icon" aria-hidden="true">
              <use href="#icon-dashboard"></use>
            </svg>
            Dashboard
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/experiments">
            <svg class="nav-icon" aria-hidden="true">
              <use href="#icon-experiments"></use>
            </svg>
            Эксперименты
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/models">
            <svg class="nav-icon" aria-hidden="true">
              <use href="#icon-models"></use>
            </svg>
            Модели
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
