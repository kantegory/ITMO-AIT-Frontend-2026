<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold logo" to="/">PRIME</router-link>

        <div class="d-flex">
          <router-link to="/login" class="btn btn-outline-dark me-2 login-btn">Login</router-link>
          <router-link to="/register" class="btn btn-dark">Register</router-link>
        </div>
      </div>
    </nav>

    <main>
      <section class="hero">
        <div class="container text-center">
          <h1 class="hero-title">
            <span class="prime-letter">P<span class="prime-word">Productive</span></span>
            <span class="prime-letter">R<span class="prime-word">Resources</span></span>
            <span class="prime-letter">I<span class="prime-word">Integration</span></span>
            <span class="prime-letter">M<span class="prime-word">Management</span></span>
            <span class="prime-letter">E<span class="prime-word">Execution</span></span>
          </h1>

          <p class="hero-subtitle">Smart project management for modern teams</p>

          <router-link to="/register" class="btn btn-dark btn-lg mt-3">
            Get Started
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>