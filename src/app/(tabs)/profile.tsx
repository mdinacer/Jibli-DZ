import AccountDelete from '@/components/profile/AccountDelete';
import EmailChangeCard from '@/components/profile/EmailChangeCard';
import EmailLinkCard from '@/components/profile/EmailLinkCard';
import ProfilePictureUpdater from '@/components/profile/ProfilePictureUpdater';
import UserEmailEdit from '@/components/profile/UserEmailEdit';
import UserNameField from '@/components/profile/UserNameField';
import { useProfileStore } from '@/stores/useProfileStore';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2, ScrollView, YStack } from 'tamagui';

const Profile = () => {
  const { profile } = useProfileStore();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <YStack flexGrow={1} padding="$6" gap="$4">
            <H2 paddingBottom="$4">Profile</H2>

            <ProfilePictureUpdater />
            <UserNameField />
            <UserEmailEdit />
            <AccountDelete />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
