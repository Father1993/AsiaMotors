import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            isAdmin: boolean
        }
    }

    interface User {
        id: string
        email: string
        isAdmin: boolean
    }

    interface JWT {
        isAdmin: boolean
    }
}
