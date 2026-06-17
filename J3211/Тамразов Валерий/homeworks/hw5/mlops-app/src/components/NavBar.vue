<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <span class="brand">MLOps Deploy</span>
      <div class="nav-links">
        <a href="#" class="nav-link active">Пайплайны</a>
        <a href="#" class="nav-link">Среды</a>
        <a href="#" class="nav-link">Кабинет</a>
      </div>
      <span class="user-email">tamrazov01@gmail.com</span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  background: #111820;
  border-bottom: 1px solid #1e2a3a;
  padding: 12px 0;
}
.navbar-inner {
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.brand {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #00d4aa;
  font-size: 1.1rem;
  white-space: nowrap;
}
.nav-links { display: flex; gap: 16px; }
.nav-link {
  color: #8b949e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s;
}
.nav-link:hover, .nav-link.active { color: #e6edf3; }
.user-email {
  margin-left: auto;
  color: #586069;
  font-size: 0.85rem;
}
</style>
