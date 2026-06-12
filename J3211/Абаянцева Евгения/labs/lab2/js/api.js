const API_BASE_URL = 'http://localhost:3000';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

const authAPI = {
    async register(userData) {
        const users = await apiRequest('/users');
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }
        
        const newUser = {
            ...userData,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=dc2626&color=fff&size=100`
        };
        
        return await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        });
    },

    async login(email, password) {
        const users = await apiRequest('/users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    async getUserById(id) {
        return await apiRequest(`/users/${id}`);
    },

    async updateUser(id, userData) {
        return await apiRequest(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(userData)
        });
    }
};

const coursesAPI = {
    async getAllCourses() {
        return await apiRequest('/courses');
    },

    async getCourseById(id) {
        return await apiRequest(`/courses/${id}`);
    },

    async searchCourses(query) {
        return await apiRequest(`/courses?q=${encodeURIComponent(query)}`);
    },

    async filterCourses(filters) {
        let queryString = '';
        
        if (filters.subject) {
            queryString += `&subject=${filters.subject}`;
        }
        if (filters.level) {
            queryString += `&level=${filters.level}`;
        }
        if (filters.maxPrice) {
            queryString += `&price_lte=${filters.maxPrice}`;
        }
        
        return await apiRequest(`/courses?${queryString}`);
    },

    async createCourse(courseData) {
        return await apiRequest('/courses', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    },

    async updateCourse(id, courseData) {
        return await apiRequest(`/courses/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(courseData)
        });
    },

    async deleteCourse(id) {
        return await apiRequest(`/courses/${id}`, {
            method: 'DELETE'
        });
    }
};

const enrollmentsAPI = {
    async enroll(userId, courseId) {
        const enrollment = {
            userId,
            courseId,
            progress: 0,
            status: 'in-progress',
            enrolledAt: new Date().toISOString(),
            lastLesson: 0
        };
        
        return await apiRequest('/enrollments', {
            method: 'POST',
            body: JSON.stringify(enrollment)
        });
    },

    async getUserEnrollments(userId) {
        const enrollments = await apiRequest(`/enrollments?userId=${userId}`);
        
        const coursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = await coursesAPI.getCourseById(enrollment.courseId);
                return {
                    ...course,
                    progress: enrollment.progress,
                    status: enrollment.status,
                    lastLesson: enrollment.lastLesson,
                    enrolledAt: enrollment.enrolledAt
                };
            })
        );
        
        return coursesWithProgress;
    },

    async updateProgress(enrollmentId, progress, lastLesson) {
        return await apiRequest(`/enrollments/${enrollmentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ progress, lastLesson })
        });
    },

    async completeCourse(enrollmentId) {
        return await apiRequest(`/enrollments/${enrollmentId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                progress: 100,
                status: 'completed',
                completedAt: new Date().toISOString()
            })
        });
    }
};

const certificatesAPI = {
    async getUserCertificates(userId) {
        return await apiRequest(`/certificates?userId=${userId}`);
    },

    async createCertificate(userId, courseId, courseName) {
        const certificate = {
            userId,
            courseId,
            courseName,
            issuedAt: new Date().toISOString(),
            certificateUrl: `certificates/cert-${Date.now()}.pdf`
        };
        
        return await apiRequest('/certificates', {
            method: 'POST',
            body: JSON.stringify(certificate)
        });
    }
};

const favoritesAPI = {
    async addToFavorites(userId, courseId) {
        const favorite = {
            userId,
            courseId,
            addedAt: new Date().toISOString()
        };
        
        return await apiRequest('/favorites', {
            method: 'POST',
            body: JSON.stringify(favorite)
        });
    },

    async removeFromFavorites(userId, courseId) {
        const favorites = await apiRequest(`/favorites?userId=${userId}&courseId=${courseId}`);
        if (favorites.length > 0) {
            return await apiRequest(`/favorites/${favorites[0].id}`, {
                method: 'DELETE'
            });
        }
    },

    async getUserFavorites(userId) {
        const favorites = await apiRequest(`/favorites?userId=${userId}`);
        
        const coursesWithFavorite = await Promise.all(
            favorites.map(async (favorite) => {
                const course = await coursesAPI.getCourseById(favorite.courseId);
                return {
                    ...course,
                    addedAt: favorite.addedAt
                };
            })
        );
        
        return coursesWithFavorite;
    },

    async isFavorite(userId, courseId) {
        const favorites = await apiRequest(`/favorites?userId=${userId}&courseId=${courseId}`);
        return favorites.length > 0;
    }
};

const reviewsAPI = {
    async getCourseReviews(courseId) {
        const reviews = await apiRequest(`/reviews?courseId=${courseId}`);
        return reviews || [];
    },

    async addReview(userId, userName, courseId, rating, comment) {
        const review = {
            userId,
            userName,
            courseId,
            rating,
            comment,
            createdAt: new Date().toISOString(),
            helpful: 0
        };
        
        return await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(review)
        });
    },

    async markHelpful(reviewId) {
        const review = await apiRequest(`/reviews/${reviewId}`);
        return await apiRequest(`/reviews/${reviewId}`, {
            method: 'PATCH',
            body: JSON.stringify({ helpful: (review.helpful || 0) + 1 })
        });
    },

    async deleteReview(reviewId) {
        return await apiRequest(`/reviews/${reviewId}`, {
            method: 'DELETE'
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authAPI,
        coursesAPI,
        enrollmentsAPI,
        certificatesAPI,
        favoritesAPI,
        reviewsAPI
    };
}