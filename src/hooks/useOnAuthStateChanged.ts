import firebaseServices from '@/config/firebaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export default function useOnAuthStateChanged() {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = firebaseServices.auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user };
}
