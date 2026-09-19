<script setup>
import AuthForm from '../components/AuthForm.vue';
import Icon from '../components/Icon.vue';
</script>
<template>
  <div class="axon-auth-layout">
    <section class="axon-auth-intro">
      <Icon name="resource-network" />
      <h2>Good ideas start with shared knowledge.</h2>
      <p>Create a demo account to build your library.</p>
    </section>
    <section class="axon-panel">
      <h1 tabindex="-1">Create an account</h1>
      <AuthForm registration />
      <p>Already registered? <RouterLink to="/login">Log in</RouterLink></p>
    </section>
  </div>
</template>
