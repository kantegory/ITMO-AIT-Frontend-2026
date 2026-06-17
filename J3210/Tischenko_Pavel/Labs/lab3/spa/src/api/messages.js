class MessagesApi {
  constructor(instance) {
    this.API = instance
  }

  getByThreadId = async (threadId) => {
    return this.API({
      url: '/messages',
      method: 'GET',
      params: { threadId }
    })
  }
}

export default MessagesApi
