<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['change']);
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Пагинация">
    <ul class="pagination mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" type="button" @click="emit('change', currentPage - 1)">
          Предыдущая
        </button>
      </li>
      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button class="page-link" type="button" @click="emit('change', page)">
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" type="button" @click="emit('change', currentPage + 1)">
          Следующая
        </button>
      </li>
    </ul>
  </nav>
</template>
