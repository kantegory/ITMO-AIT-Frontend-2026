export const Routes = {
  login: '/index.html',
  register: '/register.html',
  dashboard: '/dashboard.html',
  search: '/search.html',
  task: (id: number) => `/task.html?id=${id}`,
} as const;
