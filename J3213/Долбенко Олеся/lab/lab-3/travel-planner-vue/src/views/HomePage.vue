<template>
  <div class="hero-section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-lg-8 mx-auto text-center">
          <h1 class="display-4">Планируй путешествия с удовольствием</h1>
          <p class="lead mt-3">Находи лучшие маршруты, сохраняй заметки и делись впечатлениями</p>
          <router-link to="/search" class="btn btn-primary btn-lg mt-3">Начать поиск</router-link>
          <router-link to="/map" class="btn btn-outline-light btn-lg mt-3 ms-3">Построить маршрут</router-link>
        </div>
      </div>
    </div>

    <div class="container mt-5">
      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="card text-center h-100 shadow-sm bg-white bg-opacity-75">
            <div class="card-body">
              <svg width="32" height="32" fill="currentColor" class="text-success" aria-hidden="true">
                <use href="/images/sprite.svg#icon-diagram"></use>
              </svg>
              <h3 class="card-title mt-3 h5">Сложные маршруты</h3>
              <p class="card-text">Строй маршруты с несколькими точками</p>
              <router-link to="/map" class="btn btn-outline-success btn-sm">Попробовать</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="card text-center h-100 shadow-sm bg-white bg-opacity-75">
            <div class="card-body">
              <svg width="32" height="32" fill="currentColor" class="text-success" aria-hidden="true">
                <use href="/images/sprite.svg#icon-calculator"></use>
              </svg>
              <h3 class="card-title mt-3 h5">Планируй бюджет</h3>
              <p class="card-text">Учитывай расходы и доходы</p>
              <router-link to="/profile" class="btn btn-outline-success btn-sm">Попробовать</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="card text-center h-100 shadow-sm bg-white bg-opacity-75">
            <div class="card-body">
              <svg width="32" height="32" fill="currentColor" class="text-success" aria-hidden="true">
                <use href="/images/sprite.svg#icon-share"></use>
              </svg>
              <h3 class="card-title mt-3 h5">Обмен маршрутами</h3>
              <p class="card-text">Делись заметками с друзьями</p>
              <router-link to="/profile" class="btn btn-outline-success btn-sm">Попробовать</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="card text-center h-100 shadow-sm bg-white bg-opacity-75">
            <div class="card-body">
              <svg width="32" height="32" fill="currentColor" class="text-success" aria-hidden="true">
                <use href="/images/sprite.svg#icon-compass"></use>
              </svg>
              <h3 class="card-title mt-3 h5">Новые места</h3>
              <p class="card-text">Открывай интересные направления</p>
              <router-link to="/search" class="btn btn-outline-success btn-sm">Попробовать</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>