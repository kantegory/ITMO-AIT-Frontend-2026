<template>
  <div class="row g-4" v-if="tips">
    <div class="col-md-6">
      <h3 class="serif mb-3" style="font-size:1rem;color:var(--accent);">🍽 Еда</h3>
      <div v-for="(f, i) in tips.food" :key="f[0]" class="note-item mb-2"
        :style="i===1 ? 'border-left-color:var(--warm);' : ''">
        <strong style="font-size:.875rem;">{{ f[0] }}</strong>
        <p style="font-size:.82rem;color:var(--text-muted);margin:.3rem 0 0;">{{ f[1] }}</p>
      </div>
    </div>

    <div class="col-md-6">
      <h3 class="serif mb-3" style="font-size:1rem;color:var(--accent);">🚇 Транспорт</h3>
      <div v-for="tr in tips.transport" :key="tr[0]" class="note-item mb-2">
        <strong style="font-size:.875rem;">{{ tr[0] }}</strong>
        <p style="font-size:.82rem;color:var(--text-muted);margin:.3rem 0 0;">{{ tr[1] }}</p>
      </div>
    </div>

    <div class="col-12">
      <h3 class="serif mb-3" style="font-size:1rem;color:var(--accent);">💡 Советы</h3>
      <div class="row g-3">
        <div v-for="h in tips.hints" :key="h[1]" class="col-sm-6 col-md-4">
          <div class="card p-3">
            <div style="font-size:1.3rem;margin-bottom:.4rem;">{{ h[0] }}</div>
            <strong style="font-size:.85rem;">{{ h[1] }}</strong>
            <p style="font-size:.78rem;color:var(--text-muted);margin:.3rem 0 0;">{{ h[2] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ tips: { type: Object, default: null } })
</script>
