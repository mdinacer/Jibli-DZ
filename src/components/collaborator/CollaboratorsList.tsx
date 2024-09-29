import { Collaborator } from '@/models/Collaborator';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import CollaboratorCard from './CollaboratorCard';

interface Props extends Partial<FlatListProps<Collaborator>> {}

const CollaboratorsList: React.FC<Props> = ({ ...props }) => {
  const { collaborators } = useCollaboratorStore();
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
    />
  );
};

export default CollaboratorsList;
