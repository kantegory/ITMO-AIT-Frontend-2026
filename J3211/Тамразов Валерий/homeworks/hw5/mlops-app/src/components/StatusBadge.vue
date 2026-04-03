<template>
  <span class="status-badge" :class="'status-' + status">
    {{ label }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    label() {
      var labels = {
        success: 'Успешно',
        running: 'Запущен',
        failed: 'Ошибка',
        pending: 'Ожидание'
      }
      return labels[this.status] || this.status
    }
  }
}
</script>

<style scoped>
.status-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.status-success { background: rgba(63, 185, 80, 0.12); color: #3fb950; }
.status-running { background: rgba(88, 166, 255, 0.12); color: #58a6ff; }
.status-failed { background: rgba(248, 81, 73, 0.12); color: #f85149; }
.status-pending { background: rgba(210, 153, 34, 0.12); color: #d29922; }
</style>
