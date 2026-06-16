<template>
  <div class="col-md-6 mb-4">
    <article class="card product-card">
      <div class="img-wrapper">
        <img :src="product.image" class="card-img-top" :alt="product.name">
        <button class="btn btn-outline-ca quick-view-btn" @click="$emit('quick-view', product)">
          Быстрый просмотр
        </button>
      </div>
      <div class="card-body">
        <p class="product-code">{{ product.article }} | {{ product.collection.toUpperCase() }}</p>
        <h5 class="card-title">{{ product.name }}</h5>
        <p class="card-text">{{ product.price }} ₽</p>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps(['product'])
defineEmits(['quick-view'])
</script>