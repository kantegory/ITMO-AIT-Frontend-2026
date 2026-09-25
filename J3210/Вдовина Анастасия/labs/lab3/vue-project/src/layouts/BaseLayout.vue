<template>
  <a class="skip-link" href="#main">Перейти к основному содержимому</a>

  <header-component />

  <slot name="hero" />

  <main id="main" class="container py-5">
    <slot />
  </main>

  <footer class="py-4">
    <div class="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
      <span class="text-muted">© 2026 EventTix</span>
      <a href="#main" class="text-muted">Наверх</a>
    </div>
  </footer>
</template>

<script>
import HeaderComponent from '@/components/common/HeaderComponent.vue'

export default {
  name: 'BaseLayout',
  components: { HeaderComponent },
}
</script>
