<script setup>
defineProps({
    program: {
        type: Array,
        required: true,
    },
    activeSection: {
        type: Number,
        required: true,
    },
    activeItem: {
        type: Number,
        required: true,
    },
    dismissOnSelect: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['select-lesson'])
</script>

<template>
    <nav aria-label="Уроки курса">
        <section
            v-for="(section, sectionIndex) in program"
            :key="`${section.title}-${sectionIndex}`"
            class="mb-3"
        >
            <h3 class="h6 mb-2 p-2">{{ section.title }}</h3>

            <ul class="list-group">
                <li
                    v-for="(item, itemIndex) in section.items"
                    :key="`${item.title}-${itemIndex}`"
                    class="list-group-item p-0"
                >
                    <button
                        type="button"
                        :data-bs-dismiss="dismissOnSelect ? 'modal' : null"
                        :class="[
                            'list-group-item',
                            'list-group-item-action',
                            sectionIndex === activeSection && itemIndex === activeItem ? 'active' : '',
                        ]"
                        :aria-current="sectionIndex === activeSection && itemIndex === activeItem ? 'location' : null"
                        @click="emit('select-lesson', { sectionIndex, itemIndex })"
                    >
                        {{ itemIndex + 1 }}. {{ item.title }}
                    </button>
                </li>
            </ul>
        </section>
    </nav>
</template>
