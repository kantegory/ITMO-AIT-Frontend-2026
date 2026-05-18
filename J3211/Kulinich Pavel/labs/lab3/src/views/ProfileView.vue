<script setup>
import { onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useTickets } from '../composables/useTickets';
import TicketCard from '../components/TicketCard.vue';

const { currentUser, isAuthenticated } = useAuth();
const { tickets, loading, error, fetchTicketsByUser } = useTickets();

onMounted(() => {
  if (isAuthenticated.value) {
    fetchTicketsByUser(currentUser.value.id);
  }
});
</script>

<template>
  <main class="py-5">
    <div class="container">
      <div v-if="!isAuthenticated" class="alert alert-warning">
        Сначала <router-link :to="{ name: 'login' }">выполните вход</router-link>.
      </div>

      <div v-else class="row g-4 mb-4">
        <section class="col-lg-4">
          <article class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4">
              <h1 class="h3 fw-bold">Профиль пользователя</h1>
              <p class="text-secondary mb-3">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
              <ul class="list-group list-group-flush">
                <li class="list-group-item px-0">Email: {{ currentUser.email }}</li>
                <li class="list-group-item px-0">Статус: Активный пользователь</li>
                <li class="list-group-item px-0">Билетов куплено: {{ tickets.length }}</li>
              </ul>
            </div>
          </article>
        </section>

        <section class="col-lg-8">
          <article class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4">
              <header class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h2 class="h4 fw-bold mb-0">Купленные билеты</h2>
                <span class="badge text-bg-success">Возврат доступен до 24 часов до начала</span>
              </header>

              <div v-if="loading" class="alert alert-info">Загружаем билеты...</div>
              <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
              <section v-else class="row g-3">
                <div v-if="!tickets.length" class="col-12">
                  <div class="alert alert-secondary mb-0">У вас пока нет билетов.</div>
                </div>
                <div v-for="ticket in tickets" :key="ticket.id" class="col-md-6">
                  <TicketCard :ticket="ticket" />
                </div>
              </section>
            </div>
          </article>
        </section>
      </div>
    </div>
  </main>
</template>
