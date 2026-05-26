<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppTopbar from "../components/AppTopbar.vue";
import { deleteAccount, saveProfile, session } from "../session.js";

const router = useRouter();
const name = ref(session.name);
const email = ref(session.email);
const bio = ref("");
const saved = ref(false);
const avatar = ref(localStorage.getItem("userAvatarBase64") || "");

async function save() {
    await saveProfile(name.value, email.value);
    saved.value = true;
    setTimeout(() => saved.value = false, 1500);
}

function selectAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        avatar.value = reader.result;
        localStorage.setItem("userAvatarBase64", reader.result);
    };
    reader.readAsDataURL(file);
}

async function removeAccount() {
    if (!window.confirm("Удалить аккаунт?")) return;
    await deleteAccount();
    router.push("/register");
}
</script>

<template>
    <AppTopbar title="Настройки">
        <template #actions><button class="btn btn-primary px-4" type="button" @click="save">{{ saved ? "Сохранено!" : "Сохранить" }}</button></template>
    </AppTopbar>
    <div class="content-area">
        <div class="row">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h5 class="fw-bold mb-4">Профиль пользователя</h5>
                    <div class="mb-3"><label class="form-label small text-muted" for="userNameInput">Имя пользователя</label><input v-model="name" type="text" class="form-control" id="userNameInput"></div>
                    <div class="mb-3"><label class="form-label small text-muted" for="userEmailInput">Email</label><input v-model="email" type="email" class="form-control" id="userEmailInput"></div>
                    <div class="mb-3"><label class="form-label small text-muted" for="userBioInput">О себе</label><textarea v-model="bio" class="form-control" id="userBioInput" rows="3"></textarea></div>
                </div>
                <div class="card border-0 shadow-sm rounded-4 p-4">
                    <h5 class="fw-bold mb-4">Уведомления</h5>
                    <div class="form-check form-switch mb-3"><input class="form-check-input" type="checkbox" id="notifyEmail" checked><label class="form-check-label" for="notifyEmail">Уведомления по Email</label></div>
                    <div class="form-check form-switch mb-3"><input class="form-check-input" type="checkbox" id="notifyUpdates" checked><label class="form-check-label" for="notifyUpdates">Обновления подписок</label></div>
                    <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="notifyNews"><label class="form-check-label" for="notifyNews">Новости платформы</label></div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center">
                    <div class="mb-3">
                        <img v-if="avatar" :src="avatar" class="rounded-circle border profile-avatar" alt="Аватар пользователя">
                        <div v-else class="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center profile-avatar">{{ name.substring(0, 2).toUpperCase() }}</div>
                    </div>
                    <label class="btn btn-outline-primary btn-sm w-100 mb-2" for="avatarInput">Сменить фото</label>
                    <input class="visually-hidden" type="file" id="avatarInput" accept="image/*" @change="selectAvatar">
                    <button class="btn btn-outline-secondary btn-sm w-100" type="button">Изменить пароль</button>
                </div>
                <div class="card border-0 shadow-sm rounded-4 p-4 bg-light">
                    <h6 class="fw-bold text-danger mb-3">Опасная зона</h6>
                    <p class="small text-muted">Удаление аккаунта приведет к потере всех ваших моделей и датасетов.</p>
                    <button class="btn btn-danger btn-sm w-100" type="button" @click="removeAccount">Удалить аккаунт</button>
                </div>
            </div>
        </div>
    </div>
</template>
