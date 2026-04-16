<template>
  <div>
    <nav class="nav">
      <router-link to="/">Главная</router-link>
      <router-link to="/courses">Курсы</router-link>
      <router-link to="/cabinet">Кабинет</router-link>
      <router-link to="/login">Вход</router-link>
      <router-link to="/register">Регистрация</router-link>
    </nav>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f6f8;
}

.nav {
  display: flex;
  gap: 20px;
  padding: 20px 30px;
  background: #4da6ff;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.container {
  padding: 40px 30px;
}
</style>