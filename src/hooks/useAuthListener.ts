import firebaseServices from '@/config/firebaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useCallback, useEffect } from 'react';

export default function useAuthListener() {
  const { setUser, signOut } = useAuthStore();

  const checkUserExists = useCallback(
    async (user: FirebaseAuthTypes.User) => {
      try {
        await user.reload();
        setUser(user);
      } catch (error: any) {
        await signOut();
        setUser(null);
      }
    },
    [setUser, signOut]
  );

  useEffect(() => {
    const unsubscribe = firebaseServices.auth.onAuthStateChanged((user) => {
      if (user) {
        checkUserExists(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
