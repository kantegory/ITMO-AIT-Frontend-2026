<template>
  <div class="container flex-grow-1 py-5">
    <h1 class="mb-5 text-center" style="letter-spacing: 0.1em;">Корзина</h1>
    
    <div v-if="cartItems.length === 0" class="text-center py-5">
      <p class="text-muted mb-4">Ваша корзина пока пуста.</p>
      <router-link to="/catalog" class="btn btn-primary-ca">Перейти к покупкам</router-link>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-lg-8">
        <div v-for="item in cartItems" :key="item.id + item.size" class="d-flex align-items-center border-bottom py-4">
          <img :src="item.image" style="width: 100px; height: 130px; object-fit: cover;" class="me-4">
          <div class="flex-grow-1">
            <h5 class="mb-1">{{ item.name }}</h5>
            <p class="small text-muted mb-0">Размер: {{ item.size }} | Артикул: {{ item.article }}</p>
            <p class="fw-medium mt-2">{{ item.price }} ₽ x {{ item.quantity }}</p>
          </div>
          <button class="btn btn-link text-danger" @click="removeFromCart(item.id, item.size)">
            Удалить
          </button>
        </div>

        <div class="mt-5 d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Итого: {{ cartTotal }} ₽</h4>
          <button class="btn btn-primary-ca">Оформить заказ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '../composables/useCart'
const { cartItems, removeFromCart, cartTotal } = useCart()
</script>