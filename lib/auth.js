import { cookies } from 'next/headers'
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'
import db from './db'

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'sessions'
})

const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV
        }
    }
})

export async function createAuthSession(userId) {
    const session =  await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )
}

export async function verifyAuth() {
    const sessionCookie = cookies().get(lucia.sessionCookieName)
    const sessionId = sessionCookie?.value

    if (!sessionId) {
        return {
            user: null,
            session: null
        }
    }

    const result = await lucia.validateSession(sessionId)
    /*
     * Next js will throw an error if we set a cookie
     * if we do it as a part of page rendering process
     */
    try {
        /* 
        * If there is a valid cookie, refresh it
        * to avoid from throwing the user out if
        * in the middle the cookie expires!
        */
        if (result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id)
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }

        /*
         * if a session cookie was not found, we try to clear
         * the session cookie that was sent along because it is not
         * a cookie for a valid session. Therefore we should again create
         * new session cookie data -> this is a way to clear.
         */
        if (!result.session) {
            const sessionCookie = lucia. createBlankSessionCookie()
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }
    } catch {
        /*
         * Do nothing because we want to be able to set
         * the authentication session cookie even if we 
         * are just rendering a page.
         */
    }


    return result
}

export async function destroySession() {
    const { session } = await verifyAuth()

    if (!session) {
        return {
            error: 'Unauthorized'
        }
    }

    await lucia.invalidateSession(session.id)
    const sessionCookie = lucia. createBlankSessionCookie()
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )
}