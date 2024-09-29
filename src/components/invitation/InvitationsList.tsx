import EmptyState from '@/components/EmptyState';
import InvitationCard from '@/components/invitation/InvitationCard';
import useLoadInvitations from '@/hooks/useLoadInvitations';
import { Collaborator } from '@/models/Collaborator';
import { Invitation } from '@/models/Invitation';
import invitationService from '@/services/InvitationService';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useInvitationStore } from '@/stores/useInvitationStore';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, FlatListProps, StyleSheet } from 'react-native';

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
      console.log('Accepting invitation', invitation, collaborator);

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
      style={styles.flatList}
      contentContainerStyle={styles.contentContainer}
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

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    paddingHorizontal: 16
  },
  contentContainer: {
    rowGap: 16,
    paddingVertical: 16
  }
});
