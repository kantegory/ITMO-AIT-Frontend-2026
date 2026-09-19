<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { forkResource } from '../services/resources.js';
import { session } from '../composables/useSession.js';

const props = defineProps({ resource: { type: Object, required: true } });
const route = useRoute();
const router = useRouter();
const forkPending = ref(false);
const forkError = ref('');

async function fork() {
  if (forkPending.value || !session.value || !props.resource) {
    return;
  }

  forkPending.value = true;
  forkError.value = '';

  try {
    const created = await forkResource(props.resource, session.value.user);
    await router.push(`/resources/${created.id}`);
  } catch (cause) {
    forkError.value = cause.message;
  } finally {
    forkPending.value = false;
  }
}
</script>
<template>
  <section>
    <h2>Fork metadata</h2>
    <p>
      Create a public metadata copy in your library. Files, stars, subscriptions and comments are
      not copied.
    </p>
    <button v-if="session" class="btn btn-outline-primary" :disabled="forkPending" @click="fork">
      {{ forkPending ? 'Opening fork…' : 'Fork metadata' }}
    </button>
    <RouterLink v-else :to="{ path: '/login', query: { returnTo: route.fullPath } }"
      >Log in to fork</RouterLink
    >
    <p role="alert">{{ forkError }}</p>
  </section>
</template>
