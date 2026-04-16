<template>
  <div class="page">
    <h1>Наши курсы</h1>
    <p>Здесь представлены программы обучения английскому языку.</p>

    <div class="list">
      <div class="item">Beginner English</div>
      <div class="item">Business English</div>
      <div class="item">Speaking Club</div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px 0;
}

.page h1 {
  color: #4da6ff;
}

.list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  min-width: 220px;
}
</style>