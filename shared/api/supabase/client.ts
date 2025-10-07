import { getSupabaseCredentials } from '@/shared/lib/supabase-config';

import { createBrowserClient } from '@supabase/ssr'



const { url, anonKey } = getSupabaseCredentials();

export const supabase = createBrowserClient(
  url,
  anonKey,
)

export const createClient = () => supabase

// Default export
export default supabase