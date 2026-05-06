import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000' })

function trimUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
  }
}

export async function loginUser(email, password) {
  const { data } = await api.get('/users', { params: { email, password } })
  return data[0] ? trimUser(data[0]) : null
}

export async function registerUser(userData) {
  const { data: existing } = await api.get('/users', { params: { email: userData.email } })

  if (existing.length) {
    throw new Error('Пользователь с таким email уже есть')
  }

  const payload = {
    id: `user-${Date.now()}`,
    firstName: userData.firstName,
    lastName: userData.lastName,
    name: `${userData.firstName} ${userData.lastName}`.replace(/\s+/g, ' ').trim(),
    email: userData.email,
    password: userData.password,
  }

  const { data } = await api.post('/users', payload)
  return trimUser(data)
}

export function buildProjectActions(role) {
  if (role === 'Администратор') {
    return [
      { type: 'team', title: 'Команда', text: 'Список участников и роли.' },
      { type: 'tasks', title: 'Задачи', text: 'Создание карточек и смена статусов.' },
      { type: 'settings', title: 'Настройки', text: 'Название проекта, срок и краткое описание.' },
      { type: 'discussion', title: 'Обсуждение', text: 'Сообщения внутри проекта.' },
    ]
  }

  if (role === 'Участник') {
    return [
      { type: 'tasks', title: 'Задачи', text: 'Свои задачи и свободные карточки.' },
      { type: 'discussion', title: 'Обсуждение', text: 'Короткие сообщения по проекту.' },
    ]
  }

  return []
}

export function decorateProject(project, userName) {
  const member = (project.members || []).find((m) => m.name === userName)
  const role = member ? member.role : 'Наблюдатель'

  return {
    ...project,
    role,
    actions: buildProjectActions(role),
  }
}

export async function loadProjectsFromApi(userName) {
  const { data } = await api.get('/projects')

  return data
    .filter((p) => (p.members || []).some((m) => m.name === userName))
    .map((p) => decorateProject(p, userName))
}

export async function loadProjectFromApi(projectId, userName) {
  const { data } = await api.get(`/projects/${encodeURIComponent(projectId)}`)
  return decorateProject(data, userName)
}

export async function createProjectInApi(project) {
  const { data } = await api.post('/projects', project)
  return data
}

export async function saveProjectInApi(projectId, project) {
  const { data } = await api.patch(`/projects/${encodeURIComponent(projectId)}`, project)
  return data
}

export async function deleteProjectInApi(projectId) {
  await api.delete(`/projects/${encodeURIComponent(projectId)}`)
}
