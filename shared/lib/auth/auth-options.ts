import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Проверяем наличие необходимых переменных окружения
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Missing environment variables for authentication')
}

// Сохраняем переменные в константы с явной типизацией
const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD

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
                    credentials.email === ADMIN_EMAIL &&
                    credentials.password === ADMIN_PASSWORD
                ) {
                    return {
                        id: '1',
                        email: ADMIN_EMAIL,
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
            session.user.email = token.email || ADMIN_EMAIL
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
