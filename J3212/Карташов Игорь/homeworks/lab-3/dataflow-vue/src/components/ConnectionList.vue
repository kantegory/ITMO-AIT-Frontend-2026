<script setup>
defineProps({
  connections: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="bg-card rounded shadow-sm p-4">
    <h6><i class="bi bi-plug"></i> Connections</h6>
    <div class="mt-3">
      <p v-if="connections.length === 0" class="text-muted">No connections found</p>
      <div
        v-for="connection in connections"
        :key="connection.id"
        class="connection-item mb-3"
      >
        <i :class="`bi bi-${connection.icon} text-${connection.iconColor} fs-5`"></i>
        <div class="flex-grow-1">
          <strong>{{ connection.name }}</strong><br />
          <small class="text-muted">{{ connection.type }} — {{ connection.host }}</small>
        </div>
        <span
          class="badge"
          :class="connection.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'"
        >
          {{ connection.status }}
        </span>
      </div>
    </div>
  </div>
</template>
