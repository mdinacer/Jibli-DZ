import AppButton from '@/components/AppButton';
import { CardContent, CardHeader, CardTitle } from '@/components/Card';
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
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-4">
          <View style={{ rowGap: 16 }}>
            <CardHeader className="">
              <CardTitle>Create Your Profile</CardTitle>
            </CardHeader>

            <Controller<OnboardingProfileData>
              name={'picture'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <View className="aspect-square w-full rounded-lg">
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

            {/* <View className="rounded-md border-y border-border py-4">
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
            </View> */}

            <View className="w-full gap-y-4 pt-10">
              <AppButton
                disabled={isSubmitting}
                onPress={handleSubmit(handleOnSubmit)}
              >
                {isSubmitting ? 'Saving...' : 'Create'}
              </AppButton>

              <AppButton
                disabled={isSubmitting}
                variant="destructive"
                onPress={() => AuthService.signOut()}
              >
                Sing Out
              </AppButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InitialProfileScreen;
