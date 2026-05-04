<script setup>
import { useI18n } from '../composables/useI18n';
const { t } = useI18n();
</script>

<template>
  <footer class="bg-light py-3 mt-auto">
    <div class="container text-center text-muted small">
      &copy; 2026 ProjectHub. <span>{{ t('index_footer') }}</span>
    </div>
  </footer>
</template>
