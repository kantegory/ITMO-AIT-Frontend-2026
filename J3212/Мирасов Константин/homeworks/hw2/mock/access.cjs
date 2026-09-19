const {
  hasQuery,
  isNumericId,
  isNonEmptyText,
  isTimestamp,
  hasOnlyFields,
  isPositiveId,
  isEmail,
  isPassword,
} = require('./validation.cjs');

function handleAccount(request, response, next) {
  const body = request.body;
  const registering = request.path === '/register';
  const keys = registering ? ['email', 'password', 'displayName'] : ['email', 'password'];

  if (
    hasQuery(request) ||
    !body ||
    !hasOnlyFields(body, keys) ||
    !isEmail(body.email) ||
    !isPassword(body.password) ||
    (registering && !isNonEmptyText(body.displayName, 60))
  ) {
    return response.status(400).json({ message: 'Invalid account details.' });
  }

  body.email = body.email.trim().toLowerCase();

  if (registering) {
    body.displayName = body.displayName.trim();
  }

  if (registering && request.app.db.get('users').find({ email: body.email }).value()) {
    return response.status(409).json({ message: 'Email is already registered.' });
  }

  return next();
}

function handleCommentChange(request, response, next, commentPath) {
  if (!isPositiveId(commentPath[1]) || hasQuery(request)) {
    return response.status(400).json({ message: 'Invalid comment request.' });
  }

  if (
    !request.app.db
      .get('discussions')
      .find({ id: Number(commentPath[1]) })
      .value()
  ) {
    return response.status(404).json({ message: 'Comment not found.' });
  }

  if (request.method === 'PATCH') {
    const body = request.body;

    if (
      !body ||
      !hasOnlyFields(body, ['body', 'updatedAt']) ||
      !isNonEmptyText(body.body, 1000) ||
      !isTimestamp(body.updatedAt)
    ) {
      return response.status(400).json({ message: 'Invalid comment update.' });
    }

    body.body = body.body.trim();
  }

  return next();
}

function handleDiscussions(request, response, next) {
  const query = [...new URL(request.originalUrl, 'http://127.0.0.1').searchParams];

  if (request.method === 'GET') {
    const keys = new Map(query);

    if (
      query.length !== 3 ||
      keys.size !== 3 ||
      !isPositiveId(keys.get('resourceId')) ||
      keys.get('_sort') !== 'createdAt' ||
      keys.get('_order') !== 'asc'
    ) {
      return response.status(400).json({ message: 'Invalid discussion query.' });
    }

    return next();
  }

  if (request.method === 'POST') {
    const body = request.body;
    const fields = ['userId', 'resourceId', 'authorName', 'body', 'createdAt', 'updatedAt'];

    if (
      query.length ||
      !body ||
      !hasOnlyFields(body, fields) ||
      !['userId', 'resourceId'].every((key) => isNumericId(body[key])) ||
      !isNonEmptyText(body.authorName, 60) ||
      !isNonEmptyText(body.body, 1000) ||
      !['createdAt', 'updatedAt'].every((key) => isTimestamp(body[key]))
    ) {
      return response.status(400).json({ message: 'Invalid comment details.' });
    }

    if (!request.app.db.get('resources').find({ id: body.resourceId }).value()) {
      return response.status(404).json({ message: 'Resource not found.' });
    }

    body.body = body.body.trim();
    body.authorName = body.authorName.trim();

    return next();
  }

  return response.status(403).json({ message: 'Endpoint is not available.' });
}

function handleRelation(request, response, next, relationPath) {
  const query = [...new URL(request.originalUrl, 'http://127.0.0.1').searchParams];
  const db = request.app.db;

  if (request.method === 'GET' && !relationPath[2]) {
    const filters = relationPath[1] === 'subscriptions' ? ['resourceId', 'userId'] : ['resourceId'];

    if (query.length !== 1 || !filters.includes(query[0][0]) || !isPositiveId(query[0][1])) {
      return response.status(400).json({ message: 'A valid relation filter is required.' });
    }

    return next();
  }

  if (query.length) {
    return response.status(400).json({ message: 'Unsupported query parameters.' });
  }

  if (request.method === 'POST' && !relationPath[2]) {
    const body = request.body;

    if (
      !body ||
      !hasOnlyFields(body, ['userId', 'resourceId', 'createdAt']) ||
      !isNumericId(body.userId) ||
      !isNumericId(body.resourceId) ||
      !isTimestamp(body.createdAt)
    ) {
      return response.status(400).json({ message: 'Invalid relation details.' });
    }

    if (!db.get('resources').find({ id: body.resourceId }).value()) {
      return response.status(404).json({ message: 'Resource not found.' });
    }

    return next();
  }

  if (request.method === 'DELETE' && isPositiveId(relationPath[2])) {
    if (
      !db
        .get(relationPath[1])
        .find({ id: Number(relationPath[2]) })
        .value()
    ) {
      return response.status(404).json({ message: 'Relation not found.' });
    }

    return next();
  }

  return response.status(403).json({ message: 'Endpoint is not available.' });
}

function handleFork(request, response, next) {
  const body = request.body;
  const copied = [
    'type',
    'summary',
    'description',
    'task',
    'framework',
    'license',
    'sizeBytes',
    'tags',
    'metrics',
    'usageExample',
    'demoFile',
    'revision',
    'reproducibility',
  ];
  const allowed = [...copied, 'name', 'userId', 'authorName', 'sourceResourceId', 'downloadCount'];

  if (
    hasQuery(request) ||
    !body ||
    !hasOnlyFields(body, allowed) ||
    !isNumericId(body.userId) ||
    !isNumericId(body.sourceResourceId) ||
    !isNonEmptyText(body.authorName, 60) ||
    body.downloadCount !== 0
  ) {
    return response.status(400).json({ message: 'Invalid fork details.' });
  }

  const source = request.app.db.get('resources').find({ id: body.sourceResourceId }).value();

  if (!source) {
    return response.status(404).json({ message: 'Source resource not found.' });
  }

  if (
    body.name !== `${source.name.slice(0, 73)} (fork)` ||
    !copied.every((key) => JSON.stringify(body[key]) === JSON.stringify(source[key]))
  ) {
    return response.status(400).json({ message: 'Fork metadata must match the source.' });
  }

  body.authorName = body.authorName.trim();

  return next();
}

module.exports = function access(request, response, next) {
  if (request.method === 'POST' && ['/login', '/register'].includes(request.path)) {
    return handleAccount(request, response, next);
  }

  const commentPath = /^\/discussions\/([1-9]\d*)$/.exec(request.path);

  if (commentPath && ['PATCH', 'DELETE'].includes(request.method)) {
    return handleCommentChange(request, response, next, commentPath);
  }

  if (request.path === '/discussions') {
    return handleDiscussions(request, response, next);
  }

  const relationPath = /^\/(stars|subscriptions)(?:\/([1-9]\d*))?$/.exec(request.path);

  if (relationPath) {
    return handleRelation(request, response, next, relationPath);
  }

  const resourcePath = /^\/resources(?:\/([1-9]\d*))?$/.exec(request.path);

  if (request.path === '/resources' && request.method === 'POST') {
    return handleFork(request, response, next);
  }

  if (
    request.method !== 'GET' ||
    !resourcePath ||
    (resourcePath[1] && !isPositiveId(resourcePath[1]))
  ) {
    return response.status(403).json({ message: 'Endpoint is not available.' });
  }

  const allowedKeys = resourcePath[1] ? [] : ['userId', 'sourceResourceId'];

  const query = [...new URL(request.originalUrl, 'http://127.0.0.1').searchParams];
  const validQuery =
    new Set(query.map(([key]) => key)).size === query.length &&
    query.every(([key, value]) => allowedKeys.includes(key) && isPositiveId(value));

  if (!validQuery) {
    return response.status(400).json({ message: 'Unsupported query parameters.' });
  }

  next();
};
