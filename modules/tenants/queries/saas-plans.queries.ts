

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


export async function fetchActiveSaasPlans(): Promise<SaasPlan[]> {
  try {
    const plansRef = collection(db, "saas_plans");
    const q = query(
      plansRef,
      where("is_active", "==", true)
    );
    
    const querySnapshot = await getDocs(q);

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
    plans.sort((a, b) => a.price - b.price);

    return plans;
  } catch (error) {
    return [];
  }
}

export async function fetchAllSaasPlans(): Promise<SaasPlan[]> {
  try {
    const plansRef = collection(db, "saas_plans");
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
    plans.sort((a, b) => a.price - b.price);

    return plans;
  } catch (error) {
    return [];
  }
}
