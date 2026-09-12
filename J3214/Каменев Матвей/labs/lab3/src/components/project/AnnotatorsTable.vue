<script setup>
import PriceLabel from '@/components/common/PriceLabel.vue'

defineProps({
  annotators: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle annotators-table mb-0" aria-label="Список аннотаторов проекта">
      <thead>
        <tr>
          <th>Аннотатор</th>
          <th>Дата поинтов</th>
          <th>Тесты</th>
          <th>Выплата</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="annotator in annotators" :key="annotator.name">
          <td>
            <div class="d-flex align-items-center gap-3">
              <img :src="annotator.avatar" :alt="annotator.avatarAlt" class="annotator-avatar" />
              <router-link :to="{ name: 'profile' }">{{ annotator.name }}</router-link>
            </div>
          </td>
          <td>{{ annotator.datapoints }}</td>
          <td>
            <span class="fw-semibold" :class="annotator.tests === 100 ? 'text-success' : 'text-danger'">
              {{ annotator.tests }}%
            </span>
          </td>
          <price-label tag="td" :rub="annotator.payoutRub" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.annotator-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
