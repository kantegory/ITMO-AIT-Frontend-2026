<template>
  <a class="axon-skip-link" href="#main-content">Skip to main content</a>
  <header class="axon-header">
    <div class="axon-container axon-header-row">
      <span class="axon-brand">AxonHub</span>
      <span class="axon-current-page">Explore</span>
    </div>
  </header>
  <main id="main-content" class="axon-container axon-main" tabindex="-1">
    <slot />
  </main>
  <footer class="axon-container axon-footer">AxonHub / Models, datasets &amp; ideas.</footer>
</template>
