<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom app-navbar">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold logo-n3n" to="/">n3n</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#appNavbar"
        aria-controls="appNavbar"
        aria-expanded="false"
        aria-label="Переключить навигацию"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="appNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Dashboard</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/workspaces">Workspaces</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/create">Create workspace</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>