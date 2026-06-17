import { ref } from 'vue'
import { commentsApi } from '@/services/api'

export function useComments(resourceType, resourceKey) {
  const comments = ref([])
  const commentText = ref('')
  const loading = ref(false)
  const error = ref(null)

  async function loadComments() {
    if (!resourceType || !resourceKey) return
    loading.value = true
    error.value = null
    try {
      comments.value = await commentsApi.list(resourceType, resourceKey)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addComment() {
    const text = commentText.value.trim()
    if (!text) return

    loading.value = true
    error.value = null
    try {
      await commentsApi.add(resourceType, resourceKey, text)
      commentText.value = ''
      await loadComments()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    comments,
    commentText,
    loading,
    error,
    loadComments,
    addComment,
  }
}
