import useLoadInvitations from '@/hooks/useLoadInvitations';
import { Invitation } from '@/models/Invitation';
import invitationService from '@/services/InvitationService';
import { useInvitationStore } from '@/stores/useInvitationStore';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { Alert, FlatList, FlatListProps } from 'react-native';
import InvitationCard from './InvitationCard';
import EmptyState from '../EmptyState';
import { useTranslation } from 'react-i18next';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { Collaborator } from '@/models/Collaborator';

interface Props extends Partial<FlatListProps<Invitation>> {}

const InvitationsList: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common');
  const { profile } = useProfileStore();
  useLoadInvitations();
  const { invitations, removeInvitation } = useInvitationStore();
  const { addCollaborator } = useCollaboratorStore();

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
    async (invitation: Invitation, collaborator: Collaborator) => {
      if (!profile) return;
      try {
        await invitationService.acceptInvitation(
          invitation.senderId,
          profile.id
        );

        await invitationService.updateInvitation(invitation.id, 'accepted');

        removeInvitation(invitation.id);
        addCollaborator(collaborator);
      } catch (error) {
        console.error(error);
      }
    },
    [addCollaborator, profile, removeInvitation]
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
          onAccept={(collaborator) =>
            handleAcceptInvitation(invitation, collaborator)
          }
          onDecline={(action) => invitationDeclinePrompt(invitation, action)}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          title={t('invitation_empty_state.title')}
          description={t('invitation_empty_state.description')}
        />
      }
    />
  );
};

export default InvitationsList;
