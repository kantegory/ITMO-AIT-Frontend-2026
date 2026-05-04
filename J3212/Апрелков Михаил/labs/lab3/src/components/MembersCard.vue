<template>
  <section class="card tripatropa-card mb-4" aria-labelledby="members-title">
    <div class="card-body">
      <h2 class="h5 mb-3" id="members-title">Участники поездки</h2>
      <div class="d-flex flex-wrap gap-3 mb-3">
        <div
          v-for="m in members"
          :key="m.id"
          class="d-flex align-items-center"
        >
          <div class="avatar-placeholder me-2">
            <span>{{ memberInitial(m) }}</span>
          </div>
          <div>
            <div class="fw-semibold">{{ memberName(m) }}</div>
            <div class="text-muted-sm">{{ m.role || "Участник" }}</div>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger ms-2"
            @click="$emit('remove', m)"
            title="Убрать из поездки"
          >
            ×
          </button>
        </div>
        <div v-if="!members.length" class="text-muted-sm">
          Пока никого нет — пригласите первого участника по email.
        </div>
      </div>

      <div class="pt-3 border-top">
        <label class="form-label text-muted-sm mb-1" for="inviteEmail">
          Пригласить по email
        </label>
        <div class="input-group input-group-sm mb-2">
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="inviteEmail"
            placeholder="friend@example.com"
            autocomplete="off"
            @keyup.enter="submit"
          />
          <input
            v-model="role"
            type="text"
            class="form-control"
            placeholder="Роль (необязательно)"
            style="max-width: 180px"
          />
          <button
            class="btn btn-primary"
            type="button"
            :disabled="busy"
            @click="submit"
          >
            Пригласить
          </button>
        </div>
        <div v-if="message" class="text-muted-sm" :class="messageClass">
          {{ message }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  members: { type: Array, default: () => [] }
});
const emit = defineEmits(["invite", "remove"]);

const email = ref("");
const role = ref("");
const busy = ref(false);
const message = ref("");
const messageClass = ref("");

function memberName(m) {
  return m.name || m.email || "Участник";
}
function memberInitial(m) {
  const src = m.name || m.email || "?";
  return src.trim()[0].toUpperCase();
}

function showMessage(text, kind) {
  message.value = text;
  messageClass.value = kind === "success" ? "text-success" : "text-danger";
}

async function submit() {
  message.value = "";
  busy.value = true;
  try {
    const result = await new Promise((resolve, reject) => {
      emit("invite", { email: email.value, role: role.value, resolve, reject });
    });
    if (result?.user) {
      showMessage(`${result.user.name} добавлен(а) в группу`, "success");
      email.value = "";
      role.value = "";
    }
  } catch (err) {
    showMessage(err?.message || "Не удалось пригласить", "error");
  } finally {
    busy.value = false;
  }
}
</script>
