
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

export interface MetaGym extends BaseEntity {
  auth_user_id: string // Referencia a auth.users.id
  name: string
  email: string
  phone?: string
}


export interface GymProfile extends BaseEntity {
  tenant_id: string // Referencia a tenant.id
  nombre: string
  direccion?: string
  telefono?: string
  email?: string
  logo_url?: string
  slug: string
  timezone?: string
  currency?: string
}

export interface Tenant extends BaseEntity {
  meta_gym_id: string 
  plan_id: string 
  start_date: string
  end_date?: string
  status: string
}

export interface MetaGymPlan extends BaseEntity {
  name: string
  price: number
  max_clients?: number
  description?: string
  features?: string
  is_active: boolean
}

export interface CreateMetaGymInput {
  auth_user_id: string
  name: string
  email: string
  phone?: string
}

export interface CreateGymProfileInput {
  tenant_id: string
  nombre: string
  direccion?: string
  telefono?: string
  email?: string
  logo_url?: string
  slug: string
  timezone?: string
  currency?: string
}

export interface CreateTenantInput {
  meta_gym_id: string
  plan_id: string
  start_date: string
  end_date?: string
  status: string
}

export interface CreateMetaGymPlanInput {
  name: string
  price: number
  max_clients?: number
  description?: string
  features?: string
  is_active?: boolean
}

export type UpdateMetaGymInput = Partial<Omit<CreateMetaGymInput, 'auth_user_id'>>
export type UpdateGymProfileInput = Partial<Omit<CreateGymProfileInput, 'tenant_id'>>
export type UpdateTenantInput = Partial<Omit<CreateTenantInput, 'meta_gym_id'>>
export type UpdateMetaGymPlanInput = Partial<CreateMetaGymPlanInput>


export interface GymProfileFilters {
  tenant_id?: string
  slug?: string
  search?: string
}

export interface TenantFilters {
  meta_gym_id?: string
  status?: string
  plan_id?: string
}

export interface MetaGymPlanFilters {
  is_active?: boolean
  price_min?: number
  price_max?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}
