import { useToast } from '../composables/useToast.js';

export default {
    name: 'ToastHost',
    setup() {
        const { messages, dismissToast } = useToast();

        return {
            messages,
            dismissToast
        };
    },
    template: `
        <div class="toast-host" aria-live="polite" aria-atomic="true">
            <div
                v-for="message in messages"
                :key="message.id"
                class="toast-message shadow-lg"
                :class="'toast-' + message.variant"
                role="status"
            >
                <div class="d-flex align-items-start gap-3">
                    <i class="bi bi-info-circle-fill mt-1" aria-hidden="true"></i>
                    <p class="mb-0 flex-grow-1">{{ message.text }}</p>
                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        aria-label="Dismiss notification"
                        @click="dismissToast(message.id)"
                    ></button>
                </div>
            </div>
        </div>
    `
};
