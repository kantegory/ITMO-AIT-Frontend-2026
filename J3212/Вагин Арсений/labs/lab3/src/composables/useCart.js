import { ref, computed, watch } from 'vue'

const cartItems = ref(JSON.parse(localStorage.getItem('cart')) || [])

export function useCart() {

  watch(cartItems, (newVal) => {
    localStorage.setItem('cart', JSON.stringify(newVal))
  }, { deep: true })

  const addToCart = (product, size) => {
    if (!size) return alert('Пожалуйста, выберите размер')

    const existingItem = cartItems.value.find(
      item => item.id === product.id && item.size === size
    )

    if (existingItem) {
      existingItem.quantity++
    } else {
      cartItems.value.push({
        ...product,
        size,
        quantity: 1
      })
    }
    alert('Товар добавлен в корзину')
  }

  const removeFromCart = (id, size) => {
    cartItems.value = cartItems.value.filter(
      item => !(item.id === id && item.size === size)
    )
  }

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    cartTotal,
    cartCount
  }
}