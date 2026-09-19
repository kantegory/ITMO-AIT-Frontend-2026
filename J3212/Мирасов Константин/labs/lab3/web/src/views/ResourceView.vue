<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { getResource } from '../services/resources.js';
import { useLoad } from '../composables/useLoad.js';
import ResourceActions from '../components/ResourceActions.vue';
import DiscussionList from '../components/DiscussionList.vue';
import Icon from '../components/Icon.vue';
import ResourceInformation from '../components/ResourceInformation.vue';
import ResourceDocumentation from '../components/ResourceDocumentation.vue';
import ResourceFork from '../components/ResourceFork.vue';

const route = useRoute();
const id = Number(route.params.id);
const {
  data: resource,
  loading,
  error,
  reload,
} = useLoad(async () => {
  if (!/^[1-9]\d*$/.test(route.params.id)) {
    throw Object.assign(new Error('Resource not found.'), { status: 404 });
  }

  return getResource(id);
});
watch(resource, (value) => {
  if (value) {
    document.title = `${value.name} · AxonHub`;
  }
});

const manifest = `${import.meta.env.BASE_URL}assets/demo/resource-manifest.json`;
</script>
<template>
  <RouterLink to="/explore">← Back to Explore</RouterLink>
  <h1 tabindex="-1">
    {{ resource?.name || (error?.status === 404 ? 'Resource not found' : 'Resource details') }}
  </h1>
  <p v-if="loading" role="status">Loading resource…</p>
  <div v-if="error" role="alert">
    <p>{{ error.status === 404 ? 'This resource does not exist.' : error.message }}</p>
    <button v-if="error.status !== 404" class="btn btn-outline-primary" @click="reload">
      Retry resource
    </button>
  </div>
  <template v-else-if="resource">
    <p class="axon-resource-owner">
      <span
        class="axon-resource-type"
        :class="{ 'axon-resource-type--dataset': resource.type === 'dataset' }"
        >{{ resource.type === 'dataset' ? 'Dataset' : 'Model' }}</span
      ><Icon name="person" />{{ resource.authorName }}
    </p>
    <p>{{ resource.summary }}</p>
    <p v-if="resource.sourceResourceId">
      Forked from
      <RouterLink :to="`/resources/${resource.sourceResourceId}`"
        >source resource #{{ resource.sourceResourceId }}</RouterLink
      >
    </p>
    <section aria-label="Resource actions">
      <ResourceActions :resource-id="id" />
    </section>
    <div class="axon-detail-grid">
      <ResourceInformation :resource="resource" />
      <div class="axon-panel">
        <ResourceDocumentation :resource="resource" />
        <ResourceFork :resource="resource" />
        <DiscussionList :resource-id="id" />
        <section>
          <h2>Download information</h2>
          <p>Demo downloads: {{ resource.downloadCount }}</p>
          <p>The JSON contains shared sample metadata, not model weights or a full dataset.</p>
          <a class="btn btn-primary" :href="manifest" download="axonhub-demo-manifest.json"
            ><Icon name="download" />Download demo manifest</a
          >
        </section>
      </div>
    </div>
  </template>
</template>
