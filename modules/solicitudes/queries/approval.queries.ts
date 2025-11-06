import {
  collection,
  doc,
  setDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/client';
import {
  CreateTenantInput,
  CreateSubscriptionInput,
  CreateGymInput,
  CreateAdminUserInput,
} from '@/shared/types';

/**
 * Create a new tenant 
 */
export async function createTenant(input: CreateTenantInput): Promise<void> {
  const tenantRef = doc(db, 'tenants', input.id);
  
  await setDoc(tenantRef, {
    id: input.id,
    companyName: input.companyName,
    companyEmail: input.companyEmail,
    companyPhone: input.companyPhone,
    ownerId: input.ownerId,
    currentPlanId: input.currentPlanId,
    subscriptionEndDate: Timestamp.fromDate(input.subscriptionEndDate),
    is_active: input.is_active,
    createdAt: serverTimestamp(),
  });
}

/**
 * Create a new subscription 
 */
export async function createSubscription(input: CreateSubscriptionInput): Promise<string> {
  const subscriptionsRef = collection(db, 'tenant_subscriptions');
  const newSubscriptionRef = doc(subscriptionsRef);
  
  await setDoc(newSubscriptionRef, {
    id: newSubscriptionRef.id,
    tenantId: input.tenantId,
    planId: input.planId,
    status: input.status,
    startDate: Timestamp.fromDate(input.startDate),
    endDate: Timestamp.fromDate(input.endDate),
    paymentDate: Timestamp.fromDate(input.paymentDate),
    paymentAmount: input.paymentAmount,
    autoRenew: input.autoRenew,
    cancelledAt: null,
    createdAt: serverTimestamp(),
  });
  
  return newSubscriptionRef.id;
}

/**
 * Create a new gym 
 */
export async function createGym(input: CreateGymInput): Promise<string> {
  const gymsRef = collection(db, 'gyms');
  const newGymRef = doc(gymsRef);
  
  await setDoc(newGymRef, {
    id: newGymRef.id,
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    code: input.code,
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    country: input.country,
    is_active: input.is_active,
    createdAt: serverTimestamp(),
  });
  
  return newGymRef.id;
}

/**
 * Create an administrator user 
 */
export async function createAdminUser(input: CreateAdminUserInput): Promise<void> {
  const userRef = doc(db, 'users', input.user_id);
  
  await setDoc(userRef, {
    user_id: input.user_id,
    email: input.email,
    name: input.name,
    surname1: input.surname1,
    surname2: input.surname2,
    phone: input.phone,
    dateOfBirth: input.dateOfBirth || '',
    roles: input.roles,
    gymId: input.gymId,
    tenantId: input.tenantId,
    height: 0,
    weight: 0,
    membershipId: null,
    profilePictureUrl: null,
    pin: null,
    createdAt: serverTimestamp(),
  });
}

/**
 * Generate a unique ID for tenant
 */
export function generateTenantId(): string {
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `tenant_${randomStr}`;
}

/**
 * Generate a unique code for gym
 */
export function generateGymCode(): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GYM${randomStr}`;
}
