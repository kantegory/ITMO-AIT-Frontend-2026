import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useModal from '@/composables/useModal'

const useAuthForm = (modalId, { request, rejectedMessage }) => {
  const route = useRoute()
  const router = useRouter()
  const modal = useModal(modalId)

  const error = ref('')

  async function submit(data) {
    error.value = ''

    try {
      await request(data)
    } catch (e) {
      error.value = e.response ? rejectedMessage : 'Ошибка соединения с сервером'
      return
    }

    modal.hide()
    router.push(route.query.redirect || { name: 'profile' })
  }

  return { error, submit }
}

export default useAuthForm
