import AuthService from '@/services/AuthService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { create } from 'zustand';

interface AuthStoreState {
  user: FirebaseAuthTypes.User | null;
  token: string | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setToken: (token: string | null) => void;
  singUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const InitialState: Pick<AuthStoreState, 'user' | 'token'> = {
  user: null,
  token: null
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...InitialState,
  setUser: (user: FirebaseAuthTypes.User | null) => set({ user }),
  setToken: (token: string | null) => set({ token }),
  singUpWithEmailPassword: async (email: string, password: string) => {
    const user = await AuthService.signUpWithEmailPassword(email, password);
    set({ user });
  },
  signInWithEmailPassword: async (email: string, password: string) => {
    const user = await AuthService.signInWithEmailPassword(email, password);
    set({ user });
  },
  signOut: async () => {
    await AuthService.signOut();
    set({ user: null, token: null });
  }
}));
