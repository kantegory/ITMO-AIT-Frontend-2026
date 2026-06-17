<template>
  <div class="d-flex flex-column min-vh-100">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
          <router-link class="navbar-brand" to="/">Мои Заметки</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Главная</router-link>
              </li>
              </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow-1 py-4">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer class="bg-light py-3 mt-auto border-top">
      <div class="container text-center text-muted">
        <small>&copy; Домашняя работа №5</small>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BaseLayout'
}
</script>

<style scoped>
main {
  background-color: #f8f9fa;
}
</style>
