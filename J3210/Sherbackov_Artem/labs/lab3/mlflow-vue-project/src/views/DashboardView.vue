<script setup>
import { onMounted } from "vue";
import { useExperimentStore } from "@/stores/experiments";
import BaseLayout from "@/layouts/BaseLayout.vue";
import ExperimentCard from "@/components/experiments/ExperimentCard.vue";
import ExperimentCreateModal from "@/components/experiments/ExperimentCreateModal.vue";
import VIcon from "@/components/VIcon.vue";

const experimentStore = useExperimentStore();

onMounted(() => {
  experimentStore.fetchExperiments();
});
</script>

<template>
  <BaseLayout>
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1>Home</h1>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newExperimentModal">
        New Experiment
      </button>
    </header>

    <section class="mb-4">
      <div class="alert alert-info d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <VIcon name="icon-docs" width="32" height="32" class="opacity-50" />
          <div>
            <strong>Documentation</strong><br />
            Learn how to use Pipes
          </div>
        </div>
        <a
          href="https://mlflow.org/docs/latest/index.html"
          target="_blank"
          class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
        >
          <VIcon name="icon-docs" width="16" height="16" /> Open Docs
        </a>
      </div>
    </section>

    <section>
      <h2 class="mb-4">Your Experiments</h2>

      <div v-if="experimentStore.isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        <ExperimentCard
          v-for="exp in experimentStore.latestExperiments"
          :key="exp.id"
          :experiment="exp"
        />
        <div v-if="experimentStore.latestExperiments.length === 0" class="col-12 text-muted">
          No experiments found. Create your first one!
        </div>
      </div>
    </section>

    <ExperimentCreateModal id="newExperimentModal" />
  </BaseLayout>
</template>
