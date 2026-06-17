class CoursesApi {
    constructor(instance) {
        this.API = instance
    }

    getAll = async (params) => this.API.get('/courses', {params})
    getById = async (id) => this.API.get(`/courses/${id}`)

    createCourse = async (data) => this.API.post('/courses', data)
    updateCourse = async (id, data) => this.API.patch(`/courses/${id}`, data)
    deleteCourse = async (id) => this.API.delete(`/courses/${id}`)

    getComments = async (courseId, lessonIndex) =>
        this.API.get(`/comments?courseId=${courseId}&lessonIndex=${lessonIndex}`)
    addComment = async (data) => this.API.post('/comments', data)

    getUser = async (id) => this.API.get(`/600/users/${id}`)
    updateUser = async (id, data) => this.API.patch(`/600/users/${id}`, data)

    signup = async (data) => {
        return this.API.post('/signup', data)
    }
}

export default CoursesApi
