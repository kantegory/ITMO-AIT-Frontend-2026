<template>
  <div class="profile-bg">
    <div class="container mt-4">
      <!-- Профиль пользователя -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Мой профиль</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Имя:</strong> <span>{{ userProfile.name }}</span></p>
                  <p><strong>Email:</strong> <span>{{ userProfile.email }}</span></p>
                </div>
                <div class="col-md-6">
                  <p><strong>Дата регистрации:</strong> <span>{{ userProfile.registered }}</span></p>
                  <button class="btn btn-outline-primary btn-sm" @click="editProfile">Редактировать профиль</button>
                  <button class="btn btn-outline-danger btn-sm ms-2" @click="logout">Выйти</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Личный кабинет</h2>
      <div class="row">
        <!-- Заметки -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Мои путевые заметки</h5>
            </div>
            <div class="card-body">
              <div id="notesList" aria-label="Список заметок">
                <div v-for="(note, index) in userNotes" :key="index" class="border-bottom mb-2 pb-2">
                  <strong>{{ note.title }}</strong>
                  <p class="mb-0 small">{{ note.text }}</p>
                  <div class="mt-1">
                    <button class="btn btn-danger btn-sm" @click="deleteNote(index)">Удалить</button>
                    <button class="btn btn-info btn-sm ms-2" @click="shareNote(note.title, note.text)">Поделиться</button>
                  </div>
                </div>
                <p v-if="userNotes.length === 0" class="text-muted">Заметок пока нет</p>
              </div>
              <hr>
              <h6>Добавить заметку</h6>
              <input type="text" class="form-control mb-2" v-model="newNote.title" placeholder="Название">
              <textarea class="form-control mb-2" rows="2" v-model="newNote.text" placeholder="Текст заметки"></textarea>
              <button class="btn btn-primary btn-sm" @click="addNote">Добавить</button>
            </div>
          </div>
        </div>

        <!-- Сохранённые маршруты (заглушка) -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Сохранённые маршруты</h5>
            </div>
            <div class="card-body">
              <p class="text-muted">Сохранённых маршрутов пока нет</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Бюджет -->
      <div class="row mt-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Планирование бюджета</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Доходы</h6>
                  <input type="number" class="form-control mb-2" v-model="budgetAmount" placeholder="Бюджет на поездку">
                  <button class="btn btn-success btn-sm" @click="addBudget">Добавить бюджет</button>
                </div>
                <div class="col-md-6">
                  <h6>Расходы</h6>
                  <input type="text" class="form-control mb-2" v-model="expense.name" placeholder="На что">
                  <input type="number" class="form-control mb-2" v-model="expense.amount" placeholder="Сумма">
                  <button class="btn btn-danger btn-sm" @click="addExpense">Добавить расход</button>
                </div>
              </div>
              <hr>
              <div id="budgetSummary" aria-label="Сводка бюджета">
                <p><strong>Общий бюджет:</strong> {{ totalBudget.toLocaleString() }} ₽</p>
                <p><strong>Расходы:</strong> {{ totalExpenses.toLocaleString() }} ₽</p>
                <p><strong>Остаток:</strong> {{ balance.toLocaleString() }} ₽</p>
              </div>
              <div id="expensesList">
                <h6>Список расходов:</h6>
                <ul class="list-group" aria-label="Список расходов">
                  <li v-for="(exp, index) in expenses" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                    {{ exp.name }}: {{ exp.amount.toLocaleString() }} ₽
                    <button class="btn btn-danger btn-sm" @click="deleteExpense(index)"></button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter()
    
    // Профиль
    const userProfile = ref({
      name: 'Гость',
      email: 'не указан',
      registered: new Date().toLocaleDateString()
    })
    
    // Заметки
    const userNotes = ref([])
    const newNote = ref({ title: '', text: '' })
    
    // Бюджет
    const budgetAmount = ref(0)
    const totalBudget = ref(0)
    const expenses = ref([])
    const expense = ref({ name: '', amount: 0 })
    
    const totalExpenses = computed(() => {
      return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
    })
    
    const balance = computed(() => {
      return totalBudget.value - totalExpenses.value
    })
    
    // Загрузка профиля из localStorage
    const loadProfile = () => {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        userProfile.value = {
          name: user.name,
          email: user.email,
          registered: new Date().toLocaleDateString()
        }
      } else {
        router.push('/login')
      }
    }
    
    // Редактирование профиля
    const editProfile = () => {
      const newName = prompt('Введите ваше имя:', userProfile.value.name)
      const newEmail = prompt('Введите ваш email:', userProfile.value.email)
      if (newName) userProfile.value.name = newName
      if (newEmail) userProfile.value.email = newEmail
      
      // Сохраняем изменения в currentUser
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (currentUser) {
        currentUser.name = userProfile.value.name
        currentUser.email = userProfile.value.email
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
      localStorage.setItem('userProfile', JSON.stringify(userProfile.value))
      alert('Профиль обновлён!')
    }
    
    // Выход
    const logout = () => {
      localStorage.removeItem('currentUser')
      localStorage.removeItem('userProfile')
      alert('Вы вышли из аккаунта')
      router.push('/login')
    }
    
    // Заметки
    const addNote = () => {
      if (newNote.value.title && newNote.value.text) {
        userNotes.value.push({ ...newNote.value })
        newNote.value = { title: '', text: '' }
        localStorage.setItem('userNotes', JSON.stringify(userNotes.value))
      } else {
        alert('Заполните название и текст заметки')
      }
    }
    
    const deleteNote = (index) => {
      userNotes.value.splice(index, 1)
      localStorage.setItem('userNotes', JSON.stringify(userNotes.value))
    }
    
    const shareNote = (title, text) => {
      const shareText = `Моя заметка: ${title}\n${text}`
      navigator.clipboard.writeText(shareText)
      alert('Заметка скопирована! Теперь её можно отправить другу.')
    }
    
    // Бюджет
    const addBudget = () => {
      if (budgetAmount.value > 0) {
        totalBudget.value += Number(budgetAmount.value)
        budgetAmount.value = 0
        localStorage.setItem('totalBudget', JSON.stringify(totalBudget.value))
        alert('Бюджет добавлен!')
      } else {
        alert('Введите сумму бюджета')
      }
    }
    
    const addExpense = () => {
      if (expense.value.name && expense.value.amount > 0) {
        expenses.value.push({ ...expense.value })
        expense.value = { name: '', amount: 0 }
        localStorage.setItem('expenses', JSON.stringify(expenses.value))
        alert('Расход добавлен!')
      } else {
        alert('Заполните название и сумму расхода')
      }
    }
    
    const deleteExpense = (index) => {
      expenses.value.splice(index, 1)
      localStorage.setItem('expenses', JSON.stringify(expenses.value))
    }
    
    onMounted(() => {
      loadProfile()
      
      // Загрузка заметок из localStorage
      const savedNotes = localStorage.getItem('userNotes')
      if (savedNotes) {
        userNotes.value = JSON.parse(savedNotes)
      }
      
      // Загрузка бюджета из localStorage
      const savedBudget = localStorage.getItem('totalBudget')
      const savedExpenses = localStorage.getItem('expenses')
      if (savedBudget) totalBudget.value = JSON.parse(savedBudget)
      if (savedExpenses) expenses.value = JSON.parse(savedExpenses)
    })
    
    return {
      userProfile,
      userNotes,
      newNote,
      budgetAmount,
      totalBudget,
      expenses,
      expense,
      totalExpenses,
      balance,
      editProfile,
      logout,
      addNote,
      deleteNote,
      shareNote,
      addBudget,
      addExpense,
      deleteExpense
    }
  }
}
</script>

<style scoped>
.profile-bg {
  background-image: url('/images/mountain.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.profile-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.profile-bg .container {
  position: relative;
  z-index: 2;
}

/* Карточки остаются светлыми, чтобы было видно на фоне */
.profile-bg .card {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}

.profile-bg h2 {
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
</style>