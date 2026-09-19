<script setup>
import { computed, ref, nextTick } from 'vue';
import { session } from '../composables/useSession.js';
import { useLoad } from '../composables/useLoad.js';
import { getResources } from '../services/resources.js';
import { getSubscriptions } from '../services/social.js';
import ResourceRow from '../components/ResourceRow.vue';
import UserAvatar from '../components/UserAvatar.vue';

const subscriptionHeading = ref(null);

async function refreshSubscriptions() {
  await subscriptions.reload();
  await nextTick();
  subscriptionHeading.value?.focus();
}

const user = computed(() => session.value?.user);
const own = useLoad(() => getResources(user.value.id));
const subscriptions = useLoad(async () => {
  const [relations, resources] = await Promise.all([
    getSubscriptions('userId', user.value.id),
    getResources(),
  ]);
  const ids = new Set(relations.map((row) => row.resourceId));
  const rows = resources.filter((resource) => ids.has(resource.id));

  return { rows, missing: ids.size - rows.length };
});
</script>
<template>
  <h1 tabindex="-1">Your library</h1>
  <section class="axon-profile-card" aria-labelledby="profile-heading">
    <UserAvatar :name="user?.displayName" />
    <div class="axon-profile-info">
      <h2 id="profile-heading">Your profile</h2>
      <p class="axon-profile-name">{{ user?.displayName }}</p>
      <p class="axon-profile-email">
        <span class="visually-hidden">Email: </span>{{ user?.email }}
      </p>
    </div>
  </section>
  <section class="axon-profile-section" aria-labelledby="own-heading">
    <h2 id="own-heading">Your resources</h2>
    <p v-if="own.loading.value" role="status">Loading resources…</p>
    <div v-else-if="own.error.value" role="alert">
      {{ own.error.value.message }}
      <button class="btn btn-outline-primary" @click="own.reload">Retry your resources</button>
    </div>
    <ul v-else-if="own.data.value?.length" class="axon-resource-list">
      <ResourceRow
        v-for="resource in own.data.value"
        :key="resource.id"
        :resource="resource"
        @changed="refreshSubscriptions"
      />
    </ul>
    <p v-else>You have no resources yet. Open a resource and fork its metadata to get started.</p>
  </section>
  <section class="axon-profile-section" aria-labelledby="subscriptions-heading">
    <h2 id="subscriptions-heading" ref="subscriptionHeading" tabindex="-1">Subscriptions</h2>
    <p v-if="subscriptions.loading.value" role="status">Loading subscriptions…</p>
    <div v-else-if="subscriptions.error.value" role="alert">
      {{ subscriptions.error.value.message }}
      <button class="btn btn-outline-primary" @click="subscriptions.reload">
        Retry subscriptions
      </button>
    </div>
    <template v-else
      ><p v-if="subscriptions.data.value?.missing" role="status">
        {{ subscriptions.data.value.missing }} unavailable resources were skipped.
      </p>
      <ul v-if="subscriptions.data.value?.rows.length" class="axon-resource-list">
        <ResourceRow
          v-for="resource in subscriptions.data.value.rows"
          :key="resource.id"
          :resource="resource"
          @changed="refreshSubscriptions"
        />
      </ul>
      <p v-else>
        No subscriptions yet. <RouterLink to="/explore">Explore resources</RouterLink> to find
        something to follow.
      </p>
    </template>
  </section>
</template>
