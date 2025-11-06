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
import { sendCredentialsEmail } from './email.service';

/**
 * Input for approving a gym request
 */
export interface ApproveGymRequestInput {
  requestId: string;
  request: GymRequest;
  adminEmail: string;
  adminPassword: string;
  reviewedBy: string; // UID of approving admin
}

/**
 * Result of the approval process
 */
export interface ApproveGymRequestResult {
  success: boolean;
  tenantId: string;
  gymId: string;
  userId: string;
  message: string;
}

/**
 * Calculate subscription end date (30 days from today)
 */
function calculateSubscriptionEndDate(): Date {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  return endDate;
}

/**
 * Map request plan to tenant plan
 */
function mapRequestPlanToTenantPlan(
  requestPlan: 'basic_plan' | 'professional_plan' | 'enterprise_plan'
): 'basic_plan' | 'standard_plan' | 'premium_plan' | 'enterprise_plan' {
  const planMap: Record<string, 'basic_plan' | 'standard_plan' | 'premium_plan' | 'enterprise_plan'> = {
    basic_plan: 'basic_plan',
    professional_plan: 'premium_plan', 
    enterprise_plan: 'enterprise_plan',
  };
  return planMap[requestPlan] || 'basic_plan';
}

/**
 * Get plan price
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
 * Main service for approving a gym request
 * 
 * Process:
 * 1. Create user in Firebase Auth
 * 2. Create document in users with admin role
 * 3. Create tenant
 * 4. Create subscription
 * 5. Create gym
 * 6. Update request with approved status
 */
export async function approveGymRequestService(
  input: ApproveGymRequestInput
): Promise<ApproveGymRequestResult> {
  const { requestId, request, adminEmail, adminPassword, reviewedBy } = input;

  try {
    // STEP 1: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    const userId = userCredential.user.uid;

    // STEP 2: Create tenant
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

    // STEP 3: Create subscription
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

    // STEP 4: Create gym
    const gymCode = generateGymCode();
    const gymId = await createGym({
      tenantId,
      ownerId: userId,
      code: gymCode,
      name: request.gym_name,
      email: adminEmail,
      phone: request.gym_phone,
      address: request.gym_address,
      city: 'N/A', 
      country: 'N/A', 
      is_active: true,
    });

    // STEP 5: Create user in users collection with admin role
    const adminRoles: UserRole[] = [
      { id: 'own', name: 'Administrator' }
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

    // STEP 6: Update request to "approved"
    const requestRef = doc(db, 'register_requests', requestId);
    await updateDoc(requestRef, {
      state: 'approved',
      reviewedBy,
      reviewedAt: serverTimestamp(),
      generatedToken: tenantId, 
    });

    // STEP 7: Send email with credentials
    await sendCredentialsEmail({
      toEmail: request.email,
      toName: `${request.admin_name} ${request.admin_surname1}`,
      gymName: request.gym_name,
      email: adminEmail,
      password: adminPassword,
      tenantId,
      gymCode,
    });

    return {
      success: true,
      tenantId,
      gymId,
      userId,
      message: `Request approved successfully. Tenant: ${tenantId}, Gym: ${gymCode}`,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Error approving request: ${error.message}`
        : 'Unknown error approving request'
    );
  }
}
