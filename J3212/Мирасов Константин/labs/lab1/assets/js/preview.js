const buttons = [...document.querySelectorAll('[data-preview-toggle]')];
const starCount = document.querySelector('#star-count');
const baseCount = Number(starCount.dataset.baseCount);
const previewStatus = document.querySelector('#preview-status');

function resetPreview() {
  for (const button of buttons) {
    button.setAttribute('aria-pressed', 'false');
  }

  starCount.textContent = baseCount;
  previewStatus.textContent = '';
}

for (const button of buttons) {
  button.addEventListener('click', () => {
    const isPressed = button.getAttribute('aria-pressed') !== 'true';

    button.setAttribute('aria-pressed', String(isPressed));

    if (button.dataset.previewToggle === 'star') {
      starCount.textContent = baseCount + Number(isPressed);
      previewStatus.textContent = isPressed
        ? 'Preview: star added locally.'
        : 'Preview: star removed locally.';
    } else {
      previewStatus.textContent = isPressed
        ? 'Preview: subscribed locally. No notifications will be sent.'
        : 'Preview: subscription removed locally.';
    }
  });
  button.disabled = false;
}

window.addEventListener('pageshow', resetPreview);
