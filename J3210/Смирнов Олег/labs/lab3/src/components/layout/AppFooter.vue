<script setup>
import { RouterLink } from 'vue-router';
import SvgIcon from '@/components/ui/SvgIcon.vue';
</script>

<template>
  <footer class="py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <p class="h6"><SvgIcon name="cpu" /> AI Hub</p>
          <p class="small text-muted">Платформа для обмена ML-моделями и датасетами.</p>
        </div>
        <div class="col-md-3">
          <p class="h6">Разделы</p>
          <ul class="list-unstyled small">
            <li><RouterLink to="/models" class="text-muted">Модели</RouterLink></li>
            <li><RouterLink to="/datasets" class="text-muted">Датасеты</RouterLink></li>
          </ul>
        </div>
        <div class="col-md-3 text-md-end">
          <small class="text-muted">&copy; 2026 AI Hub</small>
        </div>
      </div>
    </div>
  </footer>
</template>
