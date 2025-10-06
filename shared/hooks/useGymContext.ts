'use client'

import { useParams } from 'next/navigation'

export const useTenantContext = () => {
  const params = useParams()
  const tenantId = params.tenantId as string
  
  if (!tenantId) {
    throw new Error('tenantId is required - make sure this hook is used within a tenant route')
  }
  
  return { tenantId }
}

export const useGymContext = useTenantContext