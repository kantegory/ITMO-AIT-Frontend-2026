class AuthApi {
    constructor(instance) {
        this.API = instance
    }

    login = async (data) => {
        return (
            await this.API({
                method: 'POST',
                url: '/login',
                data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).data
    }

    signup = async (data) => {
        return (
            await this.API({
                method: 'POST',
                url: '/signup',
                data,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).data
    }
}

export default AuthApi
