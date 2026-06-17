import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {api} from '../api'

export function useAuth() {
    const router = useRouter()
    const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

    const login = async (email, pass) => {
        try {
            const response = await api.getUsers()
            const user = response.data.find(u => u.email === email && u.pass === pass)

            if (user) {
                localStorage.setItem('isLoggedIn', 'true')
                localStorage.setItem('currentUser', JSON.stringify(user))
                localStorage.setItem('currentUserId', user.id.toString())
                localStorage.setItem('userFullName', `${user.name} ${user.surname}`)
                currentUser.value = user
                router.push('/')
            } else {
                alert("Неверный Email или пароль!")
            }
        } catch (e) {
            alert("Нет связи с сервером!")
        }
    }

    const register = async (name, surname, email, pass) => {
        try {
            const {data: users} = await api.getUsers()
            const isEmailTaken = users.some(u => u.email === email)

            if (isEmailTaken) {
                return alert("Email уже занят!")
            }

            const {data: newUser} = await api.registerUser({
                name,
                surname,
                email,
                pass
            })

            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('currentUser', JSON.stringify(newUser))
            localStorage.setItem('currentUserId', newUser.id.toString())
            localStorage.setItem('userFullName', `${name} ${surname}`)

            currentUser.value = newUser
            router.push('/')
        } catch (e) {
            alert("Ошибка при регистрации на сервере!")
            console.error(e)
        }
    }

    const logout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('currentUserId')
        localStorage.removeItem('userFullName')
        currentUser.value = null
        router.push('/login')
    }

    return {currentUser, login, register, logout}
}