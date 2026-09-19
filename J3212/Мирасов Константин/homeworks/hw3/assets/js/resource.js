import { getResource } from './services/resources.js';
import { initDiscussion } from './discussion.js';
import { initFork } from './resource/fork.js';
import { initSocialActions } from './resource/social-actions.js';
import { setText, renderResource } from './resource/render.js';

const content = document.querySelector('#resource-content');
const status = document.querySelector('#resource-status');
const retry = document.querySelector('#retry-resource');
const pageType = document.querySelector('main').dataset.resourceType;
const params = new URLSearchParams(location.search);
const rawId = params.get('id') ?? (pageType === 'model' ? '1' : '4');
const id = Number(rawId);
const validId =
  params.getAll('id').length <= 1 && /^[1-9]\d*$/.test(rawId) && Number.isSafeInteger(id);

const { renderFork } = initFork(pageType, id);
const { loadStars, loadSubscription } = initSocialActions(pageType, id);

async function loadResource() {
  if (retry.disabled) {
    return;
  }

  const restoreFocus = document.activeElement === retry;
  retry.disabled = true;
  content.hidden = true;
  document.querySelector('#resource-owner').hidden = true;
  status.textContent = 'Loading resource...';

  try {
    const resource = await getResource(id);

    if (resource.type !== pageType) {
      location.replace(`${resource.type}.html?id=${id}`);

      return;
    }

    renderResource(resource);
    renderFork(resource);
    initDiscussion(id);
    document.querySelector('#resource-owner').hidden = false;
    content.hidden = false;
    status.textContent = 'Resource loaded.';
    retry.hidden = true;
    loadStars();
    loadSubscription();

    if (restoreFocus) {
      status.focus();
    }
  } catch (error) {
    const missing = error.status === 404;
    setText('#resource-name', missing ? 'Resource not found' : 'Resource unavailable');
    document.title = `${missing ? 'Resource not found' : 'Resource unavailable'} · AxonHub`;
    status.textContent = missing
      ? 'This resource does not exist. Return to Explore to choose another.'
      : 'Could not load this resource. Please try again.';
    retry.hidden = missing;
  } finally {
    retry.disabled = false;
  }
}

retry.addEventListener('click', loadResource);

if (validId) {
  loadResource();
} else {
  setText('#resource-name', 'Invalid resource ID');
  document.title = 'Invalid resource ID · AxonHub';
  status.textContent = 'Choose a resource from Explore.';
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted && !content.hidden && validId) {
    loadStars();
    loadSubscription();
  }
});
