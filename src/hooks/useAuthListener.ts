import firebaseServices from '@/config/firebaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export default function useAuthListener() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = firebaseServices.auth.onAuthStateChanged(setUser);

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
