import NextAuth from 'next-auth'
import { authOptions } from '@/shared/lib/auth/auth-options'
import { allowLogin } from '@/shared/lib/server/login-limit'
import { apiError } from '@/shared/lib/server/http'
const handler=NextAuth(authOptions)
export {handler as GET}
export async function POST(request:Request,context:{params:Promise<{nextauth:string[]}>}){
    try{
        if(new URL(request.url).pathname.endsWith('/callback/credentials') && !await allowLogin(request)){
            return Response.json({error:'Слишком много попыток входа'},{status:429,headers:{'Retry-After':'900'}})
        }
        return handler(request,context)
    }catch(error){return apiError(error)}
}
