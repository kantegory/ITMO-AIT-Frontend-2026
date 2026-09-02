import { defineStore } from 'pinia'
import { tPulseApi } from '../api/tPulseApi'

export const useTeamStore = defineStore('team', {
  state: () => ({ members: [], loading: false, error: '', initialized: false }),
  actions: {
    async loadMembers({ force = false } = {}) {
      if (this.initialized && !force) return
      this.loading = true
      this.error = ''
      try {
        this.members = await tPulseApi.getMembers({ workspaceId: 1 })
        this.initialized = true
      } catch (error) {
        this.error = error.message || 'Не удалось загрузить команду'
        throw error
      } finally {
        this.loading = false
      }
    },
    async inviteMember(member) {
      const created = await tPulseApi.createMember({
        workspaceId: 1,
        userId: null,
        name: member.name,
        shortName: member.name,
        email: member.email,
        role: member.role,
        status: 'Приглашён',
        projectsCount: 0,
        code: `invite-${Date.now()}`,
        initials: member.name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
        avatar: 'blue',
      })
      this.members.push(created)
      return created
    },
    async updateRole(id, role) {
      const updated = await tPulseApi.updateMember(id, { role })
      const member = this.members.find((item) => item.id === id)
      if (member) Object.assign(member, updated)
      return updated
    },
  },
})
