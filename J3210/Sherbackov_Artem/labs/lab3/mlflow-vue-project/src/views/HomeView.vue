<script setup>
import HomeLayout from '@/layouts/HomeLayout.vue';

const features = [
  { title: 'Experiments', desc: 'Do smth' },
  { title: 'Models', desc: 'Do smth' },
  { title: 'Artifacts', desc: 'Do smth' },
  { title: 'Versioning', desc: 'smth' },
  { title: 'Deployment', desc: 'smth' },
  { title: 'Logging', desc: 'smth' },
];
</script>

<template>
  <HomeLayout>
    <section class="text-center py-4">
      <div class="container">
        <h1 class="display-4 fw-bold mb-4">
          Russian ML Pipeline Service
        </h1>

        <div class="px-4 py-5 my-5 text-center">
          <h2 class="display-5 fw-bold text-body-emphasis">Super-puper tool</h2>
          <div class="col-lg-6 mx-auto">
            <p class="lead mb-4">
              With our service you can do anything
            </p>
          </div>
          <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#signupModal">
            Get started
          </button>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <h2 class="visually-hidden">Our Features</h2>
        <div class="row text-center">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="col-12 col-sm-6 col-md-4 mb-4"
          >
            <h3 class="mb-3">{{ feature.title }}</h3>
            <p class="text-muted">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </HomeLayout>
</template>