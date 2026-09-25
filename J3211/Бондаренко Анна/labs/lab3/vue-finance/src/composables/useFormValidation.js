export function useFormValidation() {
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validatePassword = (pass) => {
        return pass.length >= 8
    }

    return { validateEmail, validatePassword }
}