<template>
  <div class="dest-card" @click="$router.push(`/destination/${dest.id}`)">
    <div class="dest-card-img">
      <img :src="dest.photo" :alt="dest.name" loading="lazy" @error="e => e.target.style.display='none'" />
      <div class="dest-card-overlay"></div>
      <div class="dest-card-badge">
        <span class="tag tag-dark" style="font-size:.72rem;">★ {{ dest.rating.toFixed(1) }}</span>
      </div>
    </div>

    <div class="dest-card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong style="font-size:.95rem;">{{ dest.name }}</strong>
          <div style="font-size:.78rem;color:var(--text-muted);">{{ dest.country }}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:.82rem;color:var(--accent);font-weight:600;">{{ dest.price }}</div>
          <div style="font-size:.72rem;color:var(--text-light);">{{ dest.days }}</div>
        </div>
      </div>

      <div class="d-flex gap-1 flex-wrap">
        <span v-for="tag in [dest.typeLabel, ...dest.tags]" :key="tag" class="tag" style="font-size:.7rem;">
          {{ tag }}
        </span>
      </div>

      <div class="d-flex gap-2 mt-1">
        <button
          class="btn-primary-custom flex-1"
          style="font-size:.78rem;padding:.35rem .5rem;justify-content:center;"
          @click.stop="$router.push(`/destination/${dest.id}`)">
          Открыть
        </button>
        <button
          :class="saved ? 'btn-primary-custom' : 'btn-outline-custom'"
          style="font-size:.78rem;padding:.35rem .6rem;"
          :aria-label="(saved ? 'Убрать из сохранённых: ' : 'Сохранить: ') + dest.name"
          @click.stop="$emit('toggle-save', dest.id)">
          <i :class="`bi bi-bookmark${saved ? '-fill' : ''}`" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dest:  { type: Object,  required: true },
  saved: { type: Boolean, default: false },
})
defineEmits(['toggle-save'])
</script>
