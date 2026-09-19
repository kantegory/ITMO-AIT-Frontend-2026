import { getResources, forkResource } from '../services/resources.js';
import { getSession } from '../session.js';

export function initFork(pageType, id) {
  let loadedResource;
  const forkButton = document.querySelector('#fork-resource');
  const forkStatus = document.querySelector('#fork-status');
  const forkLogin = document.querySelector('#fork-login');

  forkButton.addEventListener('click', async () => {
    if (forkButton.disabled || !loadedResource) {
      return;
    }

    const session = getSession();

    if (!session) {
      forkLogin.hidden = false;
      forkLogin.href = `login.html?returnTo=${encodeURIComponent(`${pageType}.html?id=${id}#fork-heading`)}`;
      forkStatus.textContent = 'Log in to create your own metadata copy.';
      forkLogin.focus();

      return;
    }

    forkButton.disabled = true;
    forkStatus.textContent = 'Opening your metadata copy…';

    try {
      const fork = await forkResource(loadedResource, session.user);

      location.assign(`${fork.type}.html?id=${fork.id}`);
    } catch (error) {
      forkStatus.textContent =
        error.status === 401
          ? 'Your session expired. Log in and try again.'
          : 'Could not confirm the copy. Try again to check for an existing fork before creating one.';

      if (error.status === 401) {
        forkLogin.href = `login.html?returnTo=${encodeURIComponent(`${pageType}.html?id=${id}#fork-heading`)}`;
        forkLogin.hidden = false;
      }
    } finally {
      forkButton.disabled = false;
    }
  });

  async function renderFork(resource) {
    loadedResource = resource;
    forkButton.disabled = false;
    forkButton.textContent = 'Fork metadata';

    const sourceLink = document.querySelector('#fork-source');

    sourceLink.hidden = true;

    if (Number.isSafeInteger(resource.sourceResourceId) && resource.sourceResourceId > 0) {
      sourceLink.href = `${resource.type}.html?id=${resource.sourceResourceId}`;
      sourceLink.hidden = false;
    }

    const session = getSession();

    if (session) {
      try {
        const resources = await getResources(session.user.id);

        if (resources.some((item) => item.sourceResourceId === resource.id)) {
          forkButton.textContent = 'Open your fork';
        }
      } catch {}
    }
  }

  return { renderFork };
}
