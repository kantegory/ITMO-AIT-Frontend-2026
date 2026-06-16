<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a 
          class="page-link" 
          :class="{ 'text-white': theme === 'dark', 'text-secondary': theme === 'light' }"
          href="#" 
          @click.prevent="$emit('page-change', currentPage - 1)"
        >
          Previous
        </a>
      </li>
      
      <li 
        v-for="page in visiblePages" 
        :key="page"
        class="page-item" 
        :class="{ active: page === currentPage }"
      >
        <a 
          class="page-link" 
          :class="{ 
            'bg-transparent text-white border-secondary': theme === 'dark',
            'bg-transparent text-secondary border-secondary': theme === 'light'
          }"
          href="#" 
          @click.prevent="$emit('page-change', page)"
        >
          {{ page }}
        </a>
      </li>
      
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a 
          class="page-link" 
          :class="{ 'text-white': theme === 'dark', 'text-secondary': theme === 'light' }"
          href="#" 
          @click.prevent="$emit('page-change', currentPage + 1)"
        >
          Next
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

defineEmits(['page-change'])

const theme = computed(() => {
  return document.documentElement.getAttribute('data-theme') || 'dark'
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>
