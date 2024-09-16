import { Icons } from '@/constants';
import { MockCollaborators } from '@/data/mock-data';
import { Collaborator } from '@/models/Collaborator';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {} from 'react-native-gesture-handler';
import { CardTitle } from '../Card';
import IconButton from '../IconButton';
import { useUserListStore } from '@/stores/useUserListStore';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ListCollaboratorsModal: React.FC<Props> = ({ open, setOpen }) => {
  const { list, updateList } = useUserListStore();
  const { collaborators } = useCollaboratorStore();

  const [listCollaborators, setListCollaborators] = useState<string[]>(
    list?.collaborators || []
  );

  const handleUpdateListCollaborators = useCallback(() => {
    updateList((prev) => ({ ...prev, collaborators: listCollaborators }));
  }, [listCollaborators, updateList]);

  const handleCollaboratorsSelect = useCallback(
    (collaborator: Collaborator) => {
      if (listCollaborators.includes(collaborator.userId)) {
        setListCollaborators(
          listCollaborators.filter((c) => c !== collaborator.userId)
        );
      } else {
        setListCollaborators([...listCollaborators, collaborator.userId]);
      }
    },
    [listCollaborators]
  );

  useEffect(() => {
    handleUpdateListCollaborators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCollaborators]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <View
        style={{ rowGap: 16 }}
        className="absolute inset-x-0 bottom-0 min-h-[60%] rounded-t-2xl border-t border-border bg-muted p-6"
      >
        <CardTitle>Collaborators</CardTitle>
        <FlatList
          contentContainerStyle={{ gap: 16 }}
          data={collaborators}
          keyExtractor={(c) => c.userId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCollaboratorsSelect(item)}>
              <CollaboratorDisplay
                active={listCollaborators.includes(item.userId)}
                collaborator={item}
              />
            </TouchableOpacity>
          )}
        />

        <View className="w-full items-center justify-center pb-5">
          <IconButton
            variant="bordered"
            onPress={() => setOpen(false)}
            icon={Icons.CancelIcon}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ListCollaboratorsModal;

interface CollaboratorDisplayProps {
  collaborator: Collaborator;
  active: boolean;
}

const CollaboratorDisplay: React.FC<CollaboratorDisplayProps> = ({
  collaborator,
  active
}) => {
  return (
    <View
      className={`flex-row items-center space-x-4 rounded-full px-2 py-1 ${active ? 'bg-card' : 'bg-muted'}`}
    >
      <View className="aspect-square h-10 items-center justify-center overflow-hidden rounded-full bg-muted">
        {collaborator.picture ? (
          <Image
            source={{ uri: collaborator.picture }}
            height={40}
            width={40}
            resizeMode="cover"
          />
        ) : (
          <Icons.UserIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </View>
      <View className="flex-1">
        <Text className="font-pmedium text-base">{collaborator.username}</Text>
        <Text className="font-pregular text-base text-muted-foreground">
          {collaborator.email}
        </Text>
      </View>
      <View
        className={`aspect-square h-10 items-center justify-center overflow-hidden rounded-full ${active ? 'bg-primary' : 'bg-muted'}`}
      >
        {active ? (
          <Icons.CheckIcon className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Icons.CancelIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </View>
    </View>
  );
};
