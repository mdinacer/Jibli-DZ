import PendingItemsLists from '@/components/pendingItems/PendingItemsLists';
import SharedLists from '@/components/sharedList/SharedLists';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import Text from '@/components/Themed/Text';
import UserListDisplay from '@/components/userList/UserListDisplay';
import { Images } from '@/constants';
import { useProfileStore } from '@/stores/useProfileStore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import {} from 'react-native-safe-area-context';

const Index = () => {
  const { profile } = useProfileStore();
  //usePushNotification();
  const { t } = useTranslation('common');

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      {/* <LanguageSelector /> */}

      <PendingItemsLists
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponentStyle={styles.headerComponentStyle}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <View style={{ rowGap: 4 }}>
                <Text style={styles.welcomeBackText}>
                  {t('welcome_back', { keyPrefix: 'home' })}
                </Text>
                <Text style={styles.usernameText}>{profile?.username}</Text>
              </View>

              {/* <View>
                <Image
                  source={Images.logoSmall}
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View> */}
            </View>
            <UserListDisplay />
            <SharedLists horizontal />
            <Text muted style={styles.sectionTitle}>
              {t('pending_item_many')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
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
  },
  sectionTitle: {
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24
  }
});

const stylesd = StyleSheet.create({
  smallText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 20
  },
  largeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    textTransform: 'capitalize'
  },
  sectionTitle: {
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24
  }
});
