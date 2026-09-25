export default {
    name: 'StatCard',
    props: {
        label: {
            type: String,
            required: true
        },
        value: {
            type: [String, Number],
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        tone: {
            type: String,
            default: 'primary'
        }
    },
    template: `
        <article class="card stat-card shadow-sm p-3 h-100" :aria-label="label + ': ' + value">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <p class="text-muted mb-1">{{ label }}</p>
                    <p class="h3 fw-bold mb-0">{{ value }}</p>
                </div>
                <div class="icon-box" :class="'bg-light-' + tone" aria-hidden="true">
                    <i class="bi" :class="[icon, 'text-' + tone]"></i>
                </div>
            </div>
        </article>
    `
};
