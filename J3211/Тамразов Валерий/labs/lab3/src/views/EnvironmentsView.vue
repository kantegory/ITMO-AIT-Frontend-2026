<script setup>
import { onMounted, ref } from 'vue';
import { fetchEnvironments, fetchRoles } from '../api/environments';
import EnvironmentCard from '../components/EnvironmentCard.vue';
import RoleRow from '../components/RoleRow.vue';

const envs = ref([]);
const roles = ref([]);
const error = ref('');

onMounted(async () => {
  try {
    const [envRes, rolesRes] = await Promise.all([fetchEnvironments(), fetchRoles()]);
    envs.value = envRes.data;
    roles.value = rolesRes.data;
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <main class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Среды и роли</h2>
      <button class="btn btn-primary" disabled>
        <i class="bi bi-plus-lg me-1"></i> Новая среда
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row g-4 mb-5">
      <div v-for="env in envs" :key="env.id" class="col-md-4">
        <EnvironmentCard :env="env" />
      </div>
    </div>

    <h3 class="mb-3">Роли и разрешения</h3>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Роль</th>
            <th>Development</th>
            <th>Staging</th>
            <th>Production</th>
          </tr>
        </thead>
        <tbody>
          <RoleRow v-for="r in roles" :key="r.id" :role="r" />
        </tbody>
      </table>
    </div>
  </main>
</template>
