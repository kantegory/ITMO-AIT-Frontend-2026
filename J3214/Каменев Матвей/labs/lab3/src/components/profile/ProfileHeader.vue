<script setup>
import PriceLabel from '@/components/common/PriceLabel.vue'

defineProps({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  balanceRub: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <section class="profile-header border-bottom py-5" aria-labelledby="profile-name">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-auto">
          <img :src="avatar" alt="Фото профиля" class="profile-avatar" />
        </div>
        <div class="col">
          <h1 class="h3 mb-1" id="profile-name">{{ name }}</h1>
          <p v-if="bio" class="text-muted mb-0">{{ bio }}</p>
        </div>
        <div class="col-auto">
          <div class="profile-balance text-end">
            <span class="text-muted small d-block">Баланс</span>
            <price-label class="profile-balance-amount fw-semibold" :rub="balanceRub" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-avatar {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 50%;
}

.profile-balance-amount {
  font-size: 1.5rem;
}
</style>
