import { getSupabaseCredentials } from '@/shared/lib/supabase-config';
import { SupabaseEnvironment } from '@/shared/types/enviroment'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'


export async function createClient() {
  const cookieStore = await cookies()

   const { url, anonKey } = getSupabaseCredentials();
  
  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
}