import { createClient } from '@supabase/supabase-js'

export async function createSupabaseClient() {
  return createClient(
    process.env.DATABASE_SUPABASE_URL!,
    process.env.DATABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 