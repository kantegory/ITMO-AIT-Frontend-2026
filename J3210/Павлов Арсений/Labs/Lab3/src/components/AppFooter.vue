<script setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="container page-footer">
    <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
      <span>FinTrack Pro учебный макет для ЛР3 (Vue SPA)</span>
      <span>&copy; {{ year }} Павлов Арсений, J3210</span>
    </div>
  </footer>
</template>
