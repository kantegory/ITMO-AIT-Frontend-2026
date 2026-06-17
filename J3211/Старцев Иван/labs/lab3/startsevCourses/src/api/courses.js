class CoursesApi {
    constructor(instance) {
        this.API = instance
    }

    getAll = async () => {
        return (
            await this.API({
                url: '/courses',
            })
        ).data
    }

    getById = async (id) => {
        return (
            await this.API({
                url: `/courses/${id}`,
            })
        ).data
    }

    create = async (data) => {
        return (
            await this.API({
                method: 'POST',
                url: '/courses',
                data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).data
    }

    update = async (id, data) => {
        return (
            await this.API({
                method: 'PATCH',
                url: `/courses/${id}`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).data
    }
}

export default CoursesApi
