<template>
  <div class="col-md-6 col-lg-4">
    <div class="certificate-card p-4">
      <div class="text-center mb-3">
        <svg class="icon text-primary mb-3" style="width: 3em; height: 3em;" aria-hidden="true">
          <use href="#icon-certificate"></use>
        </svg>
        <h3 class="mb-1">Сертификат о завершении</h3>
        <p class="text-muted small">{{ courseTitle }}</p>
      </div>
      <div class="border-top border-bottom py-3 mb-3">
        <div class="row text-center">
          <div class="col-4">
            <small class="text-muted d-block">Выдан</small>
            <strong>{{ issuedAt }}</strong>
          </div>
          <div class="col-4">
            <small class="text-muted d-block">Часов</small>
            <strong>{{ course?.duration_hours || '?' }} ч</strong>
          </div>
          <div class="col-4">
            <small class="text-muted d-block">Оценка</small>
            <strong>{{ course?.rating || '—' }}</strong>
          </div>
        </div>
      </div>
      <div class="d-grid gap-2">
        <a :href="url" class="btn btn-primary btn-sm" download>
          <svg class="icon icon-lg me-1" aria-hidden="true">
            <use href="#icon-download"></use>
          </svg>
          Скачать PDF
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  certificate: { type: Object, required: true },
  course: { type: Object, default: null }
})

const courseTitle = computed(() => props.course?.title || 'Курс')
const issuedAt = computed(() => props.certificate.issuedAt || '—')
const url = computed(() => props.certificate.url || '#')
</script>
