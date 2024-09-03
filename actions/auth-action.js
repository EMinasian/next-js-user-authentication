'use server'
import { redirect } from 'next/navigation'
import { createUser } from '../lib/user';
import { hashUserPassword } from '@/lib/hash';
import { createAuthSession } from '@/lib/auth';

export default async function authAction(currentState, formData) {
    const errors = {}
    const email = formData.get('email')
    const password = formData.get('password')

    const emailSections = email.split('@')
    const EMAIL_PATTERN = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

    if(emailSections[0]?.length < 8 || emailSections[1]?.length < 5 || !EMAIL_PATTERN.test(email)) {
        errors.email = "Invalid email address!"
        return {errors}
    }

    if (password?.trim()?.length < 8) {
        errors.password = "Password must be at least 8 characters long."
        return {errors}
    }

    const hasedPassword = hashUserPassword(password)
    try {
        const userId = createUser(email, hasedPassword)
        await createAuthSession(userId)
        redirect('/training')
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            errors.password = "The email is already associated with an account."
            return {errors}
        }
        throw error
    }
}