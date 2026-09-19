import { getJson, requestJson } from './http.js';

function isComment(row, resourceId) {
  return (
    row &&
    row.resourceId === resourceId &&
    Number.isSafeInteger(row.id) &&
    row.id > 0 &&
    Number.isSafeInteger(row.userId) &&
    row.userId > 0 &&
    typeof row.body === 'string' &&
    typeof row.authorName === 'string' &&
    typeof row.createdAt === 'string' &&
    Number.isFinite(Date.parse(row.createdAt))
  );
}

function isStar(star, resourceId) {
  return (
    star &&
    Number.isSafeInteger(star.id) &&
    star.id > 0 &&
    Number.isSafeInteger(star.userId) &&
    star.userId > 0 &&
    star.resourceId === resourceId
  );
}

function isSubscription(row, key, id) {
  return (
    row &&
    row[key] === id &&
    ['id', 'userId', 'resourceId'].every(
      (field) => Number.isSafeInteger(row[field]) && row[field] > 0,
    )
  );
}

export function editComment(id, body) {
  return requestJson(`/discussions/${id}`, {
    method: 'PATCH',
    authenticated: true,
    body: { body, updatedAt: new Date().toISOString() },
  });
}

export function deleteComment(id) {
  return requestJson(`/discussions/${id}`, { method: 'DELETE', authenticated: true });
}

export async function getComments(resourceId) {
  const rows = await getJson(`/discussions?resourceId=${resourceId}&_sort=createdAt&_order=asc`);

  if (!Array.isArray(rows) || !rows.every((row) => isComment(row, resourceId))) {
    throw new Error('Invalid comments.');
  }

  return rows;
}

export function postComment(resourceId, user, body) {
  const timestamp = new Date().toISOString();

  return requestJson('/discussions', {
    method: 'POST',
    authenticated: true,
    body: {
      resourceId,
      userId: user.id,
      authorName: user.displayName,
      body,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
}

export async function getStars(resourceId) {
  const stars = await getJson(`/stars?resourceId=${resourceId}`);

  if (!Array.isArray(stars) || !stars.every((star) => isStar(star, resourceId))) {
    throw new Error('Invalid star list.');
  }

  return stars;
}

export function addStar(resourceId, userId) {
  return requestJson('/stars', {
    method: 'POST',
    authenticated: true,
    body: { resourceId, userId, createdAt: new Date().toISOString() },
  });
}

export function removeStar(id) {
  return requestJson(`/stars/${id}`, { method: 'DELETE', authenticated: true });
}

export async function getSubscriptions(key, id) {
  if (!['userId', 'resourceId'].includes(key) || !Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Invalid subscription filter.');
  }

  const rows = await getJson(`/subscriptions?${key}=${id}`);

  if (!Array.isArray(rows) || !rows.every((row) => isSubscription(row, key, id))) {
    throw new Error('Invalid subscriptions.');
  }

  return rows;
}

export async function setSubscription(resourceId, userId, subscribed) {
  const rows = await getSubscriptions('userId', userId);
  const own = rows.filter((row) => row.resourceId === resourceId);

  if (subscribed && !own.length) {
    await requestJson('/subscriptions', {
      method: 'POST',
      authenticated: true,
      body: { resourceId, userId, createdAt: new Date().toISOString() },
    });
  } else if (!subscribed) {
    for (const row of own) {
      try {
        await requestJson(`/subscriptions/${row.id}`, { method: 'DELETE', authenticated: true });
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    }
  }
}
