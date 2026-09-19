<script setup>
defineProps({ resource: { type: Object, required: true } });
</script>
<template>
  <section>
    <h2>Overview</h2>
    <p>{{ resource.description }}</p>
  </section>
  <section>
    <h2>Demo metrics</h2>
    <dl>
      <template v-for="(metric, index) in resource.metrics" :key="index"
        ><dt>{{ metric.label }}</dt>
        <dd>{{ metric.value ?? 'Not available' }} {{ metric.unit }}</dd></template
      >
    </dl>
    <p class="small">Illustrative values only; no evaluation has been run by AxonHub.</p>
  </section>
  <section>
    <h2>Usage example</h2>
    <p>This example is for reference. No code is executed by AxonHub.</p>
    <pre tabindex="0" aria-label="Usage example"><code>{{ resource.usageExample }}</code></pre>
  </section>
  <section>
    <h2>Reproducibility</h2>
    <details>
      <summary>Reproducibility details</summary>
      <p>Version: {{ resource.revision }}</p>
      <p>Environment: {{ resource.reproducibility.environment }}</p>
      <p>Seed: {{ resource.reproducibility.seed ?? 'Not specified' }}</p>
      <ol>
        <li v-for="(step, index) in resource.reproducibility.steps" :key="index">
          {{ step }}
        </li>
      </ol>
    </details>
  </section>
</template>
