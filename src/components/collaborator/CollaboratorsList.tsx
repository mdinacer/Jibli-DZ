import { Collaborator } from '@/models/Collaborator';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import React, { useMemo } from 'react';
import { Dimensions, FlatList, FlatListProps, View } from 'react-native';
import CollaboratorCard from './CollaboratorCard';
import EmptyState from '../EmptyState';
import { useTranslation } from 'react-i18next';

interface Props extends Partial<FlatListProps<Collaborator>> {}

const PADDING = 16;

const CollaboratorsList: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common');
  const { collaborators } = useCollaboratorStore();

  const { width } = Dimensions.get('window');

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
        <CollaboratorCard collaborator={collaborator} />
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
