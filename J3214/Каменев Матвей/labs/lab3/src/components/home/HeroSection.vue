<template>
  <section class="hero border-bottom" aria-labelledby="hero-heading">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-md-6">
          <img src="/img/hero.png" alt="" class="hero-image" aria-hidden="true" />
        </div>
        <div class="col-md-6">
          <h1 class="display-5" id="hero-heading">Аннотация данных для ML</h1>
          <p class="lead text-muted">Платформа для автоматизированной подготовки и разметки данных под машинное обучение.</p>
          <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#registerModal">
            Начать работу
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 50vh;
  display: flex;
  align-items: center;
  padding-block: 1.5rem;
}

.hero-image {
  width: 100%;
  max-height: calc(50vh - 3rem);
  object-fit: contain;
  display: block;
}
</style>
