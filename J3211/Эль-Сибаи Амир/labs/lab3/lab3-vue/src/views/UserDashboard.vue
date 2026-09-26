<template>
  <main class="container mt-5 mb-5" v-if="auth.user">
    <h1 class="mb-3">My Account</h1>
    <p class="mb-4">Welcome, <strong>{{ auth.user.firstName }} {{ auth.user.lastName }}</strong>.</p>

    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card"><div class="card-body">
          <h5 class="card-title">Tickets Purchased</h5>
          <p class="card-text">Total: <strong>{{ tickets.length }}</strong></p>
        </div></div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card"><div class="card-body">
          <h5 class="card-title">Amount Spent</h5>
          <p class="card-text">Total: <strong>€{{ totalSpent }}</strong></p>
        </div></div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card"><div class="card-body">
          <h5 class="card-title">Refunds</h5>
          <p class="card-text">Total: <strong>{{ refundCount }}</strong></p>
        </div></div>
      </div>
    </div>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'tickets' }" @click="activeTab = 'tickets'">My Tickets</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">Settings</button>
      </li>
      <li class="nav-item" v-if="auth.isOrganizer">
        <button class="nav-link" :class="{ active: activeTab === 'sell' }" @click="activeTab = 'sell'">Sell Tickets</button>
      </li>
    </ul>

    <div class="tab-content">
      <div class="tab-pane fade show active" v-if="activeTab === 'tickets'">
        <div class="results-grid">
          <TicketCard v-for="t in tickets" :key="t.id" v-bind="t">
            <template #action>
              <button v-if="t.status === 'Active'" class="btn btn-sm btn-outline-danger" @click="handleRefund(t.id)">Refund</button>
              <span v-else class="badge bg-secondary">Refunded</span>
            </template>
          </TicketCard>
        </div>
      </div>

      <div class="tab-pane fade show active" v-if="activeTab === 'settings'">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">Personal Details</h5>
            <div class="row g-3" style="max-width:500px;">
              <div class="col-6">
                <label class="form-label" for="editFN">First Name</label>
                <input v-model="profileForm.firstName" id="editFN" type="text" class="form-control">
              </div>
              <div class="col-6">
                <label class="form-label" for="editLN">Last Name</label>
                <input v-model="profileForm.lastName" id="editLN" type="text" class="form-control">
              </div>
              <div class="col-12">
                <label class="form-label" for="editE">Email</label>
                <input v-model="profileForm.email" id="editE" type="email" class="form-control">
              </div>
              <div class="col-12">
                <button class="btn btn-primary me-2" @click="updateProfile">Save Changes</button>
                <button class="btn btn-outline-danger me-2" @click="handleLogout">Sign Out</button>
                <button v-if="!auth.isOrganizer" class="btn btn-outline-warning" @click="becomeOrganizer">Become Organizer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">Security</h5>
            <div class="row g-3" style="max-width:500px;">
              <div class="col-12">
                <label class="form-label" for="newP">New Password</label>
                <input v-model="passwordForm.p1" id="newP" type="password" class="form-control">
              </div>
              <div class="col-12">
                <label class="form-label" for="confP">Confirm New Password</label>
                <input v-model="passwordForm.p2" id="confP" type="password" class="form-control">
              </div>
              <div class="col-12">
                <button class="btn btn-outline-primary" @click="updatePassword">Update Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-pane fade show active" v-if="activeTab === 'sell'">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">List Tickets for Sale</h5>
            <div class="row g-3 mb-4" style="max-width:600px;">
              <div class="col-12">
                <label class="form-label" for="selM">Match</label>
                <select v-model="sellForm.match" class="form-select" id="selM">
                  <option v-for="m in allMatches" :key="m.id" :value="`${m.left} vs ${m.right}`">{{ m.left }} vs {{ m.right }}</option>
                </select>
              </div>
              <div class="col-md-4"><label class="form-label" for="selC">Category</label><select v-model="sellForm.category" class="form-select" id="selC"><option>Standard</option><option>Business</option><option>VIP Box</option></select></div>
              <div class="col-md-4"><label class="form-label" for="selPr">Price (€)</label><input v-model="sellForm.price" id="selPr" type="number" class="form-control"></div>
              <div class="col-md-4"><label class="form-label" for="selQ">Quantity</label><input v-model="sellForm.qty" id="selQ" type="number" class="form-control"></div>
              <div class="col-12"><button class="btn btn-primary" @click="listTicket">List Tickets</button></div>
            </div>
            <div v-if="myListings.length > 0">
              <table class="table table-striped">
                <thead><tr><th>Match</th><th>Category</th><th>Price</th><th>Qty</th><th></th></tr></thead>
                <tbody>
                <tr v-for="l in myListings" :key="l.id">
                  <td>{{ l.match }}</td><td>{{ l.category }}</td><td>€{{ l.price }}</td><td>{{ l.qty }}</td>
                  <td><button class="btn btn-sm btn-outline-danger" @click="removeListing(l.id)">Remove</button></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { injectIcons } from '@/composables/useIcons'
import TicketCard from '@/components/TicketCard.vue'
import api from '@/api/instance'

const auth = useAuthStore()
const router = useRouter()
const activeTab = ref('tickets')
const tickets = ref([])
const myListings = ref([])
const allMatches = ref([])
const profileForm = reactive({ firstName: '', lastName: '', email: '' })
const passwordForm = reactive({ p1: '', p2: '' })
const sellForm = reactive({ match: '', category: 'Standard', price: 0, qty: 1 })

const totalSpent = computed(() => tickets.value.reduce((sum, t) => t.status === 'Active' ? sum + t.total : sum, 0))
const refundCount = computed(() => tickets.value.filter(t => t.status === 'Refunded').length)

onMounted(async () => {
  if (!auth.isAuthenticated) return router.push('/login')
  profileForm.firstName = auth.user.firstName; profileForm.lastName = auth.user.lastName; profileForm.email = auth.user.email
  await loadData(); setTimeout(() => injectIcons(), 0)
})

async function loadData() {
  const [tRes, lRes, mRes] = await Promise.all([api.get(`/tickets?userId=${auth.user.id}`), api.get(`/listings?userId=${auth.user.id}`), api.get('/matches')])
  tickets.value = tRes.data; myListings.value = lRes.data; allMatches.value = mRes.data
}

const updateProfile = async () => {
  const res = await api.patch(`/users/${auth.user.id}`, { ...profileForm })
  auth.login(res.data); alert('Profile updated!')
}

const updatePassword = async () => {
  if (passwordForm.p1 && passwordForm.p1 === passwordForm.p2) {
    await api.patch(`/users/${auth.user.id}`, { password: passwordForm.p1 })
    alert('Password updated!'); passwordForm.p1 = ''; passwordForm.p2 = ''
  } else { alert('Passwords mismatch!') }
}

const handleRefund = async (id) => {
  await api.patch(`/tickets/${id}`, { status: 'Refunded' }); await loadData()
}

const becomeOrganizer = async () => {
  const res = await api.patch(`/users/${auth.user.id}`, { role: 'organizer' })
  auth.login(res.data); activeTab.value = 'sell'
}

const listTicket = async () => {
  await api.post('/listings', { ...sellForm, userId: auth.user.id }); await loadData()
}

const removeListing = async (id) => {
  await api.delete(`/listings/${id}`); await loadData()
}

const handleLogout = () => {
  auth.logout(); router.push('/')
}
</script>
