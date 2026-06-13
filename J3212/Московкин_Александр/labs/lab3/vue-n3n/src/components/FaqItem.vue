<template>
  <div class="accordion-item">
    <h2 class="accordion-header" :id="`faq-heading-${faq.id}`">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#faq-collapse-${faq.id}`"
      >
        {{ faq.question }}
      </button>
    </h2>
    <div
      :id="`faq-collapse-${faq.id}`"
      class="accordion-collapse collapse"
      :data-bs-parent="`#faqAccordion`"
    >
      <div class="accordion-body">{{ faq.answer }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  faq: { type: Object, required: true }
})
</script>