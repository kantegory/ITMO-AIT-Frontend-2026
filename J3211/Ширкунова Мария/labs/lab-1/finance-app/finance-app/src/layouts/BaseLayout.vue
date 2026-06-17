<template>
  <div>
    <header class="p-3 bg-dark text-white">
      <div class="container d-flex justify-content-between align-items-center">
        <span class="navbar-brand fs-4">Мои Финансы</span>
      </div>
    </header>
    <main class="container py-5">
      <slot />
    </main>
  </div>
</template>

<script>
export default { name: 'BaseLayout' }
</script>
