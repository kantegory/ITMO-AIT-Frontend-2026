<template>
  <section class="view-section">
    <p class="eyebrow">Аккаунт</p>
    <h1>Профиль</h1>
    <p class="view-description profile-view__intro">
      Базовые данные текущего пользователя читаются из localStorage и доступны после перезагрузки страницы.
    </p>

    <div v-if="currentUser" class="profile-grid">
      <div class="details-card">
        <span class="details-card__label">Имя</span>
        <strong>{{ currentUser.name }}</strong>
      </div>
      <div class="details-card">
        <span class="details-card__label">Эл. почта</span>
        <strong>{{ currentUser.email }}</strong>
      </div>
      <div class="details-card">
        <span class="details-card__label">ID пользователя</span>
        <strong>{{ currentUser.id }}</strong>
      </div>
      <div class="details-card">
        <span class="details-card__label">Статус</span>
        <strong>Авторизован</strong>
      </div>
    </div>

    <div v-if="currentUser" class="profile-actions">
      <RouterLink class="button-link button-link--ghost" to="/orders">Перейти к заказам</RouterLink>
      <RouterLink class="button-link button-link--ghost" to="/organizer">Открыть кабинет организатора</RouterLink>
    </div>

    <div v-else class="state-box state-box--error">Пользователь не найден. Войдите в аккаунт повторно.</div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const { currentUser } = useAuth();
</script>
