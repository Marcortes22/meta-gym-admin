import { BaseEntity } from './common.types';

export interface GymRequest extends BaseEntity {
  gym_name: string;
  gym_phone: string;
  gym_address: string;
  company_name: string;
  name: string;
  admin_name: string;
  admin_surname1: string;
  admin_surname2: string;
  admin_phone: string;
  email: string;
  

  requested_plan: 'basic_plan' | 'professional_plan' | 'enterprise_plan';
  

  state: 'pending' | 'approved' | 'rejected';
  date: Date;
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  generatedToken?: string;
}

export interface CreateGymRequestInput {
  gym_name: string;
  gym_phone: string;
  gym_address: string;
  company_name: string;
  name: string;
  admin_name: string;
  admin_surname1: string;
  admin_surname2: string;
  admin_phone: string;
  email: string;
  requested_plan: GymRequest['requested_plan'];
}

export interface ReviewGymRequestInput {
  requestId: string;
  state: 'approved' | 'rejected';
  reviewedBy: string;
  rejectionReason?: string;
  generatedToken?: string;
}

export interface GymRequestFilters {
  state?: GymRequest['state'];
  requested_plan?: GymRequest['requested_plan'];
  search?: string;
}


export interface GymRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
