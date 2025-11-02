/**
 * Firebase queries for SaaS plans operations
 */

import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase/client";
import type { SaasPlan } from "@/shared/types/saas-plan.types";

/**
 * Fetch all active SaaS plans from Firestore
 * Sorts by price in JavaScript to avoid composite index requirement
 */
export async function fetchActiveSaasPlans(): Promise<SaasPlan[]> {
  try {
    console.log('🔍 [fetchActiveSaasPlans] Starting query...');
    const plansRef = collection(db, "saas_plans");
    console.log('📦 [fetchActiveSaasPlans] Collection path:', plansRef.path);
    
    // Remove orderBy to avoid composite index requirement
    const q = query(
      plansRef,
      where("is_active", "==", true)
    );
    console.log('⚙️ [fetchActiveSaasPlans] Query constraints: is_active==true');
    
    const querySnapshot = await getDocs(q);
    console.log('📊 [fetchActiveSaasPlans] Documents found:', querySnapshot.size);

    const plans: SaasPlan[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log('📄 [fetchActiveSaasPlans] Document:', doc.id, {
        name: data.name,
        price: data.price,
        is_active: data.is_active
      });
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        max_clients: data.max_clients,
        max_gyms: data.max_gyms,
        features: data.features || [],
        is_active: data.is_active,
        platform_config_id: data.platform_config_id,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
      };
    });

    // Sort by price in JavaScript (avoids composite index)
    plans.sort((a, b) => a.price - b.price);

    console.log('✅ [fetchActiveSaasPlans] Total plans parsed:', plans.length);
    console.log('📋 [fetchActiveSaasPlans] Plans:', plans.map(p => ({ id: p.id, name: p.name, price: p.price })));
    return plans;
  } catch (error) {
    console.error('❌ [fetchActiveSaasPlans] Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
}

/**
 * Fetch all SaaS plans (including inactive)
 * Sorts by price in JavaScript
 */
export async function fetchAllSaasPlans(): Promise<SaasPlan[]> {
  try {
    const plansRef = collection(db, "saas_plans");
    // Fetch all plans without orderBy
    const querySnapshot = await getDocs(plansRef);

    const plans: SaasPlan[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        max_clients: data.max_clients,
        max_gyms: data.max_gyms,
        features: data.features || [],
        is_active: data.is_active,
        platform_config_id: data.platform_config_id,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt),
      };
    });

    // Sort by price in JavaScript
    plans.sort((a, b) => a.price - b.price);

    return plans;
  } catch (error) {
    console.error("Error fetching all SaaS plans:", error);
    return [];
  }
}
