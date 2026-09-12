import { watchEffect, toValue } from 'vue'

const useDocumentTitle = (title) => {
  watchEffect(() => {
    const value = toValue(title)

    document.title = value ? `annotaylor: ${value}` : 'annotaylor'
  })
}

export default useDocumentTitle
