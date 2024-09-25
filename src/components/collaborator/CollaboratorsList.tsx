import { Collaborator } from '@/models/Collaborator';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import React, { useCallback, useMemo } from 'react';
import { Alert, Dimensions, FlatList, FlatListProps, View } from 'react-native';
import CollaboratorCard from './CollaboratorCard';
import EmptyState from '../EmptyState';
import { useTranslation } from 'react-i18next';
import collaboratorService from '@/services/collaborator-service';
import { useListStore } from '@/stores/useListStore';

interface Props extends Partial<FlatListProps<Collaborator>> {}

const PADDING = 16;

const CollaboratorsList: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common');
  const { collaborators } = useCollaboratorStore();
  const { lists, setLists } = useListStore();

  const { width } = Dimensions.get('window');

  const handleRevoke = useCallback(
    async (collaborator: Collaborator) => {
      try {
        await collaboratorService.revokeCollaboration(collaborator.userId);
        setLists(lists.filter((l) => l.ownerId !== collaborator.userId));
      } catch (error: any) {
        console.error(
          ` Error revoking collaborator ${collaborator.userId}`,
          error
        );
      }
    },
    [lists, setLists]
  );

  const onRevokePrompt = useCallback(
    (collaborator: Collaborator) => {
      Alert.alert(
        t('collaborator_revoke_prompt.title'),
        t('collaborator_revoke_prompt.description'),
        [
          {
            text: t('collaborator_revoke_prompt.cancel'),
            style: 'cancel'
          },
          {
            text: t('collaborator_revoke_prompt.cta'),
            style: 'destructive',
            onPress: () => handleRevoke(collaborator)
          }
        ]
      );
    },
    [handleRevoke, t]
  );

  const size = useMemo(
    () =>
      collaborators.length > 0
        ? (width - PADDING * 2) * 0.9
        : width - PADDING * 2,
    [collaborators.length, width]
  );
  return (
    <FlatList
      {...props}
      className="py-4"
      contentContainerStyle={{ gap: 16 }}
      data={collaborators}
      keyExtractor={(c) => c.userId}
      horizontal
      renderItem={({ item: collaborator }) => (
        <View style={{ width: size }}>
          <CollaboratorCard
            collaborator={collaborator}
            onRevoke={onRevokePrompt}
          />
        </View>
      )}
      ListEmptyComponent={
        <View style={{ width: width - PADDING * 2 }}>
          <EmptyState
            title={t('collaborators_empty_state.title')}
            description={t('collaborators_empty_state.description')}
          />
        </View>
      }
    />
  );
};

export default CollaboratorsList;
