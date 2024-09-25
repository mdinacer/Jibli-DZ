import { Button } from '@/components/Themed/Button';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Collaborator } from '@/models/Collaborator';
import ListsService from '@/services/ListService';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useListStore } from '@/stores/useListStore';
import { useUserListStore } from '@/stores/useUserListStore';
import { Redirect, router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';

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
      edges={
        Platform.OS === 'android'
          ? ['top', 'left', 'right', 'bottom']
          : ['left', 'right', 'bottom']
      }
    >
      <View style={{ rowGap: 24, flex: 1, padding: 24 }}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
            lineHeight: 28
          }}
        >
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
          <Button disabled={!isModified} onPress={handleSaveChanges}>
            Save
          </Button>
          <Button onPress={handleDiscardChanges} variant="outline">
            Cancel
          </Button>
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
  const theme = useThemeColor({}) as ThemeType;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 16,
        borderRadius: 9999,
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: active ? theme.card : theme.muted
      }}
    >
      <View
        style={{
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 9999,
          backgroundColor: theme.muted
        }}
      >
        {collaborator.picture ? (
          <Image
            source={{ uri: collaborator.picture }}
            height={40}
            width={40}
            resizeMode="cover"
          />
        ) : (
          <Icons.UserIcon
            style={{ height: 20, width: 20 }}
            color={theme.mutedForeground}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            textTransform: 'capitalize'
          }}
        >
          {collaborator.username}
        </Text>
        <Text muted>{collaborator.email}</Text>
      </View>
      <View
        style={{
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 9999,
          backgroundColor: active ? theme.primary : theme.muted
        }}
      >
        {active ? (
          <Icons.CheckIcon
            style={{ height: 20, width: 20 }}
            color={theme.primaryForeground}
          />
        ) : (
          <Icons.CancelIcon
            style={{ height: 20, width: 20 }}
            color={theme.mutedForeground}
          />
        )}
      </View>
    </View>
  );
};
