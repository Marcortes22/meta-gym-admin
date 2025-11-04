/**
 * Firebase queries for tenant operations
 */

import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/client";
import type { Tenant, UpdateTenantInput } from "@/shared/types/tenant.types";
import { createPaymentRecord } from "./payments.queries";

/**
 * Fetch all tenants from Firestore
 */
export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const tenantsRef = collection(db, "tenants");
    const q = query(tenantsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const tenants: Tenant[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyPhone: data.companyPhone,
        ownerId: data.ownerId,
        currentPlanId: data.currentPlanId,
        subscriptionEndDate:
          data.subscriptionEndDate instanceof Timestamp
            ? data.subscriptionEndDate.toDate()
            : new Date(data.subscriptionEndDate),
        is_active: data.is_active,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
      };
    });

    return tenants;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    throw new Error("Failed to fetch tenants");
  }
}

/**
 * Fetch active tenants
 */
export async function fetchActiveTenants(): Promise<Tenant[]> {
  try {
    const tenantsRef = collection(db, "tenants");
    const q = query(
      tenantsRef,
      where("is_active", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const tenants: Tenant[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyPhone: data.companyPhone,
        ownerId: data.ownerId,
        currentPlanId: data.currentPlanId,
        subscriptionEndDate:
          data.subscriptionEndDate instanceof Timestamp
            ? data.subscriptionEndDate.toDate()
            : new Date(data.subscriptionEndDate),
        is_active: data.is_active,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
      };
    });

    return tenants;
  } catch (error) {
    console.error("Error fetching active tenants:", error);
    throw new Error("Failed to fetch active tenants");
  }
}

/**
 * Fetch single tenant by ID
 */
export async function fetchTenantById(id: string): Promise<Tenant> {
  try {
    const tenantRef = doc(db, "tenants", id);
    const tenantDoc = await getDoc(tenantRef);

    if (!tenantDoc.exists()) {
      throw new Error(`Tenant with ID ${id} not found`);
    }

    const data = tenantDoc.data();
    return {
      id: tenantDoc.id,
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      companyPhone: data.companyPhone,
      ownerId: data.ownerId,
      currentPlanId: data.currentPlanId,
      subscriptionEndDate:
        data.subscriptionEndDate instanceof Timestamp
          ? data.subscriptionEndDate.toDate()
          : new Date(data.subscriptionEndDate),
      is_active: data.is_active,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
    };
  } catch (error) {
    console.error("Error fetching tenant:", error);
    throw new Error(`Failed to fetch tenant with ID ${id}`);
  }
}

/**
 * Update tenant information
 */
export async function updateTenant(
  input: UpdateTenantInput
): Promise<void> {
  try {
    const { id, ...updateData } = input;
    const tenantRef = doc(db, "tenants", id);

    await updateDoc(tenantRef, updateData);
  } catch (error) {
    console.error("Error updating tenant:", error);
    throw new Error("Failed to update tenant");
  }
}

/**
 * Extend tenant subscription by 30 days and create payment record
 */
export async function extendTenantSubscription(params: {
  tenantId: string;
  amount: number;
  notes?: string;
}): Promise<Date> {
  const { tenantId, amount, notes } = params;
  try {
    const tenantRef = doc(db, "tenants", tenantId);
    const tenantDoc = await getDoc(tenantRef);

    if (!tenantDoc.exists()) {
      throw new Error(`Tenant with ID ${tenantId} not found`);
    }

    const tenantData = tenantDoc.data();
    const currentEndDate = tenantData.subscriptionEndDate;
    const currentDate =
      currentEndDate instanceof Timestamp
        ? currentEndDate.toDate()
        : new Date(currentEndDate);

    // Add 30 days
    const newEndDate = new Date(currentDate);
    newEndDate.setDate(newEndDate.getDate() + 30);

    // The subscriptionId doesn't exist - we use tenantId directly
    // as the collection we need to update is tenant_subscriptions which uses tenantId
    
    // Create payment record with provided amount
    await createPaymentRecord({
      tenantId,
      subscriptionId: tenantId, // Use tenantId as subscription identifier
      amount,
      periodStart: currentDate,
      periodEnd: newEndDate,
      notes: notes || "Payment received - subscription extended for 30 days",
    });

    // Update tenant subscription date (this is done in createPaymentRecord)
    // but we'll update tenant directly as well for consistency
    await updateDoc(tenantRef, {
      subscriptionEndDate: Timestamp.fromDate(newEndDate),
    });

    return newEndDate;
  } catch (error) {
    console.error("Error extending subscription:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to extend subscription"
    );
  }
}

/**
 * Toggle tenant active status
 */
export async function toggleTenantStatus(tenantId: string): Promise<void> {
  try {
    const tenantRef = doc(db, "tenants", tenantId);
    const tenantDoc = await getDoc(tenantRef);

    if (!tenantDoc.exists()) {
      throw new Error(`Tenant with ID ${tenantId} not found`);
    }

    const currentStatus = tenantDoc.data().is_active;

    await updateDoc(tenantRef, {
      is_active: !currentStatus,
    });
  } catch (error) {
    console.error("Error toggling tenant status:", error);
    throw new Error("Failed to toggle tenant status");
  }
}
