(function () {
  const saved = localStorage.getItem('theme')
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const theme = saved || preferred
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.setAttribute('data-bs-theme', theme)
})()

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light'
  const next = current === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  document.documentElement.setAttribute('data-bs-theme', next)
  localStorage.setItem('theme', next)
  updateThemeIcon(next)
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle')
  if (!btn) return
  const moon = btn.querySelector('.icon-moon')
  const sun = btn.querySelector('.icon-sun')
  if (theme === 'dark') {
    moon.style.display = 'none'
    sun.style.display = 'block'
  } else {
    moon.style.display = 'block'
    sun.style.display = 'none'
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const theme = document.documentElement.getAttribute('data-theme') || 'light'
  updateThemeIcon(theme)
})
