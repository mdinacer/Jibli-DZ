import firebaseServices from '@/config/firebaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';

export default function useOnAuthStateChanged() {
  const { setUser, user } = useAuthStore();

  const handleAuthStateChange = useCallback(
    (user: FirebaseAuthTypes.User | null) => {
      setUser(user);
      if (!user) {
        router.push('/');
      }
    },
    [setUser]
  );

  useEffect(() => {
    const unsubscribe = firebaseServices.auth.onAuthStateChanged((user) => {
      handleAuthStateChange(user);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user };
}
