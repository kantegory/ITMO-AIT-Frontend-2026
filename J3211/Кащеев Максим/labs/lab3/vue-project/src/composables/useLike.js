import { ref } from 'vue'

export function useLike(storageKey) {
  const liked = ref(new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')))

  function toggle(id) {
    if (liked.value.has(id)) {
      liked.value.delete(id)
    } else {
      liked.value.add(id)
    }
    liked.value = new Set(liked.value)
    localStorage.setItem(storageKey, JSON.stringify([...liked.value]))
  }

  function isLiked(id) {
    return liked.value.has(id)
  }

  return { liked, toggle, isLiked }
}
