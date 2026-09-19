<script setup>
import AuthForm from '../components/AuthForm.vue';
import Icon from '../components/Icon.vue';
</script>
<template>
  <div class="axon-auth-layout">
    <section class="axon-auth-intro">
      <Icon name="resource-network" />
      <h2>Build on what you discover.</h2>
      <p>Save stars, follow resources and join the discussion.</p>
    </section>
    <section class="axon-panel">
      <h1 tabindex="-1">Log in</h1>
      <AuthForm />
      <p>New to AxonHub? <RouterLink to="/register">Create an account</RouterLink></p>
    </section>
  </div>
</template>
