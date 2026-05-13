<template>
  <div class="row g-4" v-if="reviews">
    <div class="col-lg-8">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="serif mb-0" style="font-size:1.1rem;">Отзывы</h2>
        <button class="btn-primary-custom" style="font-size:.82rem;padding:.4rem 1rem;"
          data-bs-toggle="modal" data-bs-target="#reviewModal">
          <i class="bi bi-pencil me-1"></i>Написать
        </button>
      </div>

      <div v-for="(rv, i) in reviews.items" :key="rv[1]" class="review-item">
        <div class="d-flex gap-3 mb-2">
          <div class="review-avatar" :style="`background:${colors[i % colors.length]}`">{{ rv[0] }}</div>
          <div>
            <strong style="font-size:.875rem;">{{ rv[1] }}</strong>
            <div style="font-size:.75rem;color:var(--text-light);">{{ rv[2] }} · {{ rv[3] }}</div>
          </div>
          <div class="stars ms-auto" style="font-size:.82rem;">{{ rv[4] }}</div>
        </div>
        <p style="font-size:.85rem;color:var(--text-muted);margin:0;">{{ rv[5] }}</p>
        <div class="d-flex gap-1 mt-2">
          <span :class="['tag', rv[7]==='warm' ? 'tag-warm' : '']" style="font-size:.7rem;">{{ rv[6] }}</span>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="card p-4">
        <h3 class="serif mb-3 text-center" style="font-size:.95rem;">Общая оценка</h3>
        <div class="text-center mb-3">
          <div class="serif" style="font-size:3rem;color:var(--accent);line-height:1;font-weight:700;">
            {{ reviews.rating }}
          </div>
          <div class="stars" style="font-size:1.1rem;">
            {{ '★'.repeat(Math.round(reviews.rating)) }}{{ '☆'.repeat(5 - Math.round(reviews.rating)) }}
          </div>
          <div style="font-size:.78rem;color:var(--text-light);margin-top:.3rem;">
            {{ reviews.reviews.toLocaleString('ru') }} отзывов
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ reviews: { type: Object, default: null } })

const colors = [
  'var(--accent-light);color:var(--accent)',
  'var(--warm-light);color:var(--warm)',
  '#f0f9ff;color:#0284c7',
]
</script>
