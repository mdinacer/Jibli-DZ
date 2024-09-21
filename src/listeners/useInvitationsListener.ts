import useLoadInvitations from '@/hooks/useLoadInvitations';
import { Invitation } from '@/models/Invitation';
import { useInvitationStore } from '@/stores/useInvitationStore';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useCallback, useEffect, useState } from 'react';
import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export default function useInvitationsListener() {
  const { profile, updateProfile } = useProfileStore();
  const { fetchCollaboratorById } = useCollaboratorStore();
  const { invitations } = useLoadInvitations();
  const { loaded, addInvitation, removeInvitation } = useInvitationStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDocChanges = useCallback(
    async (
      changes: FirebaseFirestoreTypes.DocumentChange[],
      userId: string
    ) => {
      if (!profile) return;

      for (const { type, doc } of changes) {
        const data = doc.data();
        const invitation: Invitation = {
          ...data,
          id: doc.id,
          isOwner: data.senderId === userId
        } as Invitation;

        const isRecipientNotCollaborator = !profile.collaborators.includes(
          invitation.recipientId
        );

        if (type === 'added') {
          if (
            invitation.status === 'pending' &&
            !invitation.isOwner &&
            !invitations.some((inv) => inv.id === doc.id)
          ) {
            addInvitation(invitation);
          }
        } else if (type === 'modified') {
          if (
            invitation.status === 'accepted' &&
            invitation.isOwner &&
            isRecipientNotCollaborator
          ) {
            const updatedCollaborators = [
              ...profile.collaborators,
              invitation.recipientId
            ];

            await Promise.all([
              updateProfile({ collaborators: updatedCollaborators }),
              fetchCollaboratorById(invitation.recipientId),
              removeInvitation(invitation.id)
              // invitationService.deleteInvitation(invitation)
            ]);
          }
        } else if (type === 'removed') {
          if (invitations.some((inv) => inv.id === doc.id)) {
            removeInvitation(invitation.id);
          }
        }
      }
    },
    [
      profile,
      invitations,
      addInvitation,
      updateProfile,
      fetchCollaboratorById,
      removeInvitation
    ]
  );

  useEffect(() => {
    if (!loaded) return;

    const user = firebaseServices.auth.currentUser;

    if (!user) {
      setError('User not found');
      setLoading(false);
      return;
    }

    const invitationsRef = firebaseServices.firestore.collection(
      Collections.INVITATIONS
    );

    // Query for senderId
    const senderQuery = invitationsRef.where('senderId', '==', user.uid);

    // Query for recipientId
    const recipientQuery = invitationsRef.where('recipientId', '==', user.uid);

    // Listen to senderId query
    const unsubscribeSender = senderQuery.onSnapshot(
      (snapshot) => {
        handleDocChanges(snapshot.docChanges(), user.uid);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to sender invitations:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Listen to recipientId query
    const unsubscribeRecipient = recipientQuery.onSnapshot(
      (snapshot) => {
        handleDocChanges(snapshot.docChanges(), user.uid);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to recipient invitations:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup both listeners on unmount
    return () => {
      unsubscribeSender();
      unsubscribeRecipient();
    };
  }, [loaded, handleDocChanges]);

  return { loading, error, invitations };
}
