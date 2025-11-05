import { UserCredential } from 'firebase/auth';
import { GlobalUser } from '@/shared/types';


export interface AuthResult {
  success: boolean;
  error?: string;
}


export type AdminUser = GlobalUser;


export interface AuthResponse {
  data: UserCredential | null;
  error: any;
}


export type SignInFunction = (
  email: string,
  password: string
) => Promise<AuthResponse>;
