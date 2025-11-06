import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/client';
import {
  SubscriptionPayment,
  CreatePaymentInput,
  PaymentValidationResult,
} from '@/shared/types';

const PAYMENTS_COLLECTION = 'subscription_payments';
const TENANTS_COLLECTION = 'tenants';


export function validatePaymentInput(input: CreatePaymentInput): PaymentValidationResult {
  const errors: string[] = [];


  if (!input.tenantId || input.tenantId.trim() === '') {
    errors.push('Tenant ID is required');
  }

  if (!input.subscriptionId || input.subscriptionId.trim() === '') {
    errors.push('Subscription ID is required');
  }


  if (input.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (isNaN(input.amount)) {
    errors.push('Amount must be a valid number');
  }

  if (!(input.periodStart instanceof Date) || isNaN(input.periodStart.getTime())) {
    errors.push('Period start date is invalid');
  }

  if (!(input.periodEnd instanceof Date) || isNaN(input.periodEnd.getTime())) {
    errors.push('Period end date is invalid');
  }

  if (input.periodStart >= input.periodEnd) {
    errors.push('Period end date must be after period start date');
  }


  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  if (input.periodStart > oneYearFromNow) {
    errors.push('Period start date cannot be more than 1 year in the future');
  }


  const periodDays = (input.periodEnd.getTime() - input.periodStart.getTime()) / (1000 * 60 * 60 * 24);
  if (periodDays > 365) {
    errors.push('Payment period cannot exceed 365 days');
  }


  if (input.notes && input.notes.length > 500) {
    errors.push('Notes cannot exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


async function validateTenantExists(tenantId: string): Promise<boolean> {
  try {
    const tenantRef = doc(db, TENANTS_COLLECTION, tenantId);
    const tenantSnap = await getDoc(tenantRef);
    return tenantSnap.exists();
  } catch (error) {
    console.error('Error validating tenant:', error);
    return false;
  }
}


export async function createPaymentRecord(input: CreatePaymentInput): Promise<string> {
  const validation = validatePaymentInput(input);
  if (!validation.isValid) {
    throw new Error(`Payment validation failed: ${validation.errors.join(', ')}`);
  }

  const tenantExists = await validateTenantExists(input.tenantId);
  if (!tenantExists) {
    throw new Error(`Tenant ${input.tenantId} not found`);
  }

  const now = new Date();

  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const paymentDoc = await addDoc(paymentsRef, {
      tenantId: input.tenantId,
      subscriptionId: input.subscriptionId,
      amount: input.amount,
      hasPaid: true,
      periodStart: Timestamp.fromDate(input.periodStart),
      periodEnd: Timestamp.fromDate(input.periodEnd),
      paidAt: Timestamp.fromDate(now),
      status: 'active',
      notes: input.notes || null,
      createdAt: serverTimestamp(),
    });

    console.log('✅ Payment record created:', paymentDoc.id);

    return paymentDoc.id;
  } catch (error) {
    console.error('Error creating payment record:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to create payment: ${error.message}`
        : 'Unknown error creating payment'
    );
  }
}


export async function getPaymentsByTenant(tenantId: string): Promise<SubscriptionPayment[]> {
  try {

  
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(
      paymentsRef,
      where('tenantId', '==', tenantId)
    );

    const snapshot = await getDocs(q);
    const payments = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        tenantId: data.tenantId,
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        hasPaid: data.hasPaid,
        periodStart: data.periodStart?.toDate(),
        periodEnd: data.periodEnd?.toDate(),
        paidAt: data.paidAt?.toDate() || null,
        status: data.status,
        notes: data.notes,
        createdAt: data.createdAt?.toDate(),
      } as SubscriptionPayment;
    });

    payments.sort((a, b) => {
      const dateA = a.paidAt || a.createdAt || new Date(0);
      const dateB = b.paidAt || b.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });


    return payments;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}


export async function getAllPayments(): Promise<SubscriptionPayment[]> {
  try {
    const paymentsRef = collection(db, PAYMENTS_COLLECTION);
    const q = query(paymentsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      const periodEnd = data.periodEnd?.toDate();
      const hasPaid = data.hasPaid;
      const now = new Date();
      let status: 'active' | 'overdue' = 'active';
      if (!hasPaid && now > periodEnd) {
        status = 'overdue';
      }

      return {
        id: doc.id,
        tenantId: data.tenantId,
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        hasPaid,
        periodStart: data.periodStart?.toDate(),
        periodEnd,
        paidAt: data.paidAt?.toDate() || null,
        status,
        notes: data.notes,
        createdAt: data.createdAt?.toDate(),
      } as SubscriptionPayment;
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    return [];
  }
}
