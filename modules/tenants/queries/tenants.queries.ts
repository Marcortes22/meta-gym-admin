
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
    const newEndDate = new Date(currentDate);
    newEndDate.setDate(newEndDate.getDate() + 30);


    await createPaymentRecord({
      tenantId,
      subscriptionId: tenantId,
      amount,
      periodStart: currentDate,
      periodEnd: newEndDate,
      notes: notes || "Payment received - subscription extended for 30 days",
    });
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
