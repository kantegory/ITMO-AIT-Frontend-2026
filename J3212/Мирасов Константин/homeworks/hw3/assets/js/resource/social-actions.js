import {
  getStars,
  addStar,
  removeStar,
  getSubscriptions,
  setSubscription,
} from '../services/social.js';
import { getSession } from '../session.js';

export function initSocialActions(pageType, id) {
  const starButton = document.querySelector('#star-resource');
  const starStatus = document.querySelector('#star-status');
  const starRetry = document.querySelector('#retry-stars');
  const starLogin = document.querySelector('#star-login');
  let stars = [];

  function renderStars() {
    const userId = getSession()?.user.id;
    starButton.setAttribute('aria-pressed', String(stars.some((star) => star.userId === userId)));
    document.querySelector('#star-count').textContent = new Set(
      stars.map((star) => star.userId),
    ).size;
    starLogin.hidden = Boolean(userId);
    starLogin.href = `login.html?returnTo=${encodeURIComponent(`${pageType}.html?id=${id}`)}`;
  }

  async function loadStars() {
    const restoreFocus = document.activeElement === starRetry;
    starButton.disabled = true;
    starRetry.disabled = true;
    starStatus.textContent = 'Loading stars…';

    try {
      stars = await getStars(id);
      renderStars();
      starStatus.textContent = `${new Set(stars.map((star) => star.userId)).size} stars loaded.`;
      starRetry.hidden = true;
      starButton.disabled = false;

      if (restoreFocus) {
        starButton.focus();
      }
    } catch {
      starStatus.textContent = 'Could not load stars. Please retry.';
      starRetry.hidden = false;
    } finally {
      starRetry.disabled = false;
    }
  }

  starRetry.addEventListener('click', loadStars);
  starButton.addEventListener('click', async () => {
    if (starButton.disabled) {
      return;
    }

    const session = getSession();

    if (!session) {
      renderStars();
      starStatus.textContent = 'Log in to star this resource.';
      starLogin.focus();

      return;
    }

    const remove = starButton.getAttribute('aria-pressed') === 'true';
    starButton.disabled = true;
    starButton.setAttribute('aria-busy', 'true');
    starStatus.textContent = 'Saving star…';

    try {
      const current = await getStars(id);
      const own = current.filter((star) => star.userId === session.user.id);

      if (remove) {
        for (const star of own) {
          await removeStar(star.id);
        }
      } else if (!own.length) {
        await addStar(id, session.user.id);
      }

      stars = await getStars(id);
      renderStars();
      starStatus.textContent = `${remove ? 'Star removed.' : 'Star saved.'} ${new Set(stars.map((star) => star.userId)).size} stars total.`;
    } catch (error) {
      starStatus.textContent =
        error.status === 401
          ? 'Your session expired. Log in to continue.'
          : 'Could not confirm the change. Reload stars before trying again.';
      starRetry.hidden = false;
      renderStars();

      return;
    } finally {
      starButton.setAttribute('aria-busy', 'false');
      starButton.disabled = !starRetry.hidden;
    }
  });

  const subscriptionButton = document.querySelector('#subscribe-resource');
  const subscriptionStatus = document.querySelector('#subscription-status');
  const subscriptionRetry = document.querySelector('#retry-subscriptions');
  const subscriptionLogin = document.querySelector('#subscription-login');
  let subscriptions = [];

  function renderSubscription() {
    const userId = getSession()?.user.id;
    subscriptionButton.setAttribute(
      'aria-pressed',
      String(subscriptions.some((row) => row.userId === userId)),
    );
    subscriptionLogin.hidden = Boolean(userId);
    subscriptionLogin.href = `login.html?returnTo=${encodeURIComponent(`${pageType}.html?id=${id}`)}`;
  }

  async function loadSubscription() {
    const restoreFocus = document.activeElement === subscriptionRetry;
    subscriptionButton.disabled = true;
    subscriptionRetry.disabled = true;
    subscriptionStatus.textContent = 'Loading subscriptions…';

    try {
      subscriptions = await getSubscriptions('resourceId', id);
      renderSubscription();
      subscriptionStatus.textContent = getSession()
        ? subscriptionButton.getAttribute('aria-pressed') === 'true'
          ? 'You are subscribed.'
          : 'You are not subscribed.'
        : 'Log in to subscribe to this resource.';
      subscriptionRetry.hidden = true;
      subscriptionButton.disabled = false;

      if (restoreFocus) {
        subscriptionButton.focus();
      }
    } catch {
      subscriptionStatus.textContent = 'Could not load subscriptions. Please retry.';
      subscriptionRetry.hidden = false;
    } finally {
      subscriptionRetry.disabled = false;
    }
  }

  subscriptionRetry.addEventListener('click', loadSubscription);
  subscriptionButton.addEventListener('click', async () => {
    if (subscriptionButton.disabled) {
      return;
    }

    const session = getSession();

    if (!session) {
      renderSubscription();
      subscriptionStatus.textContent = 'Log in to subscribe to this resource.';
      subscriptionLogin.focus();

      return;
    }

    const remove = subscriptionButton.getAttribute('aria-pressed') === 'true';
    subscriptionButton.disabled = true;
    subscriptionButton.setAttribute('aria-busy', 'true');
    subscriptionStatus.textContent = 'Saving subscription…';

    try {
      await setSubscription(id, session.user.id, !remove);
      subscriptions = await getSubscriptions('resourceId', id);
      renderSubscription();
      subscriptionStatus.textContent = remove ? 'Unsubscribed.' : 'Subscribed.';
    } catch (error) {
      subscriptionStatus.textContent =
        error.status === 401
          ? 'Your session expired. Log in to continue.'
          : 'Could not confirm the change. Reload subscriptions before trying again.';
      subscriptionRetry.hidden = false;
      renderSubscription();

      return;
    } finally {
      subscriptionButton.setAttribute('aria-busy', 'false');
      subscriptionButton.disabled = !subscriptionRetry.hidden;
    }
  });

  return { loadStars, loadSubscription };
}
