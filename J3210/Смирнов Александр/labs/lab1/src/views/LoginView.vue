<template>
    <BaseLayout>
        <h1 class="visually-hidden">Log in</h1>
        <div class="form-container">
            <h2 class="text-center mb-4">Log in</h2>
            <form @submit.prevent="submit">
                <div class="mb-3">
                    <label for="login-email" class="form-label">Email</label>
                    <input id="login-email" v-model="form.email" type="email" class="form-control" autocomplete="email" required />
                </div>
                <div class="mb-3">
                    <label for="login-password" class="form-label">Password</label>
                    <input id="login-password" v-model="form.password" type="password" class="form-control" autocomplete="current-password" required />
                </div>

                <p v-if="errorMessage" class="text-danger small">{{ errorMessage }}</p>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                    {{ loading ? "Checking..." : "Log in" }}
                </button>
            </form>
            <p class="text-center mt-3">
                Don't have an account?
                <RouterLink to="/register">Sign up</RouterLink>
            </p>
        </div>
    </BaseLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { findUserByCredentials } from "../api/users";
import { useAuth } from "../composables/useAuth";
import BaseLayout from "../layouts/BaseLayout.vue";

const route = useRoute();
const router = useRouter();
const { login } = useAuth();

const loading = ref(false);
const errorMessage = ref("");
const form = reactive({
    email: "",
    password: ""
});

const submit = async () => {
    loading.value = true;
    errorMessage.value = "";

    try {
        const normalizedEmail = form.email.trim().toLowerCase();
        const user = await findUserByCredentials(normalizedEmail, form.password);
        if (!user) {
            errorMessage.value = "Invalid email or password.";
            return;
        }

        login(user);
        const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/profile";
        await router.push(redirect);
    } finally {
        loading.value = false;
    }
};
</script>
