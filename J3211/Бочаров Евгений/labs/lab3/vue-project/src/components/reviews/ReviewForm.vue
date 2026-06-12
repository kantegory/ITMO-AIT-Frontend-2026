<template>
  <form @submit.prevent="submit" class="mb-4 p-3 border rounded">
    <StarRating v-model="rating" />
    <textarea v-model="text" class="form-control mt-2" rows="2" placeholder="Текст отзыва" required minlength="10"></textarea>
    <button class="btn btn-success btn-sm mt-2">Отправить</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useReviews } from '@/composables/useReviews'
import StarRating from '@/components/ui/StarRating.vue'

const props = defineProps({ eventId: String })
const emit = defineEmits(['added'])
const { currentUser } = useAuth()
const { addReview } = useReviews()
const rating = ref(5)
const text = ref('')

const submit = async () => {
  const u = currentUser.value
  await addReview({
    eventId: props.eventId, userId: u.id, userName: `${u.firstName} ${u.lastName}`,
    userAvatar: 'https://placebear.com/70/50', rating: rating.value, text: text.value, createdAt: new Date().toISOString()
  })
  text.value = ''
  emit('added')
}
</script>