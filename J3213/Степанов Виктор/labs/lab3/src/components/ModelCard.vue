<template>
  <div :class="col">
    <div class="card model-card h-100 p-3" style="cursor:pointer;" @click="$router.push('/model/' + model.id)">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <small class="text-muted">@{{ model.owner }}</small>
          <h6 class="mb-0 fw-bold">{{ model.name }}</h6>
        </div>
        <span :class="model.type === 'dataset' ? 'badge bg-warning text-dark' : 'badge bg-primary'">
          {{ model.type === 'dataset' ? 'Dataset' : 'Model' }}
        </span>
      </div>
      <p class="text-muted mb-2" style="font-size:13px; overflow:hidden; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
        {{ model.desc }}
      </p>
      <div class="d-flex flex-wrap gap-1 mb-2">
        <span class="badge bg-light text-dark border">{{ model.task }}</span>
        <span v-if="model.framework" class="badge bg-light text-dark border">{{ model.framework }}</span>
        <span class="badge bg-light text-dark border">{{ model.license }}</span>
      </div>
      <div class="d-flex gap-3 mt-auto pt-2 border-top" style="font-size:13px;">
        <span>{{ fmtNum(model.stars) }} звёзд</span>
        <span>{{ fmtNum(model.downloads) }} загрузок</span>
        <span class="ms-auto text-muted">{{ model.size }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  model: { type: Object, required: true },
  col: { type: String, default: 'col-md-4' }
})
function fmtNum(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n }
</script>
