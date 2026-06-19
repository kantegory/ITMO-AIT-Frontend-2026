class TasksApi {
  constructor(i) { this.API = i }
  getAll  = ()    => this.API({ url: '/tasks' })
  create  = (d)   => this.API({ method: 'POST', url: '/tasks', data: d })
}

class CompletedTasksApi {
  constructor(i) { this.API = i }
  getAll  = ()       => this.API({ url: '/completedTasks' })
  create  = (d)      => this.API({ method: 'POST',   url: '/completedTasks', data: d })
  update  = (id, d)  => this.API({ method: 'PATCH',  url: `/completedTasks/${id}`, data: d })
  remove  = (id)     => this.API({ method: 'DELETE', url: `/completedTasks/${id}` })
}

class DiscussionsApi {
  constructor(i) { this.API = i }
  getAll = ()   => this.API({ url: '/discussions' })
  create = (d)  => this.API({ method: 'POST', url: '/discussions', data: d })
}

class UsersApi {
  constructor(i) { this.API = i }
  getAll = () => this.API({ url: '/users' })
}

export { TasksApi, CompletedTasksApi, DiscussionsApi, UsersApi }
