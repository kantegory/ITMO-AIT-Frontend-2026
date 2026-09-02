import { defineStore } from 'pinia'
import { tPulseApi } from '../api/tPulseApi'
import { TOKEN_KEY, USER_KEY } from '../api/http'

function readStoredUser() {
  const serialized = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!serialized) return null
  try {
    return JSON.parse(serialized)
  } catch {
    return null
  }
}

function clearSessionStorage() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(USER_KEY)
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '',
    user: readStoredUser(),
    loading: false,
    error: '',
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    saveSession(payload, remember = false) {
      clearSessionStorage()
      const storage = remember ? localStorage : sessionStorage
      storage.setItem(TOKEN_KEY, payload.accessToken)
      storage.setItem(USER_KEY, JSON.stringify(payload.user))
      this.token = payload.accessToken
      this.user = payload.user
    },

    updateStoredUser(user) {
      const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage
      storage.setItem(USER_KEY, JSON.stringify(user))
      this.user = user
    },

    async login(email, password, remember = false) {
      this.loading = true
      this.error = ''
      try {
        const payload = await tPulseApi.login(email, password)
        this.saveSession(payload, remember)
        return payload.user
      } catch (error) {
        this.error = error.response?.data || error.message || 'Не удалось войти'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(profile) {
      this.loading = true
      this.error = ''
      try {
        const payload = await tPulseApi.register(profile)
        this.saveSession(payload, true)

        const workspace = await tPulseApi.createWorkspace({
          name: profile.workspaceName,
          code: profile.workspaceName
            .split(/\s+/)
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          ownerId: payload.user.id,
        })

        const project = await tPulseApi.createProject({
          workspaceId: workspace.id,
          name: 'Первый проект',
          description: 'Первый проект нового рабочего пространства',
          status: 'planned',
          deadline: null,
          ownerId: payload.user.id,
        })

        const user = await tPulseApi.updateUser(payload.user.id, {
          workspaceId: workspace.id,
          projectId: project.id,
        })

        await tPulseApi.createMember({
          workspaceId: workspace.id,
          userId: user.id,
          name: `${profile.firstName} ${profile.lastName}`,
          shortName: `${profile.firstName} ${profile.lastName[0]}.`,
          email: profile.email,
          role: 'Администратор',
          status: 'Онлайн',
          projectsCount: 0,
          code: `user-${user.id}`,
          initials: `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase(),
          avatar: 'lime',
        })

        this.updateStoredUser(user)
        return user
      } catch (error) {
        this.error = error.response?.data || error.message || 'Не удалось создать аккаунт'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      clearSessionStorage()
      this.token = ''
      this.user = null
    },
  },
})
