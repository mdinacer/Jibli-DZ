import IconButton from '@/components/IconButton';
import UserListItems from '@/components/userList/UserListItems';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useLoadUserList } from '@/hooks/useLoadUserList';
import { useThemeColor } from '@/hooks/useThemeColor';
import ListsService from '@/services/ListService';
import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useListStore } from '@/stores/useListStore';
import { formatDistanceToNow } from 'date-fns';
import { arDZ, enUS, fr } from 'date-fns/locale';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card';
import Link from '../Themed/Link';
import Text from '../Themed/Text';

const UserListDisplay: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { list, setList } = useLoadUserList();
  const { collaborators } = useCollaboratorStore();
  const { removeList } = useListStore();

  const theme = useThemeColor({
    light: undefined,
    dark: undefined
  }) as ThemeType;

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
      <Card>
        <CardHeader>
          <CardTitle>{t('user_list.no_items_title')}</CardTitle>
          <CardDescription>
            {t('user_list.no_items_description')}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link lightColor="#ec4899" darkColor="#db2777" href={'/create'}>
            {t('user_list.no_items_action')}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <View>
      <Text style={[styles.title, { color: theme.mutedForeground }]}>
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
        <CardFooter
          style={[
            styles.footer,
            { borderTopColor: theme.border, borderTopWidth: 1 }
          ]}
        >
          <View style={styles.collaboratorText}>
            <Text muted>
              {t(list.collaborators.length > 0 ? 'shared' : 'private')}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <IconButton
              icon={Icons.PencilEditIcon}
              iconStyles={{
                color: '#ec4899',
                height: 20,
                width: 20
              }}
              onPress={() => router.push(`/list/${list.id}`)}
            />
            <IconButton
              onPress={handleListDeletePrompt}
              icon={Icons.TrashIcon}
            />
            <IconButton
              disabled={collaborators.length === 0}
              icon={Icons.ShareIcon}
              onPress={() => router.push('/listCollaborators')}
            />
          </View>
        </CardFooter>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12
  },
  collaboratorText: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    columnGap: 20
  }
});

export default UserListDisplay;
