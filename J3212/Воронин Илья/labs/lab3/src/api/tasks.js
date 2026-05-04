import client from './client';

export function getTasks(projectId) {
  return client.get('/tasks', { params: { projectId } }).then((r) => r.data);
}

export function getTask(taskId) {
  return client.get(`/tasks/${taskId}`).then((r) => r.data);
}

export function addTask(task) {
  return client.post('/tasks', task).then((r) => r.data);
}

export function updateTask(taskId, patch) {
  return client.patch(`/tasks/${taskId}`, patch).then((r) => r.data);
}

export function searchTasks(params) {
  const query = {};
  if (params.status) query.status = params.status;
  if (params.priority) query.priority = params.priority;
  if (params.assigneeId) query.assigneeId = params.assigneeId;
  if (params.projectId) query.projectId = params.projectId;
  if (params.title_like) query.title_like = params.title_like;
  return client.get('/tasks', { params: query }).then((r) => r.data);
}

export function getTaskComments(taskId) {
  return client.get('/taskComments', { params: { taskId } }).then((r) => r.data);
}

export function addTaskComment(taskId, authorName, text) {
  return client
    .post('/taskComments', {
      taskId,
      authorName,
      text,
      createdAt: new Date().toISOString(),
    })
    .then((r) => r.data);
}

export function getTaskFiles(taskId) {
  return client.get('/taskFiles', { params: { taskId } }).then((r) => r.data);
}

export function addTaskFile(taskId, uploadedBy, fileMeta) {
  return client
    .post('/taskFiles', {
      taskId,
      uploadedBy,
      fileName: fileMeta.fileName,
      fileSize: fileMeta.fileSize,
      fileType: fileMeta.fileType || '',
      uploadedAt: new Date().toISOString(),
    })
    .then((r) => r.data);
}
