<template>
  <header class="border-bottom bg-white mb-4 shadow-sm">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <RouterLink class="navbar-brand fw-semibold" to="/">
          Travel Planner
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto gap-lg-2">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/search">Поиск</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/collaboration">Совместно</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/profile">Кабинет</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Вход</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
