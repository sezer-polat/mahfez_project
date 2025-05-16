import { createClient } from '@supabase/supabase-js'

export async function createSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 