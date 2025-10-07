// lib/supabase-config.ts
import type { SupabaseEnvironment } from '@/shared/types/enviroment';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  environment: SupabaseEnvironment;
}

const SUPABASE_CONFIGS: Record<SupabaseEnvironment, Omit<SupabaseConfig, 'environment'>> = {
  local: {
    url: process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY!,
  },
  cloud: {
    url: process.env.NEXT_PUBLIC_SUPABASE_CLOUD_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_CLOUD_ANON_KEY!,
  },

};

export function getSupabaseConfig(): SupabaseConfig {
  const environment = process.env.NEXT_PUBLIC_SUPABASE_ENV as SupabaseEnvironment;
  
  const config = SUPABASE_CONFIGS[environment];
  
  if (!config) {
    throw new Error(`Invalid environment: ${environment}. Must be 'local', 'cloud', or 'production'`);
  }

  if (!config.url || !config.anonKey) {
    throw new Error(`Missing Supabase configuration for environment: ${environment}`);
  }


  if (process.env.NODE_ENV === 'development') {
    console.log(`🔗 Using ${environment} Supabase instance`);
  }

  return {
    ...config,
    environment,
  };
}

// Función helper para obtener solo URL y key
export function getSupabaseCredentials() {
  const config = getSupabaseConfig();
  return {
    url: config.url,
    anonKey: config.anonKey,
  };
}