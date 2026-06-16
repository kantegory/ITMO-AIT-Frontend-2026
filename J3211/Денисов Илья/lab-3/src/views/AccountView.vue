<script setup>
import { onMounted } from 'vue';
import AppNavbar from '../components/AppNavbar.vue';
import ApplicationCard from '../components/ApplicationCard.vue';
import EmptyState from '../components/EmptyState.vue';
import ErrorAlert from '../components/ErrorAlert.vue';
import FooterBar from '../components/FooterBar.vue';
import LoadingState from '../components/LoadingState.vue';
import SkipLink from '../components/SkipLink.vue';
import { useApplications } from '../composables/useApplications';
import { useAuth } from '../composables/useAuth';

const { currentUser } = useAuth();
const { applications, loading, error, fetchApplications } = useApplications();

onMounted(() => {
  fetchApplications(currentUser.value?.email);
});
</script>

<template>
  <div class="page-shell">
    <SkipLink />
    <AppNavbar title="Personal Account" />

    <main id="main-content">
      <section class="container my-4" aria-labelledby="account-heading">
        <h1 id="account-heading" class="h2 mb-1">Мои заявки</h1>
        <p class="text-muted mb-4">Здесь отображаются все роли, на которые вы уже записались.</p>

        <div class="d-flex flex-wrap gap-3" aria-live="polite" :aria-busy="loading">
          <LoadingState v-if="loading" text="Загрузка заявок..." />
          <ErrorAlert v-else-if="error" :text="error" />
          <EmptyState v-else-if="!applications.length" text="Вы пока ни на одну должность не записались." />
          <template v-else>
            <ApplicationCard
              v-for="application in applications"
              :key="application.id"
              :application="application"
            />
          </template>
        </div>
      </section>
    </main>

    <FooterBar />
  </div>
</template>
