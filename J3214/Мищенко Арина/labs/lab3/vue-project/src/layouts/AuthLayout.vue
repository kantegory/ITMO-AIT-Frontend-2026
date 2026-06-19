<template>
  <div class="auth-page min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div class="container">
        <router-link class="navbar-brand fw-bold text-primary" to="/">EduPlatform</router-link>
      </div>
    </nav>
    <div class="flex-grow-1 d-flex align-items-center justify-content-center py-4">
      <slot />
    </div>
  </div>
</template>
