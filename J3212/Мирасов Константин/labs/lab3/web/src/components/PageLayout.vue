<script setup>
import AppHeader from './AppHeader.vue';
import AccountNotice from './AccountNotice.vue';

function skipToMain() {
  document.querySelector('#main-content')?.focus();
}
</script>
<template>
  <a class="axon-skip-link" href="#main-content" @click.prevent="skipToMain"
    >Skip to main content</a
  >
  <AppHeader />
  <main id="main-content" class="container-fluid axon-container axon-main" tabindex="-1">
    <AccountNotice />
    <slot />
  </main>
  <footer class="container-fluid axon-container axon-footer">
    <p>AxonHub / Models, datasets &amp; ideas.</p>
    <p>Learning preview · Sample resources only</p>
  </footer>
</template>
