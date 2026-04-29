<template>
  <footer class="mt-auto py-5 border-top" style="background-color: var(--bg-light);">
    <div class="container">
      <div class="row align-items-start">
        <div class="col-md-4 footer-column-nav">
          <h5 class="mb-3" style="font-family: 'Montserrat'; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;">Navigation</h5>
          <ul class="list-unstyled small">
            <li class="mb-2"><router-link to="/catalog" class="text-muted text-decoration-none">Каталог</router-link></li>
            <li class="mb-2"><router-link to="/collections" class="text-muted text-decoration-none">Коллекции</router-link></li>
            <li class="mb-2"><router-link to="/about" class="text-muted text-decoration-none">О бренде</router-link></li>
          </ul>
        </div>
        <div class="col-md-4 footer-column-brand">
          <h5 class="mb-2" style="font-family: 'Montserrat'; font-size: 1.1rem; letter-spacing: 0.2em; font-weight: 600;">CONSISTENT AIR</h5>
          <p class="text-muted small" style="letter-spacing: 0.05em;">Quiet strength in motion.</p>
        </div>
        <div class="col-md-4 footer-column-contacts">
          <h5 class="mb-3" style="font-family: 'Montserrat'; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;">Contacts</h5>
          <ul class="list-unstyled small">
            <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Instagram*</a></li>
            <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Telegram</a></li>
            <li class="mb-2"><a href="mailto:info@consistentair.com" class="text-muted text-decoration-none">info@consistentair.com</a></li>
          </ul>
        </div>
      </div>
      <div class="text-center text-muted small mt-5 pt-3 border-top" style="opacity: 0.6;">
        © 2026 Consistent Air. Все права защищены.
      </div>
    </div>
  </footer>
</template>