import { CardHeader } from '@/components/Card';
import IconButton from '@/components/IconButton';
import UserItemDisplay from '@/components/item/UserItemDisplay';
import useUserListEdit from '@/components/list/useUserListEdit';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ListItem } from '@/models/ListItem';
import { hslToRgb, parseHSL } from '@/utils/hslConverter';
import { Redirect, router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

const UserListEdit = () => {
  const { t } = useTranslation('common');
  const { list, modified, state, discardChanges, removeItem, saveChanges } =
    useUserListEdit();

  const theme = useThemeColor({}) as ThemeType;
  const rgbBackground = useMemo(() => {
    const rgbValues = parseHSL(theme.background);

    return rgbValues
      ? hslToRgb(rgbValues[0], rgbValues[1], rgbValues[2])
      : null;
  }, [theme.background]);

  const handleDeleteItemPrompt = useCallback(
    (item: ListItem) => {
      Alert.alert(t('item_delete.title'), t('item_delete.description'), [
        {
          text: t('item_delete.cancel'),
          style: 'cancel'
        },
        {
          text: t('item_delete.delete'),
          style: 'destructive',
          onPress: () => {
            removeItem(item.id);
          }
        }
      ]);
    },
    [removeItem, t]
  );

  if (!list) {
    return <Redirect href="/home" />;
  }

  return (
    <>
      <View style={styles.container}>
        <CardHeader>
          <Text style={styles.listName}>{list?.name}</Text>
        </CardHeader>

        <FlatList<ListItem>
          style={styles.flatList}
          data={list.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Text muted style={styles.emptyStateTitle}>
                {t('items_list_empty_state.title')}
              </Text>
              <Text muted style={styles.emptyStateDescription}>
                {t('items_list_empty_state.description')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <UserItemDisplay
              item={item}
              onEdit={() => {
                router.push(`/item/${item.id}`);
                //handleSelectItem(item, 'edit');
              }}
              onDelete={() => {
                handleDeleteItemPrompt(item);
              }}
            />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <View
          style={[
            styles.iconButtonContainer,
            {
              borderColor: theme.border,
              backgroundColor: rgbBackground
                ? `rgba(${rgbBackground}, 0.4)`
                : 'rgba(156, 163, 175, 0.2)'
            }
          ]}
        >
          <IconButton
            disabled={!modified || state.saving}
            icon={Icons.CheckIcon}
            onPress={saveChanges}
            iconStyles={{
              ...styles.icon,
              color: theme.primaryForeground
            }}
            style={[
              styles.iconButton,
              {
                backgroundColor: theme.primary
              }
            ]}
          />
          <IconButton
            onPress={() => router.push('/item/new')}
            icon={Icons.PlusIcon}
            iconStyles={styles.icon}
            style={{
              backgroundColor: '#ec4899',
              ...styles.iconButton
            }}
          />
          <IconButton
            icon={modified ? Icons.CancelIcon : Icons.ArrowTurnBackwardIcon}
            onPress={discardChanges}
            iconStyles={styles.icon}
            style={{
              backgroundColor: theme.accent,
              ...styles.iconButton
            }}
          />
        </View>
      </View>
    </>
  );
};

export default UserListEdit;

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  headerContainer: {
    flex: 1
  },
  listName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    lineHeight: 24
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 16
  },
  flatListContent: {
    paddingBottom: 80
  },
  emptyStateContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-SemiBold'
  },
  emptyStateDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20
  },
  iconButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 32,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  iconButton: {
    borderRadius: 9999,
    padding: 8
  },
  icon: {
    height: 32,
    width: 32
  }
});
