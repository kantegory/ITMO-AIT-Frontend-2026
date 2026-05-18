<template>
  <header class="header">
    <div class="container header-inner">
      <div class="brand">TicketHub</div>

      <nav class="nav">
        <router-link to="/">Главная</router-link>
        <router-link to="/search">Поиск мероприятий</router-link>
        <router-link to="/profile">Личный кабинет</router-link>
        <router-link to="/organizer">Кабинет организатора</router-link>
      </nav>

      <div class="actions">
        <button class="btn btn-outline">Вход</button>
        <button class="btn btn-primary">Регистрация</button>
      </div>
    </div>
  </header>
</template>