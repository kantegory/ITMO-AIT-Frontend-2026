import SidebarNav from './SidebarNav.js';
import TopBar from './TopBar.js';
import { useAuth } from '../composables/useAuth.js';

export default {
    name: 'AppLayout',
    components: {
        SidebarNav,
        TopBar
    },
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup() {
        const { currentUser } = useAuth();

        return {
            currentUser
        };
    },
    template: `
        <div class="d-flex app-shell" id="wrapper">
            <SidebarNav />
            <div id="page-content-wrapper" class="w-100">
                <TopBar :title="title" :user="currentUser" />
                <main id="main-content" class="container-fluid p-4">
                    <slot></slot>
                </main>
            </div>
        </div>
    `
};
