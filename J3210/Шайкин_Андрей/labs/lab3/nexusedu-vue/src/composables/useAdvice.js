import { ref } from 'vue'
import axios from 'axios'

export function useAdvice() {
  const advice = ref('')
  const isLoading = ref(true)

  const fetchAdvice = async () => {
    isLoading.value = true
    try {
      const res = await axios.get('https://api.adviceslip.com/advice')
      advice.value = res.data.slip.advice
    } catch (e) {
      advice.value = 'Стремись к знаниям!'
    } finally {
      isLoading.value = false
    }
  }

  return { advice, isLoading, fetchAdvice }
}