<template>
  <div class="container mt-5 pt-4 flex-grow-1">
    <div class="row mb-5">
      <div class="col-12 d-flex justify-content-between align-items-end border-bottom pb-3 mb-4">
        <h1 class="h3 mb-0">Каталог</h1>
        <span class="text-muted small">Showing {{ filteredProducts.length }} products</span>
      </div>
    </div>

    <div class="row">
      <aside class="col-lg-3 mb-5 pe-lg-5">
        <div class="mb-5">
          <div class="input-group">
            <input type="text" v-model="searchQuery" class="form-control" id="searchInput" placeholder="Search items...">
          </div>
        </div>

        <div class="mb-4">
          <h4 class="filter-title">Коллекция</h4>
          <select class="form-select" v-model="selectedCollection">
            <option value="all">Все коллекции</option>
            <option value="sapporo">SAPPORO 26 SS</option>
            <option value="edelweiss">EDELWEISS 26 SS</option>
            <option value="oslo">OSLO 26 FW</option>
          </select>
        </div>

        <div class="mb-4">
          <h4 class="filter-title">Категория</h4>
          <div class="form-check mb-2" v-for="cat in ['jackets', 'shirts', 'pants']" :key="cat">
            <input class="form-check-input" type="checkbox" :id="cat" :value="cat" v-model="selectedCategories">
            <label class="form-check-label text-capitalize" :for="cat">{{ cat }}</label>
          </div>
        </div>
      </aside>

      <main class="col-lg-9">
        <div v-if="isLoading" class="text-center mt-5">Загрузка коллекции...</div>
        <div v-else-if="filteredProducts.length === 0" class="text-muted text-center mt-5">Ничего не найдено.</div>
        <div class="row" v-else>
          <ProductCard 
            v-for="item in filteredProducts" 
            :key="item.id" 
            :product="item" 
            @quick-view="openModal" 
          />
        </div>
      </main>
    </div>

    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-0 border-0" v-if="selectedProduct">
          <div class="modal-header border-0 pb-0">
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body px-5 pb-5 text-center">
            <img :src="selectedProduct.image" class="img-fluid mb-3" style="max-height: 300px; object-fit: cover;">
            <p class="text-muted small mb-2">{{ selectedProduct.article }}</p>
            <h3 class="modal-title mb-3">{{ selectedProduct.name }}</h3>
            <p class="fs-4 mb-4">{{ selectedProduct.price }} ₽</p>

            <div class="mb-4">
              <label class="form-label d-block small text-uppercase">Выберите размер</label>
              <div class="btn-group w-100" role="group">
                <template v-for="size in ['S', 'M', 'L']" :key="size">
                  <input type="radio" class="btn-check" :name="'size'+size" :id="'size'+size" :value="size" v-model="selectedSize">
                  <label class="btn btn-outline-dark rounded-0" :for="'size'+size">{{ size }}</label>
                </template>
              </div>
            </div>

            <button 
              class="btn btn-primary-ca w-100" 
              @click="addToCart(selectedProduct, selectedSize)"
              :disabled="!selectedSize"
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import { useCart } from '../composables/useCart'
const { addToCart } = useCart()
const selectedSize = ref('')

const { fetchProducts, filteredProducts, isLoading, searchQuery, selectedCollection, selectedCategories } = useProducts()

const selectedProduct = ref(null)

const openModal = (product) => {
  selectedProduct.value = product
  const modal = new bootstrap.Modal(document.getElementById('productModal'))
  modal.show()
}

onMounted(fetchProducts)
</script>