import { UserCredential } from 'firebase/auth';
import { getUserByEmail } from '../queries/users.queries';
import { AuthResult, SignInFunction } from '../types/auth.types';


export async function checkUserAuthorization(email: string): Promise<boolean> {
  const querySnapshot = await getUserByEmail(email);
  return !querySnapshot.empty;
}


export async function setSessionCookie(userCredential: UserCredential): Promise<void> {
  if (userCredential?.user) {
    const token = await userCredential.user.getIdToken();
    document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax; Secure`;
  }
}

export async function loginUser(
  email: string,
  password: string,
  signIn: SignInFunction
): Promise<AuthResult> {
  try {
    const isAuthorized = await checkUserAuthorization(email);
    
    if (!isAuthorized) {
      return {
        success: false,
        error: 'No tienes autorización para acceder al panel de administración',
      };
    }
    const { data: userCredential, error: authError } = await signIn(email, password);

    if (authError) {
      return {
        success: false,
        error: getFirebaseErrorMessage(authError.code),
      };
    }
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

export function clearSessionCookie(): void {
  document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export async function logoutUser(
  signOut: () => Promise<{ error: any }>
): Promise<AuthResult> {
  try {
    const { error } = await signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión',
      };
    }
    clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error('Logout service error:', error);
    return {
      success: false,
      error: 'Error inesperado al cerrar sesión',
    };
  }
}

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
