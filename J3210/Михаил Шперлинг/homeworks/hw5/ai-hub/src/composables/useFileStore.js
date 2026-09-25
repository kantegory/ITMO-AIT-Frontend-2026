// Хранит загруженные файлы в localStorage по ключу file_{type}_{id}
export function useFileStore() {
  function save(type, id, file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          localStorage.setItem(`file_${type}_${id}`, JSON.stringify({
            name: file.name,
            mimeType: file.type,
            data: reader.result
          }))
          resolve()
        } catch {
          reject(new Error('Файл слишком большой для сохранения в браузере'))
        }
      }
      reader.onerror = () => reject(new Error('Ошибка чтения файла'))
      reader.readAsDataURL(file)
    })
  }

  function get(type, id) {
    try {
      const raw = localStorage.getItem(`file_${type}_${id}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function download(type, id) {
    const info = get(type, id)
    if (!info) return false
    const a = document.createElement('a')
    a.href = info.data
    a.download = info.name
    a.click()
    return true
  }

  return { save, get, download }
}
