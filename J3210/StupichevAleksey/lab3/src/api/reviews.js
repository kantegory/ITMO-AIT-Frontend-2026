import instance from '@/api/instance'

class ReviewsApi {
  getByCourse = async (courseId) => {
    return instance.get('/reviews', {params: {courseId}})
  }
}

export default new ReviewsApi()
