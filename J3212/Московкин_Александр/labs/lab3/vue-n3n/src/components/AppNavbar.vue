<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom mb-4" aria-label="Навигация">
      <div class="container">
        <router-link class="navbar-brand fw-bold d-flex align-items-center" to="/dashboard" aria-label="n3n">
          <span class="logo-n3n">
            <span class="logo-n3n-black">n</span><span class="logo-n3n-red">3</span><span class="logo-n3n-black">n</span>
          </span>
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Переключить навигацию">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/workspaces" active-class="active">
                Пространства
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/community" active-class="active">
                Сообщество
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/search" active-class="active">
                Поиск
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile" active-class="active">
                Профиль
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>