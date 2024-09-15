import useLoadInvitations from '@/hooks/useLoadInvitations';
import { Invitation } from '@/models/Invitation';
import invitationService from '@/services/InvitationService';
import { useInvitationStore } from '@/stores/useInvitationStore';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { Alert, FlatList, FlatListProps } from 'react-native';
import InvitationCard from './InvitationCard';

interface Props extends Partial<FlatListProps<Invitation>> {}

const InvitationsList: React.FC<Props> = ({ ...props }) => {
  const { profile } = useProfileStore();
  useLoadInvitations();
  const { invitations, removeInvitation } = useInvitationStore();

  const handleDeclineInvitation = useCallback(
    async (invitation: Invitation) => {
      try {
        const isDeleted = await invitationService.deleteInvitation(invitation);

        if (isDeleted) {
          removeInvitation(invitation.id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [removeInvitation]
  );

  const invitationDeclinePrompt = (
    Invitation: Invitation,
    action: 'revoke' | 'decline'
  ) => {
    Alert.alert(
      'Are you sure?',
      `Are you sure you want to ${action} this invitation?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeclineInvitation(Invitation)
        }
      ]
    );
  };

  const handleAcceptInvitation = useCallback(
    async (invitation: Invitation) => {
      if (!profile) return;
      try {
        await invitationService.acceptInvitation(
          invitation.senderId,
          profile.id
        );

        await invitationService.updateInvitation(invitation.id, 'accepted');

        removeInvitation(invitation.id);
      } catch (error) {
        console.error(error);
      }
    },
    [profile, removeInvitation]
  );

  return (
    <FlatList
      data={invitations}
      {...props}
      style={{ flex: 1 }}
      className="px-4"
      contentContainerStyle={{ gap: 16 }}
      keyExtractor={(item) => item.id}
      renderItem={({ item: invitation }) => (
        <InvitationCard
          invitation={invitation}
          onAccept={() => handleAcceptInvitation(invitation)}
          onDecline={(action) => invitationDeclinePrompt(invitation, action)}
        />
      )}
    />
  );
};

export default InvitationsList;
