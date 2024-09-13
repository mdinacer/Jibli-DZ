import CheckBoxField from '@/components/fields/CheckboxField';
import InputField from '@/components/fields/InputField';
import ImageUpload from '@/components/fileAsset/ImageUpload';
import { FileAsset } from '@/models/FileAsset';
import { ProfileCreateInput } from '@/models/Profile';
import {
  OnboardingProfileData,
  OnboardingProfileSchema
} from '@/schemas/OnboardingProfileSchema';
import AuthService from '@/services/AuthService';
import ProfileService from '@/services/ProfileService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const InitialProfileScreen = () => {
  const { user } = useAuthStore();
  const { profile, setProfile } = useProfileStore();
  const form = useForm<OnboardingProfileData>({
    resolver: zodResolver(OnboardingProfileSchema),
    defaultValues: {
      username: user?.displayName || '',
      listName: user?.displayName ? `${user?.displayName}'s List` : 'My List',
      picture: null
    }
  });

  const {
    control,
    formState: { isSubmitting, isLoading },
    handleSubmit,
    watch,
    reset
  } = form;

  const handleOnSubmit = useCallback(
    async (data: OnboardingProfileData) => {
      console.log(data, user);

      if (!user || !user.email) return;
      try {
        const { username, listName, picture, createList } = data;
        const profileCreateInput: ProfileCreateInput = {
          username,
          picture,
          email: user.email
        };

        const profile = await ProfileService.create(profileCreateInput);

        if (!profile) {
          return reset();
        }
        setProfile(profile);

        if (createList && listName) {
          // Create userList
        }

        router.push('/');
      } catch (error: any) {
        console.error(error);
      } finally {
        reset();
      }
    },
    [reset, setProfile, user]
  );

  const { createList } = watch();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <View>
            <Text>Create Your Profile</Text>

            <Controller<OnboardingProfileData>
              name={'picture'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <ImageUpload
                    fileUri={
                      (value as FileAsset)?.fileUrl || profile?.picture?.fileUrl
                    }
                    onUploadComplete={(asset: FileAsset) => {
                      onChange(asset);
                    }}
                  />
                </View>
              )}
            />

            <InputField
              control={control}
              name="username"
              label="Username"
              id="onBoardingUsername"
            />

            <View>
              <Text>Your List</Text>
              <CheckBoxField
                control={control}
                name="createList"
                label="Create List"
              />

              <InputField
                readOnly={!createList}
                control={control}
                name="listName"
                label="List Name"
                id="onBoardingListName"
              />
            </View>
            <Button title="Create" />

            <Button
              title="Sing Out"
              onPress={() => AuthService.signOut()}
            ></Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InitialProfileScreen;
