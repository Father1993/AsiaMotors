import { Database } from './database.types'

export type Car = Database['public']['Tables']['cars']['Row']
export type Country = Database['public']['Tables']['countries']['Row']
