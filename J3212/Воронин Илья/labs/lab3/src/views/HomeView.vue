<script setup>
import { useI18n } from '../composables/useI18n';
const { t } = useI18n();
</script>

<template>
  <section class="py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold mb-4">{{ t('index_hero') }}</h1>
          <p class="lead text-muted mb-4">{{ t('index_lead') }}</p>
          <div class="d-flex gap-2 flex-wrap">
            <RouterLink :to="{ name: 'register' }" class="btn btn-primary btn-lg">
              {{ t('index_start') }}
            </RouterLink>
            <RouterLink :to="{ name: 'login' }" class="btn btn-outline-primary btn-lg">
              {{ t('index_login') }}
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6 mt-4 mt-lg-0 text-center">
          <div class="bg-light rounded-3 p-4 shadow-sm">
            <p class="text-muted mb-0 small">{{ t('index_tagline') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
