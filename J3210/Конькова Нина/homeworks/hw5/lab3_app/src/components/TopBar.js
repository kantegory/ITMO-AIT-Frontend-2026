import { useTheme } from '../composables/useTheme.js';

export default {
    name: 'TopBar',
    props: {
        title: {
            type: String,
            required: true
        },
        user: {
            type: Object,
            default: null
        }
    },
    setup() {
        const { icon, label, toggleTheme } = useTheme();

        function avatarUrl(user) {
            return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username || user.email);
        }

        return {
            icon,
            label,
            toggleTheme,
            avatarUrl
        };
    },
    template: `
        <header>
            <nav class="navbar navbar-expand-lg border-bottom px-4 py-3" aria-label="Top bar">
                <h1 class="h4 mb-0">{{ title }}</h1>
                <div class="ms-auto d-flex align-items-center gap-3">
                    <button class="theme-toggle" type="button" :aria-label="label" @click="toggleTheme">
                        <i class="bi" :class="icon" aria-hidden="true"></i>
                    </button>
                    <span v-if="user" class="text-muted user-name">{{ user.username || user.email }}</span>
                    <img
                        v-if="user"
                        :src="avatarUrl(user)"
                        class="rounded-circle"
                        width="35"
                        height="35"
                        :alt="'Profile picture of ' + (user.username || user.email)"
                    >
                </div>
            </nav>
        </header>
    `
};
