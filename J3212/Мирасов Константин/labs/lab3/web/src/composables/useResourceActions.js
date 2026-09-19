import { computed, reactive, ref, toValue, watch } from 'vue';
import { session } from './useSession.js';
import {
  getStars,
  addStar,
  removeStar,
  getSubscriptions,
  setSubscription,
} from '../services/social.js';

const entries = new Map();
const generation = ref(0);
watch(session, () => {
  entries.clear();
  generation.value++;
});

function getActionMessage(target, kind, userId) {
  if (target.error) {
    return '';
  }

  if (kind === 'star') {
    return target.stars.some((row) => row.userId === userId) ? 'Star added.' : 'Star removed.';
  }

  return target.subscriptions.some((row) => row.userId === userId)
    ? 'Subscribed.'
    : 'Unsubscribed.';
}

async function toggleResourceStar(id, userId) {
  const own = (await getStars(id)).filter((row) => row.userId === userId);

  if (own.length) {
    for (const row of own) {
      try {
        await removeStar(row.id);
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    }
  } else {
    await addStar(id, userId);
  }
}

export function useResourceActions(resourceId) {
  const state = computed(() => {
    const key = `${generation.value}:${toValue(resourceId)}:${session.value?.user.id || 0}`;

    if (!entries.has(key)) {
      entries.set(
        key,
        reactive({
          stars: [],
          subscriptions: [],
          loaded: false,
          loading: false,
          starPending: false,
          subscriptionPending: false,
          error: '',
          message: '',
        }),
      );
    }

    return entries.get(key);
  });
  const starred = computed(() =>
    state.value.stars.some((row) => row.userId === session.value?.user.id),
  );
  const subscribed = computed(() =>
    state.value.subscriptions.some((row) => row.userId === session.value?.user.id),
  );
  const count = computed(() => new Set(state.value.stars.map((row) => row.userId)).size);

  async function refresh(target = state.value, id = toValue(resourceId)) {
    if (target.loading) {
      return;
    }

    target.loading = true;
    target.error = '';

    try {
      const [stars, subscriptions] = await Promise.all([
        getStars(id),
        getSubscriptions('resourceId', id),
      ]);
      target.stars = stars;
      target.subscriptions = subscriptions;
      target.loaded = true;
    } catch (error) {
      target.error = error.message;
      target.loaded = false;
    } finally {
      target.loading = false;
    }
  }

  watch(
    state,
    (target) => {
      if (!target.loaded) {
        refresh(target);
      }
    },
    { immediate: true },
  );

  async function toggle(kind) {
    const target = state.value;
    const user = session.value?.user;
    const id = toValue(resourceId);
    const pending = kind === 'star' ? 'starPending' : 'subscriptionPending';

    if (!user || target[pending] || target.loading || !target.loaded) {
      return;
    }

    target[pending] = true;
    target.error = '';
    target.message = '';

    try {
      if (kind === 'star') {
        await toggleResourceStar(id, user.id);
      } else {
        const own = await getSubscriptions('userId', user.id);
        await setSubscription(id, user.id, !own.some((row) => row.resourceId === id));
      }

      await refresh(target, id);
      target.message = getActionMessage(target, kind, user.id);
    } catch (error) {
      target.error = error.message + ' Reload the actions before trying again.';
      target.loaded = false;
    } finally {
      target[pending] = false;
    }
  }

  return {
    state,
    starred,
    subscribed,
    count,
    refresh: () => refresh(),
    toggleStar: () => toggle('star'),
    toggleSubscription: () => toggle('subscription'),
  };
}
