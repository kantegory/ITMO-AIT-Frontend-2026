<script setup>
import { nextTick, ref, watch } from 'vue';
import { accountNotice, dismissAccountNotice } from '../composables/useSession.js';

const NOTICE_DURATION_MS = 2000;
const COUNTDOWN_INTERVAL_MS = 100;
const remaining = ref(NOTICE_DURATION_MS / 1000);
const version = ref(0);

watch(
  accountNotice,
  (notice, previous, onCleanup) => {
    version.value++;
    remaining.value = NOTICE_DURATION_MS / 1000;

    if (!notice || notice.tone === 'error') {
      return;
    }

    const started = Date.now();
    const countdown = setInterval(() => {
      remaining.value = Math.max(
        0,
        Math.ceil((NOTICE_DURATION_MS - (Date.now() - started)) / COUNTDOWN_INTERVAL_MS) / 10,
      );
    }, COUNTDOWN_INTERVAL_MS);

    const timeout = setTimeout(() => {
      if (accountNotice.value === notice) {
        dismissAccountNotice();
      }
    }, NOTICE_DURATION_MS);

    onCleanup(() => {
      clearInterval(countdown);
      clearTimeout(timeout);
    });
  },
  { immediate: true },
);

async function dismiss() {
  dismissAccountNotice();
  await nextTick();
  document.querySelector('main h1')?.focus({ preventScroll: true });
}
</script>
<template>
  <Transition name="axon-notice" appear>
    <div v-if="accountNotice" :key="version" class="axon-notice-slot">
      <div class="axon-notice-clip">
        <div
          class="axon-account-notice"
          :class="[
            `axon-account-notice--${accountNotice.tone}`,
            { 'axon-account-notice--timed': accountNotice.tone !== 'error' },
          ]"
        >
          <p :role="accountNotice.tone === 'error' ? 'alert' : 'status'" aria-atomic="true">
            {{ accountNotice.message }}
          </p>
          <span
            v-if="accountNotice.tone !== 'error'"
            class="axon-notice-countdown"
            aria-hidden="true"
            >{{ remaining }}s</span
          >
          <button
            v-else
            type="button"
            class="btn btn-outline-primary"
            aria-label="Dismiss account notification"
            @click="dismiss"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
