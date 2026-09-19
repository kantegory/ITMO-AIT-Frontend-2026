<template>
  <div class="auth-page">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold logo" to="/">PRIME</router-link>
      </div>
    </nav>

    <main id="main-content">
      <section class="auth-section">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-4 col-md-6">
              <div class="auth-card">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>