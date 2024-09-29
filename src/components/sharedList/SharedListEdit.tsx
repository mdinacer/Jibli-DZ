import { CardHeader } from '@/components/Card';
import IconButton from '@/components/IconButton';
import CollaboratorItemDisplay from '@/components/item/CollaboratorItemDisplay';
import useSharedListEdit from '@/components/sharedList/useSharedListEdit';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { List } from '@/models/List';
import { ListItem } from '@/models/ListItem';
import { hslToRgb, parseHSL } from '@/utils/hslConverter';
import { Redirect } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface Props {
  listData: List;
}

const SharedListEdit: React.FC<Props> = ({ listData }) => {
  const theme = useThemeColor({}) as ThemeType;

  const rgbBackground = useMemo(() => {
    const rgbValues = parseHSL(theme.background);

    return rgbValues
      ? hslToRgb(rgbValues[0], rgbValues[1], rgbValues[2])
      : null;
  }, [theme.background]);

  const {
    isSaving,
    list,
    isModified,
    discardChanges,
    saveChanges,
    handleItemStatusChange
  } = useSharedListEdit(listData);

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
          data={list.items}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <CollaboratorItemDisplay
              item={item}
              onStatusChange={(status) => {
                handleItemStatusChange(item.id, status);
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
            disabled={!isModified || isSaving}
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
            icon={isModified ? Icons.CancelIcon : Icons.ArrowTurnBackwardIcon}
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

export default SharedListEdit;

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
