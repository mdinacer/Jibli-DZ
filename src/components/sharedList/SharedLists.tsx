import { useListStore } from '@/stores/useListStore';
import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  StyleSheet,
  View
} from 'react-native';
import SharedListDisplay from '@/components/sharedList/SharedListDisplay';
import { List } from '@/models/List';
import EmptyState from '../EmptyState';
import { useTranslation } from 'react-i18next';
import Text from '@/components/Themed/Text';

interface Props extends Partial<FlatListProps<List>> {}

const PADDING = 0;

const SharedLists: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common');
  const lists = useListStore((state) => state.lists.filter((l) => !l.isOwner));
  const { width } = Dimensions.get('window');

  const size = useMemo(
    () =>
      lists.length > 0 ? (width - PADDING * 2) * 0.9 : width - PADDING * 2,
    [lists.length, width]
  );

  return (
    <View style={styles.container}>
      <Text muted style={styles.sectionTitle}>
        {t('shared_list_many')}
      </Text>
      <FlatList
        contentContainerStyle={styles.flatListContentContainer}
        data={lists}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => (
          <SharedListDisplay width={size} list={item} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <EmptyState
              title={t('title', {
                keyPrefix: 'shared_list_empty_state'
              })}
              description={t('description', {
                keyPrefix: 'shared_list_empty_state'
              })}
            />
          </View>
        }
        {...props}
      />
    </View>
  );
};

export default SharedLists;

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    minHeight: 300,
    width: '100%',
    rowGap: 16
  },
  flatListContentContainer: {
    flex: 1,
    columnGap: 16,
    paddingBottom: 16
  },
  emptyStateContainer: {
    width: Dimensions.get('window').width - 16 * 2
  },
  sectionTitle: {
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 60
  },
  headerComponentStyle: {
    paddingBottom: 14
  },
  headerContainer: {
    rowGap: 48
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  welcomeBackText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 20
  },
  usernameText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    textTransform: 'capitalize'
  },
  logo: {
    height: 40,
    width: 36
  }
});
