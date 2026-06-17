import { onBeforeUnmount, onMounted } from 'vue'

export function useBodyClass(className, backgroundColor = '') {
  let oldClassName = ''
  let oldBackgroundColor = ''

  onMounted(() => {
    oldClassName = document.body.className
    oldBackgroundColor = document.body.style.backgroundColor

    document.body.className = className

    if (backgroundColor) {
      document.body.style.backgroundColor = backgroundColor
    }
  })

  onBeforeUnmount(() => {
    document.body.className = oldClassName
    document.body.style.backgroundColor = oldBackgroundColor
  })
}
