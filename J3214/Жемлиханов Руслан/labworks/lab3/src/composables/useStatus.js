export function useStatus() {
  const statusClass = (status) => {
    const map = {
      Success: 'success',
      Failed: 'danger',
      Running: 'primary',
      Queued: 'secondary',
      Paused: 'warning',
      success: 'success',
      failed: 'danger',
      running: 'primary',
      queued: 'secondary',
      paused: 'warning',
      critical: 'danger',
      warning: 'warning',
      info: 'success'
    };

    return map[status] || 'secondary';
  };

  return { statusClass };
}
