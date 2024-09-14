import { CardTitle } from '@/components/Card';
import AccountDelete from '@/components/profile/AccountDelete';
import ProfilePictureUpdater from '@/components/profile/ProfilePictureUpdater';
import UserEmailEdit from '@/components/profile/UserEmailEdit';
import UserNameField from '@/components/profile/UserNameField';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="p-6" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="relative" style={{ flex: 1, rowGap: 20 }}>
            <CardTitle>Account</CardTitle>
            <ProfilePictureUpdater />
            <UserNameField />
            <UserEmailEdit />
            <AccountDelete />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
