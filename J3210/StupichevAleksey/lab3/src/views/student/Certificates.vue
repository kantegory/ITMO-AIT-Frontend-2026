<template>
  <section>
    <h4 class="mb-4 fw-bold">Сертификаты</h4>
    <div v-if="isLoading" class="spinner-center">
      <div class="spinner-border text-primary"></div>
    </div>
    <p v-else-if="certs.length === 0" class="text-muted">Нет сертификатов</p>
    <div v-else class="row g-4">
      <div v-for="cert in certs" :key="cert.id" class="col-lg-6">
        <div class="cert-card">
          <div class="cert-icon">
            <svg class="icon">
              <use href="#icon-award-fill"></use>
            </svg>
          </div>
          <div class="flex-grow-1">
            <h3 class="fw-semibold mb-0" style="font-size: 1rem">{{ cert.courseTitle }}</h3>
            <div class="small text-muted">Выдан: {{ cert.issuedDate }}</div>
          </div>
          <a href="#" class="btn btn-outline-primary btn-sm">Скачать</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useAuthStore} from '@/stores/auth'
import {certificatesApi} from '@/api'

const auth = useAuthStore()
const isLoading = ref(true)
const certs = ref([])

onMounted(async () => {
  try {
    const {data} = await certificatesApi.getByUser(auth.user.id)
    certs.value = data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>
