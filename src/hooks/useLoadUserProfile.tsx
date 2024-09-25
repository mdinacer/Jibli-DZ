import ProfileService from '@/services/ProfileService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useCallback, useEffect } from 'react';

export default function useLoadUserProfile() {
  const { user, signOut } = useAuthStore();
  const { profile, status, loaded, setStatus, setLoaded, setProfile } =
    useProfileStore();

  const handleSignOut = useCallback(async () => {
    await signOut();
    setProfile(null);
  }, [setProfile, signOut]);

  const handleCreateNewProfile = useCallback(
    async (user: FirebaseAuthTypes.User, username: string) => {
      try {
        const createdProfile = await ProfileService.create({
          username: username,
          email: user.email!,
          picture: null
        });
        setProfile(createdProfile);
      } catch (error: any) {
        console.error(`Error creating new profile: ${error.message}`);
      }
    },
    [setProfile]
  );

  const handleLoadProfile = useCallback(
    async (user: FirebaseAuthTypes.User) => {
      setStatus('pending');
      try {
        const profile = await ProfileService.getByUserId(user.uid);
        if (profile) {
          setProfile(profile);
          console.log('profile', profile.username);
        } else {
          await handleCreateNewProfile(user, user.displayName || user.email!);
        }
        setStatus('success');
      } catch (error) {
        setStatus('error');
        throw error;
      } finally {
        setLoaded(true);
      }
    },
    [handleCreateNewProfile, setLoaded, setProfile, setStatus]
  );

  useEffect(() => {
    if (user && status === 'idle' && !loaded) {
      handleLoadProfile(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status, loaded]);

  return {
    user,
    profile,
    status,
    handleSignOut
  };
}
