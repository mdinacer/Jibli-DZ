import {
  View,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUserListStore } from '@/stores/useUserListStore';
import { Redirect, router } from 'expo-router';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { Collaborator } from '@/models/Collaborator';
import { Icons } from '@/constants';
import AppButton from '@/components/AppButton';
import { useListStore } from '@/stores/useListStore';
import ListsService from '@/services/ListService';

const ListCollaborators = () => {
  const { t } = useTranslation();
  const { list, updateList } = useUserListStore();
  const { updateList: updateStoreList } = useListStore();
  const { collaborators } = useCollaboratorStore();

  const [listCollaborators, setListCollaborators] = useState<string[]>(
    list?.collaborators || []
  );

  const isModified = useMemo(() => {
    return (
      JSON.stringify(listCollaborators) !== JSON.stringify(list?.collaborators)
    );
  }, [list?.collaborators, listCollaborators]);

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

  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!list) return;
    try {
      await ListsService.update(list.id, { collaborators: listCollaborators });
      await ListsService.updateCollaborators(list.id, listCollaborators);
      updateList((prevState) => ({
        ...prevState,
        collaborators: listCollaborators
      }));
      updateStoreList(list.id, { collaborators: listCollaborators });
      handleGoBack();
    } catch (error) {
      console.error(error);
    }
  }, [handleGoBack, list, listCollaborators, updateList, updateStoreList]);

  const handleDiscardChanges = useCallback(() => {
    setListCollaborators(list?.collaborators || []);
    handleGoBack();
  }, [handleGoBack, list?.collaborators]);

  if (!list) return <Redirect href={'/home'} />;
  return (
    <SafeAreaView
      className="flex-1"
      edges={
        Platform.OS === 'android'
          ? ['top', 'left', 'right', 'bottom']
          : ['left', 'right', 'bottom']
      }
    >
      <View className="flex-1 p-6" style={{ rowGap: 24 }}>
        <Text className="font-psemibold text-lg">
          Share you list with your friends
        </Text>

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
        <View style={{ rowGap: 12 }}>
          <AppButton disabled={!isModified} onPress={handleSaveChanges}>
            Save
          </AppButton>
          <AppButton onPress={handleDiscardChanges} variant="outline">
            Cancel
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListCollaborators;

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
        <Text className="font-pmedium text-base capitalize">
          {collaborator.username}
        </Text>
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
