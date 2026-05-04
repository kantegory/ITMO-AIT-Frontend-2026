<template>
  <base-layout>
    <section class="card shadow-sm mx-auto" style="max-width: 720px" v-if="certificate">
      <div class="card-body text-center py-5">
        <h1 class="h3 mb-3">{{ certificate.title }}</h1>
        <p class="mb-1">Выдан: {{ fullName }}</p>
        <p class="text-secondary mb-3">Дата: {{ String(certificate.issuedAt).slice(0, 10) }}</p>
        <button class="btn btn-outline-primary" @click="print">Печать сертификата</button>
      </div>
    </section>
  </base-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { certificatesApi } from '../api'
import BaseLayout from '../layouts/BaseLayout.vue'
import useAuthStore from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const certificate = ref(null)
const fullName = computed(
  () => [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' ') || authStore.user?.email
)

onMounted(async () => {
  const response = await certificatesApi.getOne(route.params.id)
  certificate.value = response.data
})

function print() {
  window.print()
}
</script>
