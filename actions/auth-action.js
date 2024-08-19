'use server'

export default async function authAction(currentState, formData) {
    const errors = {}
    const email = formData.get('email')
    const password = formData.get('password')

    const emailSections = email.split('@')
    const EMAIL_PATTERN = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

    if(emailSections[0]?.length < 8 || emailSections[1]?.length < 5 || !EMAIL_PATTERN.test(email)) {
        errors.email = "Invalid email address!"
    }

    if (password?.trim()?.length < 8) {
        errors.password = "Password must be at least 8 characters long."
    }

    return {errors}
}