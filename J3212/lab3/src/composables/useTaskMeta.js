import { useI18n } from './useI18n';

export const priorityClass = {
  low: 'badge-priority-low',
  medium: 'badge-priority-medium',
  high: 'badge-priority-high',
  critical: 'badge-priority-critical',
};

export const statusBadgeClass = {
  new: 'bg-info',
  progress: 'bg-primary',
  review: 'bg-warning text-dark',
  done: 'bg-success',
};

export function formatDate(value) {
  if (!value) return '—';
  const parts = String(value).split('-');
  if (parts.length !== 3) return value;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export function useTaskMeta() {
  const { t } = useI18n();
  const statusLabel = (key) => t(`status_${key}`);
  const priorityLabel = (key) => (key ? t(`priority_${key}`) : '');
  return { statusLabel, priorityLabel, statusBadgeClass, priorityClass, formatDate };
}
