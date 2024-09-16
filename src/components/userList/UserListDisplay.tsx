import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Card';
import IconButton from '@/components/IconButton';
import UserListItems from '@/components/userList/UserListItems';
import { Icons } from '@/constants';
import { useLoadUserList } from '@/hooks/useLoadUserList';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { formatDistanceToNow } from 'date-fns';
import { Link, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import EmptyState from '../EmptyState';
import ListCollaboratorsModal from '../list/ListCollaboratorsModal';
import ListsService from '@/services/ListService';
import { useListStore } from '@/stores/useListStore';

interface Props {}

const UserListDisplay: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const { list, state, setList } = useLoadUserList();
  const { collaborators } = useCollaboratorStore();
  const { removeList } = useListStore();

  const handleDeleteList = useCallback(async () => {
    if (!list) return;
    try {
      await ListsService.delete(list.id);
      setList(null);
      removeList(list.id);
    } catch (error) {
      console.error(error);
    }
  }, [list, removeList, setList]);

  const handleListDeletePrompt = () => {
    Alert.alert('Delete List', 'Are you sure you want to delete this list?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: handleDeleteList
      }
    ]);
  };
  if (!list) {
    return (
      <View className="w-full items-center justify-center gap-y-4 rounded-lg bg-background p-6">
        <Text className="font-pregular text-base">
          Start by creating your first list to organize and manage your items
          effortlessly.
        </Text>
        <Link
          className="font-pregular text-base text-pink-500 underline underline-offset-2"
          href={'/create'}
        >
          Create a New List
        </Link>
      </View>
    );
  }
  return (
    <>
      <Text className="font-pregular text-base text-muted-foreground">
        Your list
      </Text>
      <Card>
        <CardHeader>
          <CardTitle>{list.name}</CardTitle>
          <CardDescription>
            Updated{' '}
            {formatDistanceToNow(list.updatedAt.toDate(), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserListItems items={list.items} />
        </CardContent>
        <CardFooter className="flex-row items-center border-t border-border bg-muted bg-muted/50 px-6 py-3">
          <View className="flex-1">
            <Text className="font-pregular text-muted-foreground">
              {list.collaborators.length > 0 ? 'Shared' : 'Private'}
            </Text>
          </View>

          {list.isOwner ? (
            <View className="flex-row space-x-4">
              <IconButton
                icon={Icons.PencilEditIcon}
                variant={'secondary'}
                size="sm"
                onPress={() => router.push(`/list/${list.id}`)}
              />
              <IconButton
                variant={'secondary'}
                size="sm"
                onPress={handleListDeletePrompt}
                icon={Icons.TrashIcon}
              />
              <IconButton
                variant={'secondary'}
                size="sm"
                disabled={collaborators.length === 0}
                icon={Icons.ShareIcon}
                onPress={() => setOpen(true)}
              />
            </View>
          ) : (
            <IconButton
              variant={'secondary'}
              size="sm"
              onPress={() => router.push(`/list/${list.id}`)}
              icon={Icons.ArrowRightIcon}
            />
          )}
        </CardFooter>
      </Card>
      <ListCollaboratorsModal open={open} setOpen={setOpen} />
    </>
  );
};

export default UserListDisplay;
