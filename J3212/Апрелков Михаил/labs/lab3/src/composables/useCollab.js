import { ref } from "vue";
import { collabApi, tripMembersApi, usersApi } from "../api/api.js";

export function useCollab(tripId = "default") {
  const notes = ref([]);
  const activities = ref([]);
  const members = ref([]);

  async function load() {
    try {
      notes.value = await collabApi.listNotes(tripId);
    } catch (e) {
      notes.value = [];
    }
    try {
      activities.value = await collabApi.listActivities(tripId);
    } catch (e) {
      activities.value = [];
    }
    try {
      members.value = await tripMembersApi.listByTrip(tripId);
    } catch (e) {
      members.value = [];
    }
  }

  async function addNote(payload) {
    const created = await collabApi.createNote({ tripId, ...payload });
    notes.value = [...notes.value, created];
    return created;
  }

  async function removeNote(id) {
    await collabApi.removeNote(id);
    notes.value = notes.value.filter((n) => n.id !== id);
  }

  async function inviteByEmail(email, role) {
    const normalized = String(email || "").trim().toLowerCase();
    if (!normalized) {
      const err = new Error("Введите email");
      err.code = "empty";
      throw err;
    }
    const found = await usersApi.findByEmail(normalized);
    if (!found.length) {
      const err = new Error("Пользователь с таким email не найден");
      err.code = "not_found";
      throw err;
    }
    const user = found[0];
    if (members.value.some((m) => String(m.userId) === String(user.id))) {
      const err = new Error("Этот участник уже в группе");
      err.code = "duplicate";
      throw err;
    }
    const created = await tripMembersApi.add({
      tripId,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: (role || "").trim() || "Участник"
    });
    members.value = [...members.value, created];
    return { user, member: created };
  }

  async function removeMember(id) {
    await tripMembersApi.remove(id);
    members.value = members.value.filter((m) => m.id !== id);
  }

  return {
    notes,
    activities,
    members,
    load,
    addNote,
    removeNote,
    inviteByEmail,
    removeMember
  };
}
