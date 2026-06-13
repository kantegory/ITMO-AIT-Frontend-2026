<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">UCL Tickets</router-link>
      <div class="navbar-nav ms-auto">
        <router-link class="nav-link" to="/">Home</router-link>
        <router-link class="nav-link" to="/tickets">Tickets</router-link>
        <router-link class="nav-link" to="/dashboard">My Account</router-link>
      </div>
    </div>
  </nav>

  <main class="container mt-4">
    <slot />
  </main>
</template>
