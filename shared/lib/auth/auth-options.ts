import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const ADMIN_CREDENTIALS = {
    email: 'admin@asiamotors.ru',
    password: 'admin123',
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                if (
                    credentials.email === ADMIN_CREDENTIALS.email &&
                    credentials.password === ADMIN_CREDENTIALS.password
                ) {
                    return {
                        id: '1',
                        email: ADMIN_CREDENTIALS.email,
                        isAdmin: true,
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.isAdmin = user.isAdmin
            }
            return token
        },
        async session({ session, token }) {
            session.user.isAdmin = !!token.isAdmin
            session.user.id = token.sub || '1'
            session.user.email = token.email || ADMIN_CREDENTIALS.email
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 часа
    },
}
