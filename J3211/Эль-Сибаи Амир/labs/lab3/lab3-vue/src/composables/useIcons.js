export function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    if (el.querySelector('.icon')) return;
    const icon = el.getAttribute('data-icon');
    el.insertAdjacentHTML('afterbegin', `<svg class="icon" aria-hidden="true"><use xlink:href="/sprite.svg#icon-${icon}"></use></svg>`);
  });
}
