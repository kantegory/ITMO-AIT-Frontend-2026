<template>
  <section class="view-section">
    <p class="eyebrow">Аккаунт</p>
    <h1>Мои билеты</h1>
    <p class="view-description">Ваши покупки и статусы заказов в одном месте.</p>

    <div v-if="!currentUser" class="state-box">Не удалось определить текущего пользователя.</div>
    <div v-else-if="isLoading" class="state-box">Загрузка заказов...</div>
    <div v-else-if="error" class="state-box state-box--error">{{ error }}</div>
    <div v-else-if="!orderEntries.length" class="state-box">
      Пока нет заказов. После покупки билетов они появятся в этом разделе.
      <div class="state-box__actions">
        <RouterLink class="button-link button-link--ghost" to="/">Перейти в каталог</RouterLink>
      </div>
    </div>
    <div v-else class="orders-list">
      <OrderCard v-for="entry in orderEntries" :key="entry.order.id" :entry="entry" />
    </div>

    <section class="orders-section">
      <div class="orders-section__header">
        <h2>Избранное</h2>
        <p class="view-description">События, которые вы сохранили на потом.</p>
      </div>

      <div v-if="favoritesLoading" class="state-box">Загрузка избранного...</div>
      <div v-else-if="favoritesError" class="state-box state-box--error">{{ favoritesError }}</div>
      <div v-else-if="!favoriteEntries.length" class="state-box">
        В избранном пока пусто. Добавляйте интересные события со страницы мероприятия.
      </div>
      <div v-else class="favorites-grid">
        <FavoriteCard v-for="entry in favoriteEntries" :key="entry.favorite.id" :entry="entry" />
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import FavoriteCard from '../components/FavoriteCard.vue';
import OrderCard from '../components/OrderCard.vue';
import { useAuth } from '../composables/useAuth';
import { useFavorites } from '../composables/useFavorites';
import { useOrders } from '../composables/useOrders';

const { currentUser } = useAuth();
const { orderEntries, isLoading, error, loadOrdersByUser } = useOrders();
const {
  favoriteEntries,
  isLoading: favoritesLoading,
  error: favoritesError,
  loadFavoritesByUser
} = useFavorites();

onMounted(async () => {
  if (!currentUser.value?.id) {
    return;
  }

  try {
    await Promise.all([
      loadOrdersByUser(currentUser.value.id),
      loadFavoritesByUser(currentUser.value.id)
    ]);
  } catch (requestError) {
    // Error state is handled in the composable.
  }
});
</script>
