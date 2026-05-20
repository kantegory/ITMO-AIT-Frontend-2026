const STATUS_CLASSES = {
  success: 'bg-success',
  failed: 'bg-danger',
  running: 'bg-warning text-dark',
}

export function useStatus() {
  function badgeClass(status) {
    return STATUS_CLASSES[status] || 'bg-secondary'
  }

  function label(status) {
    if (!status) return ''
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return { badgeClass, label }
}
