<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/instance";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AppModal from "@/components/AppModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

const router = useRouter();

const user = ref(null);
const tickets = ref([]);

// auth check
onMounted(() => {
  const isAuth = localStorage.getItem("auth") === "true";

  if (!isAuth) {
    router.push("/");
    return;
  }

  user.value = JSON.parse(localStorage.getItem("user"));

  loadTickets();
});

async function loadTickets() {
  try {
    const res = await api.get(`/tickets?owner=${user.value.email}`);
    tickets.value = res.data;
  } catch (err) {
    console.error("Error loading tickets:", err);
  }
}

function refundTicket(id) {
  showConfirmModal(
    "Refund ticket",
    "Are you sure you want to refund this ticket?",
    async () => {
      try {
        await api.delete(`/tickets/${id}`);
        loadTickets();
      } catch (err) {
        console.error("Refund error:", err);
      }
    }
  );
}

function logout() {
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
  router.push("/");
}


const confirmModal = ref({
  show: false,
  title: "",
  message: "",
  action: null
});

function showConfirmModal(title, message, action) {
  confirmModal.value = {
    show: true,
    title,
    message,
    action
  };
}

function handleConfirm() {
  if (confirmModal.value.action) {
    confirmModal.value.action();
  }
}
</script>

<template>
  <div class="container my-5">

    <h1 class="mb-4">My Account</h1>

    <div class="row">
      <!-- user info -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-4">
          <div class="card-body text-center">
            <div class="mb-3">
            <div class="bg-secondary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                style="width:80px;height:80px;">
                <svg  width="48" height="48" fill="white">
                <use :xlink:href="`/sprite.svg#icon-user`"></use>
                </svg>
            </div>
            </div>

            <h5>{{ user?.name }}</h5>
            <p class="text-muted">{{ user?.email }}</p>

            <button class="btn btn-outline-danger btn-sm" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- tickets -->
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">My Tickets</h5>

            <div v-if="tickets.length === 0" class="text-muted">
              You haven't purchased any tickets yet.
            </div>

            <div v-else>
              <div
                v-for="ticket in tickets"
                :key="ticket.id"
                class="border rounded p-3 mb-2 d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{{ ticket.event }}</strong><br>
                  <small class="text-muted">{{ ticket.date }}</small>
                </div>

                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="refundTicket(ticket.id)"
                >
                  Refund
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
  <ConfirmModal
  :show="confirmModal.show"
  :title="confirmModal.title"
  :message="confirmModal.message"
  @confirm="handleConfirm"
  @close="confirmModal.show = false"
/>
</template>