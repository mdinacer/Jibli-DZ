import { CardTitle } from '@/components/Card';
import IconButton from '@/components/IconButton';
import AccountDelete from '@/components/profile/AccountDelete';
import ListNameEdit from '@/components/profile/ListNameEdit';
import ProfilePictureUpdater from '@/components/profile/ProfilePictureUpdater';
import UserEmailEdit from '@/components/profile/UserEmailEdit';
import UserNameField from '@/components/profile/UserNameField';
import firebaseServices from '@/config/firebaseConfig';
import { Icons } from '@/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { t } = useTranslation('common');
  const { signOut } = useAuthStore();
  const { setProfile } = useProfileStore();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setProfile(null);
      await firebaseServices.firestore.clearPersistence();
    } catch (error) {
      console.error(error);
    }
  }, [setProfile, signOut]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="p-6"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          <View className="relative" style={{ flex: 1, rowGap: 20 }}>
            <View className="flex-row items-center justify-between">
              <CardTitle>{t('my_account')}</CardTitle>
              <IconButton
                onPress={handleSignOut}
                variant="destructive"
                icon={Icons.LogoutIcon}
                className=""
              />
            </View>
            <ProfilePictureUpdater />
            <UserNameField />
            <ListNameEdit />
            <UserEmailEdit />
            <AccountDelete />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
