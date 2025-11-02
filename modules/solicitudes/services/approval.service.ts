import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase/client';
import {
  createTenant,
  createSubscription,
  createGym,
  createAdminUser,
  generateTenantId,
  generateGymCode,
} from '@/modules/solicitudes/queries/approval.queries';
import { GymRequest, UserRole } from '@/shared/types';

/**
 * Input para aprobar una solicitud de gimnasio
 */
export interface ApproveGymRequestInput {
  requestId: string;
  request: GymRequest;
  adminEmail: string;
  adminPassword: string;
  reviewedBy: string; // UID del admin que aprueba
}

/**
 * Resultado del proceso de aprobación
 */
export interface ApproveGymRequestResult {
  success: boolean;
  tenantId: string;
  gymId: string;
  userId: string;
  message: string;
}

/**
 * Calcular la fecha de fin de suscripción (30 días desde hoy)
 */
function calculateSubscriptionEndDate(): Date {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  return endDate;
}

/**
 * Mapear el plan de la solicitud al plan del tenant
 * GymRequest usa: basic_plan, professional_plan, enterprise_plan
 * Tenant usa: basic_plan, standard_plan, premium_plan, enterprise_plan
 */
function mapRequestPlanToTenantPlan(
  requestPlan: 'basic_plan' | 'professional_plan' | 'enterprise_plan'
): 'basic_plan' | 'standard_plan' | 'premium_plan' | 'enterprise_plan' {
  const planMap: Record<string, 'basic_plan' | 'standard_plan' | 'premium_plan' | 'enterprise_plan'> = {
    basic_plan: 'basic_plan',
    professional_plan: 'premium_plan', // Mapear professional a premium
    enterprise_plan: 'enterprise_plan',
  };
  return planMap[requestPlan] || 'basic_plan';
}

/**
 * Obtener el precio del plan
 */
function getPlanPrice(planId: string): number {
  const prices: Record<string, number> = {
    basic_plan: 29.99,
    professional_plan: 59.99,
    enterprise_plan: 99.99,
  };
  return prices[planId] || 0;
}

/**
 * Servicio principal para aprobar una solicitud de gimnasio
 * 
 * Proceso:
 * 1. Crear usuario en Firebase Auth
 * 2. Crear documento en users con rol de admin
 * 3. Crear tenant
 * 4. Crear subscription
 * 5. Crear gym
 * 6. Actualizar la solicitud con estado approved
 */
export async function approveGymRequestService(
  input: ApproveGymRequestInput
): Promise<ApproveGymRequestResult> {
  const { requestId, request, adminEmail, adminPassword, reviewedBy } = input;

  try {
    // PASO 1: Crear usuario en Firebase Auth
    console.log('🔐 Creando usuario en Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    const userId = userCredential.user.uid;
    console.log('✅ Usuario Auth creado:', userId);

    // PASO 2: Crear tenant
    console.log('🏢 Creando tenant...');
    const tenantId = generateTenantId();
    const subscriptionEndDate = calculateSubscriptionEndDate();
    
    await createTenant({
      id: tenantId,
      companyName: request.company_name,
      companyEmail: request.email,
      companyPhone: request.admin_phone,
      ownerId: userId,
      currentPlanId: mapRequestPlanToTenantPlan(request.requested_plan),
      subscriptionEndDate,
      is_active: true,
    });
    console.log('✅ Tenant creado:', tenantId);

    // PASO 3: Crear subscription
    console.log('💳 Creando suscripción...');
    const now = new Date();
    const subscriptionId = await createSubscription({
      tenantId,
      planId: request.requested_plan,
      status: 'active',
      startDate: now,
      endDate: subscriptionEndDate,
      paymentDate: now,
      paymentAmount: getPlanPrice(request.requested_plan),
      autoRenew: true,
    });
    console.log('✅ Suscripción creada:', subscriptionId);

    // PASO 4: Crear gym
    console.log('🏋️ Creando gimnasio...');
    const gymCode = generateGymCode();
    const gymId = await createGym({
      tenantId,
      ownerId: userId,
      code: gymCode,
      name: request.gym_name,
      email: adminEmail,
      phone: request.gym_phone,
      address: request.gym_address,
      city: 'N/A', // No está en la solicitud
      country: 'N/A', // No está en la solicitud
      is_active: true,
    });
    console.log('✅ Gimnasio creado:', gymId);

    // PASO 5: Crear usuario en colección users con rol admin
    console.log('👤 Creando usuario admin...');
    const adminRoles: UserRole[] = [
      { id: 'own', name: 'Administrador' }
    ];

    await createAdminUser({
      user_id: userId,
      email: adminEmail,
      name: request.admin_name,
      surname1: request.admin_surname1,
      surname2: request.admin_surname2,
      phone: request.admin_phone,
      dateOfBirth: '',
      roles: adminRoles,
      gymId: gymId,
      tenantId: tenantId,
    });
    console.log('✅ Usuario admin creado en users collection');

    // PASO 6: Actualizar la solicitud a "approved"
    console.log('📝 Actualizando solicitud...');
    const requestRef = doc(db, 'register_requests', requestId);
    await updateDoc(requestRef, {
      state: 'approved',
      reviewedBy,
      reviewedAt: serverTimestamp(),
      generatedToken: tenantId, // Usar tenantId como token
    });
    console.log('✅ Solicitud actualizada a approved');

    return {
      success: true,
      tenantId,
      gymId,
      userId,
      message: `Solicitud aprobada exitosamente. Tenant: ${tenantId}, Gym: ${gymCode}`,
    };
  } catch (error) {
    console.error('❌ Error al aprobar solicitud:', error);
    throw new Error(
      error instanceof Error
        ? `Error al aprobar solicitud: ${error.message}`
        : 'Error desconocido al aprobar solicitud'
    );
  }
}
