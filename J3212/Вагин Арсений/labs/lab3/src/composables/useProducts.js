import { ref, computed } from 'vue'
import axios from 'axios'

export function useProducts() {
  const products = ref([])
  const isLoading = ref(false)
  
  const searchQuery = ref('')
  const selectedCollection = ref('all')
  const selectedCategories = ref([])

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      const { data } = await axios.get('http://localhost:3000/products')
      products.value = data
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
    } finally {
      isLoading.value = false
    }
  }

  const filteredProducts = computed(() => {
    return products.value.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                            p.article.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      const matchesCollection = selectedCollection.value === 'all' || p.collection === selectedCollection.value
      
      const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category)
      
      return matchesSearch && matchesCollection && matchesCategory
    })
  })

  return {
    fetchProducts,
    filteredProducts,
    isLoading,
    searchQuery,
    selectedCollection,
    selectedCategories
  }
}