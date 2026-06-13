<template>
  <section class="card p-5 text-center">
    <h1 class="display-5">404</h1>
    <p class="lead">Такой страницы нет.</p>
    <RouterLink class="btn btn-primary mx-auto" :to="{ name: 'home' }">Вернуться к турам</RouterLink>
  </section>
</template>
