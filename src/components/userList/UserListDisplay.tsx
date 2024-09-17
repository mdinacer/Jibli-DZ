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
import ListsService from '@/services/ListService';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useListStore } from '@/stores/useListStore';
import { formatDistanceToNow } from 'date-fns';
import { arDZ, enUS, fr } from 'date-fns/locale';
import { Link, router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, View } from 'react-native';
import ListCollaboratorsModal from '../list/ListCollaboratorsModal';

interface Props {}

const UserListDisplay: React.FC<Props> = () => {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { list, state, setList } = useLoadUserList();
  const { collaborators } = useCollaboratorStore();
  const { removeList } = useListStore();

  const locale = useMemo(() => {
    switch (i18n.language) {
      case 'ar-DZ':
        return arDZ;
      case 'fr-FR':
        return fr;
      default:
        return enUS;
    }
  }, [i18n.language]);

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
    Alert.alert(t('delete_list.title'), t('delete_list.description'), [
      {
        text: t('delete_list.cancel'),
        style: 'cancel'
      },
      {
        text: t('delete_list.delete'),
        style: 'destructive',
        onPress: handleDeleteList
      }
    ]);
  };
  if (!list) {
    return (
      <View
        className={`w-full items-center justify-center gap-y-4 rounded-lg bg-background p-6`}
      >
        <Text className="font-pregular text-base">
          {t('user_list.no_items_text')}
        </Text>
        <Link
          className={`font-pregular text-base text-pink-500 underline underline-offset-2`}
          href={'/create'}
        >
          {t('user_list.no_items_action')}
        </Link>
      </View>
    );
  }
  return (
    <>
      <Text className={`font-pregular text-base text-muted-foreground`}>
        {t('my_list')}
      </Text>
      <Card>
        <CardHeader>
          <CardTitle>{list.name}</CardTitle>
          <CardDescription>
            {t('updated')}{' '}
            {formatDistanceToNow(list.updatedAt.toDate(), {
              addSuffix: true,
              locale
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserListItems items={list.items} />
        </CardContent>
        <CardFooter className="flex-row items-center border-t border-border bg-muted bg-muted/50 px-6 py-3">
          <View className="flex-1">
            <Text className="font-pregular text-muted-foreground">
              {t(list.collaborators.length > 0 ? 'shared' : 'private')}
            </Text>
          </View>

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
        </CardFooter>
      </Card>
      <ListCollaboratorsModal open={open} setOpen={setOpen} />
    </>
  );
};

export default UserListDisplay;
