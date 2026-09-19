<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import DestinationList from "../components/DestinationList.vue";
import { useAuthStore } from "../stores/auth";
import { useDestinationsStore } from "../stores/destinations";

const authStore = useAuthStore();
const destinationsStore = useDestinationsStore();
const { currentUser } = storeToRefs(authStore);
const { savedDestinations, error } = storeToRefs(destinationsStore);

onMounted(() => destinationsStore.loadSavedRoutes(currentUser.value.id));
</script>

<template>
  <BaseLayout>
    <section class="container page-section">
      <div class="profile-card">
        <div class="profile-avatar">{{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}</div>
        <div>
          <p class="eyebrow text-primary">Профиль</p>
          <h1 class="mb-2">{{ currentUser.firstName }} {{ currentUser.lastName }}</h1>
          <p class="mb-1">{{ currentUser.email }}</p>
          <p class="text-secondary mb-0">{{ currentUser.city }}</p>
        </div>
      </div>

      <div class="section-heading mt-5">
        <div>
          <p class="eyebrow text-primary">Избранное</p>
          <h2>Сохранённые маршруты</h2>
        </div>
        <RouterLink class="btn btn-outline-primary" to="/">Найти ещё</RouterLink>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <DestinationList :destinations="savedDestinations" />
    </section>
  </BaseLayout>
</template>
