import { Database } from '@/shared/types/database.types'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        db: {
            schema: 'public',
        },
        global: {
            headers: {
                'Cache-Control': 'no-store',
            },
        },
    }
)
