import ProfileService from '@/services/ProfileService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useCallback, useEffect } from 'react';

function useLoadProfile() {
  const { user } = useAuthStore();
  const { profile, status, loaded, setProfile, setStatus, setLoaded } =
    useProfileStore();

  const handleLoadProfile = useCallback(
    async (userId: string) => {
      setStatus('pending');
      try {
        const profile = await ProfileService.getByUserId(userId);
        console.log('profile', JSON.stringify(profile, null, 2));

        if (!profile) {
          setStatus('error');
          return;
        }
        setProfile(profile);
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        console.warn("Couldn't load profile", {
          message: error.message,
          type: 'error'
        });
      } finally {
        setLoaded(true);
      }
    },
    [setLoaded, setProfile, setStatus]
  );

  useEffect(() => {
    if (user && status === 'idle' && !loaded) {
      handleLoadProfile(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, status, user]);

  return { profile, status };
}

export default useLoadProfile;
