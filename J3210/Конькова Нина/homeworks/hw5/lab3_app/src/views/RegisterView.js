import { useAuth } from '../composables/useAuth.js';

const { ref, computed } = window.Vue;

export default {
    name: 'RegisterView',
    setup() {
        const router = window.VueRouter.useRouter();
        const { register } = useAuth();

        const username = ref('');
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const error = ref('');

        const canSubmit = computed(() => {
            return username.value.trim()
                && email.value.trim()
                && password.value.length >= 6
                && password.value === confirmPassword.value;
        });

        function submitRegister() {
            error.value = '';

            if (!canSubmit.value) {
                error.value = 'Fill all fields and use matching passwords with at least 6 symbols.';
                return;
            }

            try {
                register({
                    username: username.value.trim(),
                    email: email.value.trim(),
                    password: password.value
                });
                router.push('/dashboard');
            } catch (registerError) {
                error.value = registerError.message;
            }
        }

        return {
            username,
            email,
            password,
            confirmPassword,
            error,
            canSubmit,
            submitRegister
        };
    },
    template: `
        <main class="auth-wrapper">
            <section class="card auth-card auth-card-wide p-4">
                <div class="text-center mb-4">
                    <h1 class="fw-bold text-primary fs-3">
                        <i class="bi bi-cpu me-2" aria-hidden="true"></i>MLOps Flow
                    </h1>
                    <p class="text-muted mb-0">Create an account</p>
                </div>

                <form @submit.prevent="submitRegister" novalidate aria-label="Registration form">
                    <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

                    <div class="mb-3">
                        <label for="username" class="form-label">User name</label>
                        <input v-model="username" id="username" type="text" class="form-control" placeholder="nina_konkova" required>
                    </div>

                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email</label>
                        <input v-model="email" id="registerEmail" type="email" class="form-control" placeholder="name@example.com" required>
                    </div>

                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Password</label>
                        <input v-model="password" id="registerPassword" type="password" class="form-control" required minlength="6">
                    </div>

                    <div class="mb-4">
                        <label for="confirmPassword" class="form-label">Confirm password</label>
                        <input v-model="confirmPassword" id="confirmPassword" type="password" class="form-control" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2" :disabled="!canSubmit">Register</button>
                </form>

                <div class="text-center mt-4">
                    <p class="mb-0 text-muted small">
                        Already have an account?
                        <RouterLink to="/login" class="text-primary text-decoration-none fw-bold">Login</RouterLink>
                    </p>
                </div>
            </section>
        </main>
    `
};
