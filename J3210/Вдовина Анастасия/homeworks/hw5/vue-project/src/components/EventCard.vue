<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">{{ dateShort }} · {{ cityLabel }}, {{ venueShort }}</p>
      <p class="card-text fw-semibold">{{ priceLabel }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    dateShort: {
      type: String,
      required: false,
    },
    cityLabel: {
      type: String,
      required: false,
    },
    venueShort: {
      type: String,
      required: false,
    },
    priceLabel: {
      type: String,
      required: false,
    },
  },
}
</script>
