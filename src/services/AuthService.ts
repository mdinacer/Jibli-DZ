import firebaseServices from '@/config/firebaseConfig';
import CustomError from '@/utils/CustomError';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

async function signUpWithEmailPassword(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> {
  try {
    const userCredential =
      await firebaseServices.auth.createUserWithEmailAndPassword(
        email,
        password
      );
    return userCredential.user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw error;
  }
}

async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> {
  try {
    const userCredential =
      await firebaseServices.auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw error;
  }
}

export async function signOut(clearPersistence = false): Promise<void> {
  try {
    await firebaseServices.auth.signOut();
    if (clearPersistence) {
      await firebaseServices.firestore.clearPersistence();
    }
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      console.error(error);
      firebaseServices.crashlytics.recordError(error);
    }
    throw error;
  }
}

const AuthService = {
  signUpWithEmailPassword,
  signInWithEmailPassword,
  signOut
};

export default AuthService;
