import AuthService from '@/services/AuthService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { create } from 'zustand';

interface AuthStoreState {
  user: FirebaseAuthTypes.User | null;
  token: string | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setToken: (token: string | null) => void;
  signUpWithEmailPassword: (
    email: string,
    password: string
  ) => Promise<FirebaseAuthTypes.User>;
  signInWithEmailPassword: (
    email: string,
    password: string
  ) => Promise<FirebaseAuthTypes.User>;
  signOut: () => Promise<void>;
  handleAuthErrors: (code: string) => string;
}

const InitialState: Pick<AuthStoreState, 'user' | 'token'> = {
  user: null,
  token: null
};

const authErrorMessages: Record<string, string> = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-not-found': 'User not found.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/user-disabled': 'User account is disabled.',
  'auth/too-many-requests': 'Too many requests. Try again later.',
  'auth/operation-not-allowed': 'Operation not allowed.',
  'auth/email-already-in-use': 'Email is already in use.',
  'auth/weak-password': 'Password is too weak.'
};

const handleAuthErrors = (code: string): string => {
  return authErrorMessages[code] || 'Unexpected error occurred.';
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...InitialState,
  setUser: (user: FirebaseAuthTypes.User | null) => set({ user }),
  setToken: (token: string | null) => set({ token }),

  signUpWithEmailPassword: async (email: string, password: string) => {
    const user = await AuthService.signUpWithEmailPassword(email, password);
    set({ user });
    return user;
  },

  signInWithEmailPassword: async (email: string, password: string) => {
    const user = await AuthService.signInWithEmailPassword(email, password);
    set({ user });
    return user;
  },

  signOut: async () => {
    await AuthService.signOut();
    set({ user: null, token: null });
  },

  handleAuthErrors
}));
