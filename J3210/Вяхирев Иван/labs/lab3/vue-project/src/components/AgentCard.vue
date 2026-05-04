<template>
  <div class="card h-100 border-0 shadow-sm text-center">
    <div class="card-body">
      <svg class="icon icon-lg mb-3" :class="agent.role === 'Attacker' ? 'text-danger' : 'text-info'">
        <use :href="agent.role === 'Attacker' ? '/assets/sprite.svg#radioactive' : '/assets/sprite.svg#shield'"></use>
      </svg>
      <h6>{{ agent.name }}</h6>
      <span class="badge" :class="agent.role === 'Attacker' ? 'bg-danger' : 'bg-info'">{{ agent.role }}</span>
      <p class="small text-muted mt-2">{{ agent.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  agent: Object
})
</script>
