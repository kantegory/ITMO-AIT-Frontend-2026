import { getInitials } from './services/format.js';
import { getSession } from './session.js';
import { getResources } from './services/resources.js';
import { getSubscriptions, setSubscription } from './services/social.js';

const main = document.querySelector('main');
const list = document.querySelector('#your-resources');
const status = document.querySelector('#resource-status');
const retry = document.querySelector('#retry-resources');
const empty = document.querySelector('#empty-resources');
const template = document.querySelector('#profile-resource-template');
let loadId = 0;
const subscriptionsList = document.querySelector('#subscriptions-list');
const subscriptionsStatus = document.querySelector('#subscriptions-status');
const subscriptionsRetry = document.querySelector('#retry-subscriptions');
let subscriptionsLoadId = 0;

async function loadSubscriptions() {
  const restoreFocus = document.activeElement === subscriptionsRetry;
  const requestId = ++subscriptionsLoadId;
  const session = getSession();

  if (!session) {
    loadProfile();

    return;
  }

  subscriptionsRetry.disabled = true;
  subscriptionsRetry.hidden = true;
  subscriptionsList.replaceChildren();
  subscriptionsStatus.textContent = 'Loading subscriptions…';

  try {
    const [rows, resources] = await Promise.all([
      getSubscriptions('userId', session.user.id),
      getResources(),
    ]);

    if (requestId !== subscriptionsLoadId || getSession()?.accessToken !== session.accessToken) {
      return;
    }

    const ids = [...new Set(rows.map((row) => row.resourceId))];
    const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
    let missing = 0;

    for (const id of ids) {
      const resource = resourcesById.get(id);

      if (!resource) {
        missing++;
        continue;
      }

      const row = createRow(resource);
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'btn btn-outline-primary';
      button.textContent = 'Unsubscribe';
      button.setAttribute('aria-label', `Unsubscribe from ${resource.name}`);
      button.addEventListener('click', async () => {
        if (button.disabled) {
          return;
        }

        button.disabled = true;

        try {
          await setSubscription(id, session.user.id, false);
          await loadSubscriptions();
          subscriptionsStatus.focus();
        } catch (error) {
          if (error.status === 401) {
            loadProfile();

            return;
          }

          subscriptionsStatus.textContent =
            'Could not confirm unsubscribe. Reload subscriptions before trying again.';
          subscriptionsRetry.hidden = false;
          subscriptionsRetry.focus();
        }
      });
      row.append(button);
      subscriptionsList.append(row);
    }

    subscriptionsStatus.textContent = ids.length
      ? `${ids.length - missing} subscribed ${ids.length - missing === 1 ? 'resource' : 'resources'}.${missing ? ` ${missing} unavailable resources were skipped.` : ''}`
      : 'No subscriptions yet. Explore resources to subscribe.';

    if (restoreFocus) {
      subscriptionsStatus.focus();
    }
  } catch {
    if (requestId !== subscriptionsLoadId) {
      return;
    }

    subscriptionsStatus.textContent = 'Could not load subscriptions. Please retry.';
    subscriptionsRetry.hidden = false;
  } finally {
    if (requestId === subscriptionsLoadId) {
      subscriptionsRetry.disabled = false;
    }
  }
}

subscriptionsRetry.addEventListener('click', loadSubscriptions);

function createRow(resource) {
  const row = template.content.firstElementChild.cloneNode(true);

  row.querySelector('.axon-resource-type').textContent =
    resource.type === 'model' ? 'Model' : 'Dataset';

  const link = row.querySelector('a');

  link.textContent = resource.name;
  link.href = `${resource.type}.html?id=${resource.id}`;
  row.querySelector('p').textContent = resource.summary;

  return row;
}

async function loadProfile() {
  const restoreFocus = document.activeElement === retry;
  const requestId = ++loadId;
  const session = getSession();

  if (!session) {
    main.hidden = true;
    location.replace('login.html?returnTo=profile.html');

    return;
  }

  const { user } = session;

  document.querySelector('#profile-name').textContent = user.displayName;
  document.querySelector('#profile-email').textContent = user.email;
  document.querySelector('#profile-avatar').textContent = getInitials(user.displayName);
  main.hidden = false;
  loadSubscriptions();
  list.replaceChildren();
  list.setAttribute('aria-busy', 'true');
  empty.hidden = true;
  retry.hidden = true;
  retry.disabled = true;
  status.textContent = 'Loading your resources…';

  try {
    const resources = await getResources(user.id);

    if (requestId !== loadId || getSession()?.accessToken !== session.accessToken) {
      return;
    }

    list.replaceChildren(...resources.map(createRow));
    empty.hidden = resources.length !== 0;
    status.textContent = `${resources.length} ${resources.length === 1 ? 'resource' : 'resources'}`;

    if (restoreFocus) {
      status.focus();
    }
  } catch {
    if (requestId !== loadId) {
      return;
    }

    status.textContent = 'Could not load your resources. Check the local API and try again.';
    retry.hidden = false;
  } finally {
    if (requestId === loadId) {
      list.setAttribute('aria-busy', 'false');
      retry.disabled = false;
    }
  }
}

retry.addEventListener('click', loadProfile);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    loadProfile();
  }
});

window.addEventListener('pagehide', () => {
  main.hidden = true;
});
loadProfile();
