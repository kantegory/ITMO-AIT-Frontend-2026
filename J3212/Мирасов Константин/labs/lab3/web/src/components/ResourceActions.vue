<script setup>
import { useId } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { session } from '../composables/useSession.js';
import { useResourceActions } from '../composables/useResourceActions.js';
import Icon from './Icon.vue';

const props = defineProps({ resourceId: { type: Number, required: true } });
const emit = defineEmits(['changed']);
const route = useRoute();
const router = useRouter();
const countId = useId();
const { state, starred, subscribed, count, refresh, toggleStar, toggleSubscription } =
  useResourceActions(() => props.resourceId);

function signIn() {
  return router.push({ path: '/login', query: { returnTo: route.fullPath } });
}

function star() {
  if (!session.value) {
    return signIn();
  }

  return toggleStar();
}

async function subscribe() {
  if (!session.value) {
    return signIn();
  }

  await toggleSubscription();

  if (!state.value.error) {
    emit('changed');
  }
}
</script>
<template>
  <div class="axon-actions">
    <div class="axon-action-buttons">
      <button
        type="button"
        class="btn btn-outline-primary axon-social-button axon-star-button"
        aria-label="Star"
        :aria-describedby="countId"
        :title="!session ? 'Log in to star' : starred ? 'Remove star' : 'Star resource'"
        :aria-pressed="session ? starred : undefined"
        :disabled="!!session && (!state.loaded || state.starPending || state.loading)"
        @click="star"
      >
        <Icon
          :name="starred ? 'star-fill' : 'star'"
          :class="{ 'axon-star-selected': starred }"
        /><span class="axon-action-count" aria-hidden="true">{{ state.loaded ? count : '—' }}</span>
      </button>
      <span :id="countId" class="visually-hidden">{{
        state.loaded ? `${count} stars` : 'Star count unavailable'
      }}</span>
      <button
        type="button"
        class="btn btn-outline-primary axon-social-button axon-subscribe-button"
        aria-label="Subscribe"
        :title="
          !session ? 'Log in to subscribe' : subscribed ? 'Unsubscribe' : 'Subscribe to resource'
        "
        :aria-pressed="session ? subscribed : undefined"
        :disabled="!!session && (!state.loaded || state.subscriptionPending || state.loading)"
        @click="subscribe"
      >
        <Icon name="bell" /><span
          v-if="subscribed"
          class="axon-subscription-check"
          aria-hidden="true"
          >✓</span
        >
      </button>
    </div>
    <p v-if="state.error" role="alert">
      {{ state.error }}
      <button class="btn btn-outline-primary" :disabled="state.loading" @click="refresh">
        Reload actions
      </button>
    </p>
    <p class="visually-hidden" role="status" aria-atomic="true">
      {{ state.message }}
    </p>
  </div>
</template>
