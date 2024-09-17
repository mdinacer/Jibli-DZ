import LanguageSelector from '@/components/LanguageSelector';
import PendingItemsLists from '@/components/pendingItems/PendingItemsLists';
import SharedLists from '@/components/sharedList/SharedLists';
import UserListDisplay from '@/components/userList/UserListDisplay';
import { Images } from '@/constants';
import { useProfileStore } from '@/stores/useProfileStore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  const { profile } = useProfileStore();
  const { t } = useTranslation('common');

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <LanguageSelector />
      <PendingItemsLists
        ListHeaderComponent={
          <View className="pt-6" style={{ rowGap: 24 }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-pmedium text-sm">
                  {t('welcome_back', { keyPrefix: 'home' })}
                </Text>
                <Text className="font-psemibold text-2xl">
                  {profile?.username}
                </Text>
              </View>

              <View className="">
                <Image
                  source={Images.logoSmall}
                  resizeMode="contain"
                  className="h-10 w-9"
                />
              </View>
            </View>
            <UserListDisplay />
            <SharedLists horizontal />
            <Text className="mt-5 font-pregular text-base text-muted-foreground">
              {t('pending_item_many')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Index;
