<template>
    <BaseLayout>
        <h1 class="visually-hidden">Registration</h1>
        <div class="form-container">
            <h2 class="text-center mb-4">Register</h2>
            <form @submit.prevent="submit">
                <div class="mb-3">
                    <label for="register-username" class="form-label">Username</label>
                    <input id="register-username" v-model="form.username" type="text" class="form-control" autocomplete="username" required />
                </div>
                <div class="mb-3">
                    <label for="register-email" class="form-label">Email</label>
                    <input id="register-email" v-model="form.email" type="email" class="form-control" autocomplete="email" required />
                </div>
                <div class="mb-3">
                    <label for="register-password" class="form-label">Password</label>
                    <input id="register-password" v-model="form.password" type="password" class="form-control" autocomplete="new-password" required />
                </div>

                <p v-if="errorMessage" class="text-danger small">{{ errorMessage }}</p>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                    {{ loading ? "Creating account..." : "Create account" }}
                </button>
            </form>
        </div>
    </BaseLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { createUser, findUserByEmail } from "../api/users";
import { useAuth } from "../composables/useAuth";
import BaseLayout from "../layouts/BaseLayout.vue";
import { generateId } from "../utils/id";
import { hashPassword, isStrongPassword } from "../utils/security";

const router = useRouter();
const { login } = useAuth();

const loading = ref(false);
const errorMessage = ref("");
const form = reactive({
    username: "",
    email: "",
    password: ""
});

const submit = async () => {
    loading.value = true;
    errorMessage.value = "";

    try {
        const normalizedUsername = form.username.trim();
        const normalizedEmail = form.email.trim().toLowerCase();

        if (normalizedUsername.length < 3) {
            errorMessage.value = "Username must contain at least 3 characters.";
            return;
        }

        if (!isStrongPassword(form.password)) {
            errorMessage.value = "Password must be at least 8 chars and include upper/lowercase letters and a digit.";
            return;
        }

        const existing = await findUserByEmail(normalizedEmail);
        if (existing) {
            errorMessage.value = "Email already in use.";
            return;
        }

        const passwordHash = await hashPassword(form.password);
        const payload = {
            id: generateId(),
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash
        };

        const user = await createUser(payload);
        login(user);
        await router.push("/profile");
    } finally {
        loading.value = false;
    }
};
</script>
