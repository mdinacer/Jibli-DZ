import firebaseServices from '@/config/firebaseConfig';
import ProfileService from '@/services/ProfileService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';

export default function useLoadUserProfile() {
  const { user, setUser, signOut } = useAuthStore();
  const { profile, status, loaded, setProfile } = useProfileStore();

  const handleSignOut = useCallback(async () => {
    await signOut();
    setProfile(null);
  }, [setProfile, signOut]);

  const handleLoadProfile = useCallback(
    async (userId: string) => {
      try {
        const profile = await ProfileService.getByUserId(userId);
        if (!profile) {
          //await handleSignOut();
          return router.replace('/onboarding');
        }
        console.log(`User profile ${profile?.username} found`);
        setProfile(profile);
      } catch (error) {
        throw error;
      }
    },
    [handleSignOut, setProfile]
  );

  const handleAuthStateChange = useCallback(
    async (user: FirebaseAuthTypes.User | null) => {
      try {
        if (user) {
          console.log(`User ${user.uid} logged in`);

          setUser(user);
          await handleLoadProfile(user.uid);
        }
        // else {
        //   await handleSignOut();
        //   router.replace('/');
        // }
      } catch (error) {
        console.error(error);
      }
    },
    [handleLoadProfile, handleSignOut, setUser]
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
  return {
    user,
    profile,
    status
  };
}
