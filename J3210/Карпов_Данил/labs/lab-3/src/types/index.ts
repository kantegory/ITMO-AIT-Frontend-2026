export interface User {
  id: number
  email: string
  name: string
  role: 'student' | 'teacher'
  avatar?: string
  enrolledCourses: number[]
  progress: Record<string, number>
}

export interface Course {
  id: number
  title: string
  description: string
  category: 'programming' | 'design' | 'data'
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  priceType: 'free' | 'paid'
  rating: number
  reviewsCount: number
  image: string
  badge?: string
  badgeColor?: string
  teacherId: number
  teacherName: string
  duration: string
  lessonsCount: number
  studentsCount: number
}

export interface Enrollment {
  id: number
  userId: number
  courseId: number
  progress: number
  enrolledAt: string
  completedAt?: string
}

export interface EnrollmentWithCourse extends Enrollment {
  course?: Course
}

export interface Certificate {
  id: number
  userId: number
  courseId: number
  courseTitle: string
  issuedAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: 'student' | 'teacher'
}

export interface AuthResponse {
  token: string
  user: User
}
