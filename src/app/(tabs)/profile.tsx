import { CardTitle } from '@/components/Card';
import IconButton from '@/components/IconButton';
import AccountDelete from '@/components/profile/AccountDelete';
import ListNameEdit from '@/components/profile/ListNameEdit';
import ProfilePictureUpdater from '@/components/profile/ProfilePictureUpdater';
import UserEmailEdit from '@/components/profile/UserEmailEdit';
import UserNameField from '@/components/profile/UserNameField';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import firebaseServices from '@/config/firebaseConfig';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

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

  const theme = useThemeColor({}) as ThemeType;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            paddingBottom: 40
          }}
        >
          <View style={{ flex: 1, rowGap: 20, position: 'relative' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <CardTitle>{t('my_account')}</CardTitle>
              <IconButton
                onPress={handleSignOut}
                icon={Icons.LogoutIcon}
                iconStyles={{
                  height: 24,
                  width: 24,
                  color: theme.destructiveForeground
                }}
                style={{
                  backgroundColor: theme.destructive,
                  height: 40,
                  width: 40,
                  borderRadius: 9999,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
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
