import { useAuth } from '../composables/useAuth.js';

const { ref } = window.Vue;

export default {
    name: 'LoginView',
    setup() {
        const router = window.VueRouter.useRouter();
        const route = window.VueRouter.useRoute();
        const { login } = useAuth();

        const email = ref('');
        const password = ref('');
        const error = ref('');
        const isSubmitting = ref(false);

        async function submitLogin() {
            error.value = '';
            isSubmitting.value = true;

            try {
                await login(email.value.trim(), password.value.trim());
                router.push(route.query.redirect || '/dashboard');
            } catch (loginError) {
                error.value = loginError.message;
            } finally {
                isSubmitting.value = false;
            }
        }

        return {
            email,
            password,
            error,
            isSubmitting,
            submitLogin
        };
    },
    template: `
        <main class="auth-wrapper">
            <a href="#loginForm" class="skip-link">Skip to login form</a>
            <section class="card auth-card p-4">
                <div class="text-center mb-4">
                    <h1 class="fw-bold text-primary fs-3">
                        <i class="bi bi-cpu me-2" aria-hidden="true"></i>MLOps Flow
                    </h1>
                    <p class="text-muted mb-0">Sign in to manage your pipelines</p>
                </div>

                <form id="loginForm" @submit.prevent="submitLogin" novalidate aria-label="Login form">
                    <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input
                            v-model="email"
                            type="email"
                            class="form-control"
                            id="email"
                            placeholder="nina@itmo.ru"
                            required
                            autocomplete="email"
                        >
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            id="password"
                            placeholder="123"
                            required
                            autocomplete="current-password"
                        >
                    </div>

                    <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Sign In
                    </button>
                </form>

                <div class="text-center mt-4">
                    <p class="small text-muted mb-0">
                        Don't have an account?
                        <RouterLink to="/register" class="text-decoration-none fw-bold">Register</RouterLink>
                    </p>
                </div>
            </section>
        </main>
    `
};
