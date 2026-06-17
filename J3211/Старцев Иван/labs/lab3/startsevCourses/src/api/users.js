class UsersApi {
    constructor(instance) {
        this.API = instance
    }

    getAll = async () => {
        return (
            await this.API({
                url: '/users',
            })
        ).data
    }

    getById = async (id) => {
        return (
            await this.API({
                url: `/users/${id}`,
            })
        ).data
    }

    update = async (id, data) => {
        return (
            await this.API({
                method: 'PATCH',
                url: `/users/${id}`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).data
    }
}

export default UsersApi
