const sessionKey = 'axonhub-session';

function safeSession(value) {
  const user = value?.user;

  if (
    typeof value?.accessToken !== 'string' ||
    !value.accessToken ||
    !Number.isSafeInteger(user?.id) ||
    user.id <= 0 ||
    typeof user.email !== 'string' ||
    typeof user.displayName !== 'string'
  ) {
    return null;
  }

  return {
    accessToken: value.accessToken,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  };
}

export function getSession() {
  try {
    return safeSession(JSON.parse(sessionStorage.getItem(sessionKey)));
  } catch {
    return null;
  }
}

export function saveSession(value) {
  const session = safeSession(value);

  if (!session) {
    throw new Error('Invalid session response.');
  }

  sessionStorage.setItem(sessionKey, JSON.stringify(session));
  renderSession();
}

export function clearSession() {
  sessionStorage.removeItem(sessionKey);
  renderSession();
}

export function getReturnPath(value) {
  const fallback = 'profile.html';

  if (!value) {
    return fallback;
  }

  let url;

  try {
    url = new URL(value, location.href);
  } catch {
    return fallback;
  }

  const file = url.pathname.split('/').pop();

  if (
    url.origin !== location.origin ||
    url.username ||
    url.password ||
    url.pathname !== new URL(file, location.href).pathname ||
    !['index.html', 'model.html', 'dataset.html', 'profile.html'].includes(file)
  ) {
    return fallback;
  }

  return `${file}${url.search}${url.hash}`;
}

function renderSession() {
  if (typeof document === 'undefined') {
    return;
  }

  const nav = document.querySelector('.axon-account-nav');

  if (!nav) {
    return;
  }

  if (!nav.dataset.guestHtml) {
    nav.dataset.guestHtml = nav.innerHTML;
  }

  if (!getSession()) {
    nav.innerHTML = nav.dataset.guestHtml;

    return;
  }

  const label = document.createElement('span');

  label.className = 'small me-2';
  label.textContent = 'Signed in';

  const logout = document.createElement('button');

  logout.type = 'button';
  logout.className = 'btn btn-outline-primary';
  logout.textContent = 'Log out';
  logout.addEventListener('click', () => {
    clearSession();
    location.assign('login.html');
  });
  nav.replaceChildren(label, logout);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', renderSession);
  renderSession();
}
