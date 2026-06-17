import { watchEffect, isRef } from 'vue'

export function usePageTitle(title) {
  watchEffect(() => {
    const currentTitle = isRef(title) ? title.value : title

    if (currentTitle) {
      document.title = `${currentTitle} | MLShare`
    } else {
      document.title = 'MLShare'
    }
  })
}   