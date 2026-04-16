<template>
  <div>
    <header class="hero">
      <h1>SpeakEasy</h1>
      <p>Курсы английского языка онлайн</p>
    </header>

    <section class="courses">
      <div class="card">
        <h2>Beginner English</h2>
        <p>Базовый курс английского для начинающих.</p>
        <button>Записаться</button>
      </div>

      <div class="card">
        <h2>Business English</h2>
        <p>Английский для работы, переговоров и деловой переписки.</p>
        <button>Записаться</button>
      </div>

      <div class="card">
        <h2>Speaking Club</h2>
        <p>Разговорная практика с упором на живое общение.</p>
        <button>Записаться</button>
      </div>
    </section>

    <footer class="footer">
      © 2026 SpeakEasy. Все права защищены.
    </footer>
  </div>
</template>

<style scoped>
.hero {
  background: #4da6ff;
  color: white;
  text-align: center;
  padding: 60px 20px;
}

.hero h1 {
  font-size: 56px;
  margin: 0;
}

.hero p {
  margin-top: 10px;
  font-size: 24px;
}

.courses {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 50px 20px;
  flex-wrap: wrap;
}

.card {
  background: white;
  width: 300px;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
  text-align: center;
}

.card h2 {
  color: #4da6ff;
}

button {
  margin-top: 15px;
  background: #4da6ff;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
}

.footer {
  background: #1f1f1f;
  color: white;
  text-align: center;
  padding: 20px;
}
</style>