import { logout } from '../api/auth';
import type { User, UserRole } from '../types/domain';
import { mustGet } from './render';

const ROLE_LABELS: Record<UserRole, string> = {
  manager: 'Менеджер',
  developer: 'Разработчик',
  analyst: 'Аналитик',
  observer: 'Наблюдатель',
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function renderUserCard(user: User): void {
  mustGet<HTMLDivElement>('#userAvatar').textContent = user.name.charAt(0).toUpperCase();
  mustGet<HTMLDivElement>('#userName').textContent = user.name;
  mustGet<HTMLDivElement>('#userRole').textContent = roleLabel(user.role);
}

export function attachLogout(selector = '#logoutBtn'): void {
  const btn = document.querySelector<HTMLAnchorElement>(selector);
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

export function mountChrome(user: User): void {
  renderUserCard(user);
  attachLogout();
}
