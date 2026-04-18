<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text">{{ text }}</p>
    </div>
  </div>
</template>
<script>
export default {props: {name: String, text: String}}
</script>
