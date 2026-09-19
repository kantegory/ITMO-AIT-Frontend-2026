<template>
  <section class="bento-card p-4 p-md-5" aria-labelledby="journalHeading">
    <h2 id="journalHeading" class="text-uppercase letter-spacing-2 text-muted-custom fs-7 mb-4">
      Бортовой журнал экспедиций
    </h2>
    <div class="table-responsive">
      <table class="table table-dark table-transparent mb-0 align-middle">
        <caption class="visually-hidden">Бортовой журнал зарегистрированных экспедиций</caption>
        <thead>
          <tr>
            <th scope="col" class="text-muted-custom fw-normal fs-7 text-uppercase letter-spacing-2 pb-3">Направление</th>
            <th scope="col" class="text-muted-custom fw-normal fs-7 text-uppercase letter-spacing-2 pb-3">Дата</th>
            <th scope="col" class="text-muted-custom fw-normal fs-7 text-uppercase letter-spacing-2 pb-3">Корабль</th>
            <th scope="col" class="text-muted-custom fw-normal fs-7 text-uppercase letter-spacing-2 pb-3 text-end">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="bookings.length === 0">
            <td colspan="4" class="text-center py-4 text-muted-custom fs-7">
              Записи в бортовом журнале отсутствуют. Выберите миссию в каталоге.
            </td>
          </tr>
          <tr
            v-else
            v-for="b in bookings"
            :key="b.id"
            class="border-bottom border-secondary border-opacity-25"
          >
            <td class="py-3 text-main">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-rocket-takeoff text-secondary" aria-hidden="true"></i>
                <span>{{ b.route || `${b.origin} → ${b.destination}` }}</span>
              </div>
            </td>
            <td class="py-3 text-muted-custom fs-7">{{ b.date }}</td>
            <td class="py-3 text-main fs-7">{{ b.ship || 'Nova Shuttle' }}</td>
            <td class="py-3 text-end">
              <span :class="[b.statusBadge || 'badge-gold', 'px-2 py-1 fs-7 rounded']">
                {{ b.status || 'Ожидает старта' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({
  bookings: {
    type: Array,
    default: () => []
  }
})
</script>