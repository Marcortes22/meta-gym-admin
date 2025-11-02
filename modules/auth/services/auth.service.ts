import { UserCredential } from 'firebase/auth';
import { getUserByEmail } from '../queries/users.queries';
import { AuthResult, SignInFunction } from '../types/auth.types';

/**
 * Verifica si un usuario existe en la colección global_users
 */
export async function checkUserAuthorization(email: string): Promise<boolean> {
  const querySnapshot = await getUserByEmail(email);
  return !querySnapshot.empty;
}

/**
 * Establece la cookie de sesión con el token de Firebase
 */
export async function setSessionCookie(userCredential: UserCredential): Promise<void> {
  if (userCredential?.user) {
    const token = await userCredential.user.getIdToken();
    document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
  }
}

/**
 * Maneja el proceso completo de login
 */
export async function loginUser(
  email: string,
  password: string,
  signIn: SignInFunction
): Promise<AuthResult> {
  try {
    // 1. Verificar autorización en global_users
    const isAuthorized = await checkUserAuthorization(email);
    
    if (!isAuthorized) {
      return {
        success: false,
        error: 'No tienes autorización para acceder al panel de administración',
      };
    }

    // 2. Autenticar con Firebase Auth
    const { data: userCredential, error: authError } = await signIn(email, password);

    if (authError) {
      return {
        success: false,
        error: getFirebaseErrorMessage(authError.code),
      };
    }

    // 3. Establecer cookie de sesión
    if (userCredential) {
      await setSessionCookie(userCredential);
    }

    return { success: true };
  } catch (error) {
    console.error('Login service error:', error);
    return {
      success: false,
      error: 'Error inesperado al iniciar sesión',
    };
  }
}

/**
 * Mapea códigos de error de Firebase a mensajes legibles
 */
function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'Credenciales inválidas',
    'auth/wrong-password': 'Credenciales inválidas',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
  };

  return errorMessages[errorCode] || 'Credenciales inválidas';
}
