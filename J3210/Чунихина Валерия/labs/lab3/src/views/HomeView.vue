<template>
  <header class="container mt-5" aria-labelledby="hero-title">
    <div class="row">
      <div class="col-12 text-center text-lg-start">
        <h1 id="hero-title" class="display-5 fw-bold mb-3">
          Плодородная почва для ваших моделей
        </h1>
        <p class="lead text-muted">
          Исследуйте, выращивайте и делитесь лучшими решениями в мире ИИ.
        </p>
      </div>
    </div>
  </header>

  <div class="container my-5">
    <div class="row">
      <aside class="col-lg-3 mb-4" aria-labelledby="filters-title">
        <div class="card p-4 border-0 shadow-sm sticky-lg-top" style="top: 100px;">
          <h2 id="filters-title" class="h5 mb-3 fw-bold" style="color: var(--bloom-green);">
            Параметры роста
          </h2>

          <form id="filterForm">
            <div class="mb-4">
              <label for="taskSelect" class="form-label small fw-bold text-uppercase">Задача</label>
              <select id="taskSelect" class="form-select border-0 bg-light">
                <option value="">Все задачи</option>
                <option value="text-classification">NLP (текст)</option>
                <option value="image-classification">Computer Vision</option>
                <option value="audio-classification">Audio</option>
                <option value="reinforcement-learning">Reinforcement Learning</option>
              </select>
            </div>

            <fieldset class="mb-4">
              <legend class="form-label small fw-bold text-uppercase">Фреймворк</legend>
              <div class="form-check mb-1">
                <input class="form-check-input" type="checkbox" id="pt">
                <label class="form-check-label small" for="pt">PyTorch</label>
              </div>
              <div class="form-check mb-1">
                <input class="form-check-input" type="checkbox" id="tf">
                <label class="form-check-label small" for="tf">TensorFlow</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="jax">
                <label class="form-check-label small" for="jax">JAX / Flax</label>
              </div>
            </fieldset>

            <div class="mb-4">
              <label for="licenseSelect" class="form-label small fw-bold text-uppercase">Лицензия</label>
              <select id="licenseSelect" class="form-select border-0 bg-light">
                <option value="">Любая лицензия</option>
                <option value="mit">MIT</option>
                <option value="apache-2.0">Apache 2.0</option>
                <option value="cc-by-4.0">Creative Commons</option>
                <option value="openrail">OpenRail</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary w-100 shadow-sm mt-2">
              Применить фильтры
            </button>
          </form>
        </div>
      </aside>

      <main id="main-content" class="col-lg-9" tabindex="-1">
        <form
          id="searchForm"
          class="input-group mb-5 shadow-sm rounded-pill overflow-hidden bg-white"
          role="search"
        >
          <input
            type="text"
            class="form-control border-0 px-4 py-3"
            placeholder="Найдите модель, датасет или автора..."
          >
          <button type="submit" class="btn btn-primary px-4">
            <svg class="ui-icon ui-icon-sm me-2" aria-hidden="true">
              <use href="/sprite.svg#icon-search"></use>
            </svg>
            Поиск
          </button>
        </form>

        <section>
          <div class="row g-4">
            <div class="col-md-6 col-xl-4">
              <article class="card h-100 border-0 shadow-sm card-hover">
                <div class="card-body">
                  <span class="badge badge-model mb-2">Model</span>
                  <h3 class="h5 fw-bold">Forest-Vision v2</h3>
                  <p class="text-muted small">
                    Сегментация лесных массивов и анализ спутниковых снимков.
                  </p>
                  <button class="btn btn-outline-primary btn-sm mt-3">Изучить</button>
                </div>
              </article>
            </div>

            <div class="col-md-6 col-xl-4">
              <article class="card h-100 border-0 shadow-sm card-hover">
                <div class="card-body">
                  <span class="badge badge-dataset mb-2">Dataset</span>
                  <h3 class="h5 fw-bold">Dataset-Botanical-Seeds</h3>
                  <p class="text-muted small">
                    Набор данных для обучения моделей распознавания растений.
                  </p>
                  <button class="btn btn-outline-primary btn-sm mt-3">Изучить</button>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <section class="container my-5 py-5 border-top" aria-labelledby="trendsTitle">
    <div class="d-flex align-items-center mb-4">
      <h2 id="trendsTitle" class="h3 fw-bold mb-0">Мировые тренды</h2>
      <span class="badge bg-soft-blue text-primary ms-3">Live Data</span>
    </div>

    <div class="row">
      <div class="col-md-6 col-xl-4">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <span class="badge badge-model mb-2">Model</span>
            <h3 class="h5 fw-bold">all-MiniLM-L6-v2</h3>
            <p class="text-muted small">Популярная модель для sentence similarity.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
