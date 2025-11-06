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
        error: 'You are not authorized to access the administration panel',
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
    return {
      success: false,
      error: 'Unexpected error signing in',
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
      return {
        success: false,
        error: 'Error signing out',
      };
    }
    clearSessionCookie();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error signing out',
    };
  }
}

function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Email is not valid',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'Invalid credentials',
    'auth/wrong-password': 'Invalid credentials',
    'auth/invalid-credential': 'Invalid credentials',
    'auth/too-many-requests': 'Too many failed attempts. Try again later',
  };

  return errorMessages[errorCode] || 'Invalid credentials';
}
