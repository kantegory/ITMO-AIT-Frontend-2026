import { useAuth } from '../composables/useAuth.js';

export default {
    name: 'SidebarNav',
    setup() {
        const { logout } = useAuth();
        const router = window.VueRouter.useRouter();

        const navItems = [
            { to: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
            { to: '/experiments', label: 'Experiments', icon: 'bi-clipboard-data' },
            { to: '/models', label: 'Models', icon: 'bi-box-seam' },
            { to: '/artifacts', label: 'Artifacts', icon: 'bi-archive' }
        ];

        function handleLogout() {
            logout();
            router.push('/login');
        }

        return {
            navItems,
            handleLogout
        };
    },
    template: `
        <nav id="sidebar-wrapper" aria-label="Sidebar navigation">
            <RouterLink to="/dashboard" class="sidebar-heading text-primary fw-bold p-4 fs-4">
                <i class="bi bi-cpu me-2" aria-hidden="true"></i>MLOps Flow
            </RouterLink>
            <div class="list-group list-group-flush px-3" role="list">
                <RouterLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    class="list-group-item list-group-item-action rounded mb-1"
                    active-class="active"
                >
                    <i class="bi me-2" :class="item.icon" aria-hidden="true"></i>{{ item.label }}
                </RouterLink>
                <button
                    type="button"
                    class="list-group-item list-group-item-action text-danger mt-2"
                    @click="handleLogout"
                >
                    <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Logout
                </button>
            </div>
        </nav>
    `
};
