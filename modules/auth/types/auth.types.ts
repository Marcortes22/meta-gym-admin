import { UserCredential } from 'firebase/auth';

/**
 * Interface para el resultado de operaciones de autenticación
 */
export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Interface para el usuario administrador en Firestore
 */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: Date;
  updatedAt?: Date;
}

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
