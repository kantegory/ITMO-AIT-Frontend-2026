export function createButton(text) {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'btn btn-outline-primary';
  element.textContent = text;

  return element;
}

export function createCommentEditor(comment, deleting) {
  const panel = document.createElement('div');
  const label = document.createElement('label');
  const input = document.createElement('textarea');
  input.id = `edit-comment-${comment.id}`;
  input.className = 'form-control mb-3';
  input.rows = 3;
  input.maxLength = 1000;
  input.value = comment.body;
  label.htmlFor = input.id;
  label.textContent = 'Edit your comment';

  const message = document.createElement('p');
  message.setAttribute('role', 'status');
  message.id = `edit-status-${comment.id}`;
  input.setAttribute('aria-describedby', message.id);
  input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    message.textContent = '';
  });

  const save = createButton(deleting ? 'Confirm delete' : 'Save changes');
  const cancel = createButton('Cancel');
  const actions = document.createElement('div');
  actions.className = 'd-flex flex-wrap gap-2';
  actions.append(save, cancel);

  if (deleting) {
    message.textContent = 'Delete this comment? This cannot be undone.';
  } else {
    panel.append(label, input);
  }

  panel.append(message, actions);

  return { panel, input, message, save, cancel };
}

export function getEditErrorMessage(status) {
  const messages = {
    404: 'This comment no longer exists. Cancel and reload comments.',
    401: 'Your session expired. Your text is preserved; log in to continue.',
    403: 'You do not have permission to change this comment.',
  };

  return (
    messages[status] ??
    'Could not confirm the change. Your text is preserved. Cancel and reload before retrying.'
  );
}
