import { computed, ref } from 'vue'
import api from '../services/api'

const userId   = ref(localStorage.getItem('userId'))
const userName = ref(localStorage.getItem('userName'))
const userAvatar = ref(localStorage.getItem('userAvatar') || '')

export function useAuth() {
  const isAuth = computed(() => Boolean(localStorage.getItem('accessToken')))

  const login = async (email, password) => {
    const users = await api.get('/users', { params: { email } })
    const user = users.data[0]
    if (!user) throw new Error('Пользователь не найден')
    localStorage.setItem('accessToken', 'demo-token')
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userName', user.name)
    localStorage.setItem('userAvatar', user.avatar || '')
    userId.value   = user.id
    userName.value = user.name
    userAvatar.value = user.avatar || ''
    return user
  }

  const register = async (form) => {
    const response = await api.post('/users', {
      ...form,
      id: crypto.randomUUID(),
      role: 'Researcher',
      description: 'Новый пользователь',
      avatar: `https://i.pravatar.cc/150?u=${form.email}`
    })
    return response.data
  }

  const logout = () => {
    localStorage.clear()
    userId.value   = null
    userName.value = null
    userAvatar.value = ''
  }

  const updateUserMeta = (name, avatar, role) => {
    localStorage.setItem('userName',   name)
    localStorage.setItem('userAvatar', avatar)
    localStorage.setItem('userRole',   role)
    userName.value   = name
    userAvatar.value = avatar
  }

  return { userId, userName, userAvatar, isAuth, login, register, logout, updateUserMeta }
}
