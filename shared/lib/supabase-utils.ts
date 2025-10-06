import { PostgrestError } from '@supabase/supabase-js'

export function formatSupabaseError(error: PostgrestError | Error | null): string {
  if (!error) return 'Ha ocurrido un error desconocido'
  
  if ('code' in error) {
    switch (error.code) {
      case 'PGRST116':
        return 'No se encontraron registros'
      case '23505':
        return 'Ya existe un registro con esos datos'
      case '23503':
        return 'No se puede eliminar el registro porque está siendo usado'
      case '42501':
        return 'No tienes permisos para realizar esta acción'
      default:
        return error.message || 'Error en la base de datos'
    }
  }
  
  return error.message || 'Ha ocurrido un error'
}

export function validateGymAccess(userGymId: string, requestedGymId: string): boolean {
  return userGymId === requestedGymId
}

export function getPaginationParams(page: number, perPage: number = 10) {
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  
  return { from, to }
}

export function calculateTotalPages(count: number, perPage: number = 10): number {
  return Math.ceil(count / perPage)
}

export function formatDateForSupabase(date: Date): string {
  return date.toISOString()
}


export function parseDateFromSupabase(dateString: string): Date {
  return new Date(dateString)
}

export function handleSupabaseResponse<T>(
  data: T[] | null,
  error: PostgrestError | null,
  options: { emptyMessage?: string } = {}
) {
  if (error) {
    throw new Error(formatSupabaseError(error))
  }
  
  if (!data || data.length === 0) {
    if (options.emptyMessage) {
      throw new Error(options.emptyMessage)
    }
    return []
  }
  
  return data
}

export function handleSupabaseSingleResponse<T>(
  data: T | null,
  error: PostgrestError | null,
  options: { notFoundMessage?: string } = {}
) {
  if (error) {
    throw new Error(formatSupabaseError(error))
  }
  
  if (!data) {
    throw new Error(options.notFoundMessage || 'Registro no encontrado')
  }
  
  return data
}

export function buildSearchQuery(searchTerm: string, fields: string[]): string {
  if (!searchTerm.trim()) return ''
  
  const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return fields.map(field => `${field}.ilike.%${escapedSearch}%`).join(',')
}

export function validateSupabaseConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missing.join(', ')}`
    )
  }
}

export const RLSHelpers = {

  getCurrentUserId: () => "auth.uid()",
  

  metaGymAccessPolicy: () => 
    `CREATE POLICY "meta_gym_user_access" ON meta_gym FOR ALL USING (auth_user_id = auth.uid());`,
  

  tenantAccessPolicy: () =>
    `CREATE POLICY "tenant_access" ON tenant FOR ALL USING (meta_gym_id IN (SELECT id FROM meta_gym WHERE auth_user_id = auth.uid()));`,

  gymProfileAccessPolicy: () =>
    `CREATE POLICY "gym_profiles_access" ON gym_profiles FOR ALL USING (tenant_id IN (SELECT id FROM tenant WHERE meta_gym_id IN (SELECT id FROM meta_gym WHERE auth_user_id = auth.uid())));`,
}