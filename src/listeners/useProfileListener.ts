import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { Profile } from '@/models/Profile';
import collaboratorService from '@/services/collaborator-service';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useCallback, useEffect } from 'react';

export default function useProfileListener() {
  const { user } = useAuthStore();
  const { profile, setProfile, setStatus } = useProfileStore();
  const { setCollaborators } = useCollaboratorStore();

  const handleCollaboratorChanges = useCallback(
    async (collaboratorsIds: string[]) => {
      if (!profile) return;
      try {
        const isChanged =
          JSON.stringify(collaboratorsIds) !==
          JSON.stringify(profile.collaborators);
        if (!isChanged) return;
        console.log('Handling collaborator changes');

        const newCollaborators =
          await collaboratorService.getCollaboratorsByIds(collaboratorsIds);
        setCollaborators(newCollaborators);
      } catch (error: any) {
        console.error(`Error fetching collaborators: ${error.message}`);
      }
    },
    [profile, setCollaborators]
  );

  const handleProfileChanges = useCallback(
    async (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<Profile>) => {
      if (!user) return; // This is always false

      if (snapshot.exists) {
        const profileData = { ...snapshot.data(), id: snapshot.id } as Profile;

        await handleCollaboratorChanges(profileData.collaborators);
        setProfile(profileData);
        setStatus('success');
      } else {
        setProfile(null);
        console.warn('Profile document does not exist');
        setStatus('error');
      }
    },
    [handleCollaboratorChanges, setProfile, setStatus, user]
  );

  const initListener = useCallback(() => {
    if (!user) return;
    setStatus('pending');
    const profileRef = firebaseServices.firestore
      .collection(Collections.PROFILES)
      .doc(user.uid) as FirebaseFirestoreTypes.DocumentReference<Profile>;

    return profileRef.onSnapshot(handleProfileChanges, (error) => {
      console.error(`Error listening to profile changes: ${error.message}`);
    });
  }, [handleProfileChanges, setStatus, user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = initListener();

    // Cleanup the listener when the component unmounts or user changes
    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {};
}
