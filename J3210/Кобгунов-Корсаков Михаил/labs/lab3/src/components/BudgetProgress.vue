<template>
  <div class="card shadow-sm">
    <div class="card-header">Бюджеты</div>

    <div class="card-body">
      <div class="row">
        <div class="col-md-4">
          <h3 id="products-label">Продукты</h3>
          <div class="progress">
            <div
              class="progress-bar"
              style="width: 60%"
              role="progressbar"
              aria-labelledby="products-label"
              aria-valuenow="60"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>

        <div class="col-md-4">
          <h3 id="transport-label">Транспорт</h3>
          <div class="progress">
            <div
              class="progress-bar bg-success"
              style="width: 40%"
              role="progressbar"
              aria-labelledby="transport-label"
              aria-valuenow="40"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>

        <div class="col-md-4">
          <h3 id="entertainment-label">Развлечения</h3>
          <div class="progress">
            <div
              class="progress-bar bg-warning"
              style="width: 80%"
              role="progressbar"
              aria-labelledby="entertainment-label"
              aria-valuenow="80"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
