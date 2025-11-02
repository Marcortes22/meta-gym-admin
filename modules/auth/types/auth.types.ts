import { UserCredential } from 'firebase/auth';
import { GlobalUser } from '@/shared/types';

/**
 * Interface para el resultado de operaciones de autenticación
 */
export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Alias para usuario administrador
 * @deprecated Usar GlobalUser de shared/types en su lugar
 */
export type AdminUser = GlobalUser;

/**
 * Interface para el resultado de signIn/signUp
 */
export interface AuthResponse {
  data: UserCredential | null;
  error: any;
}

/**
 * Type para la función signIn
 */
export type SignInFunction = (
  email: string,
  password: string
) => Promise<AuthResponse>;
