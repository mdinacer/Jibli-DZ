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
import { useToastController } from '@tamagui/toast';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Form,
  H2,
  H4,
  ScrollView,
  Separator,
  Spinner,
  Stack,
  useTheme
} from 'tamagui';

const InitialProfileScreen = () => {
  const theme = useTheme();
  const toast = useToastController();
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
          toast.show("Couldn't create profile", {
            description: 'Please try again later.',
            color: 'danger'
          });
          return reset();
        }
        setProfile(profile);

        if (createList && listName) {
          // Create userList
        }

        router.push('/');
      } catch (error: any) {
        toast.show("Couldn't create profile", {
          description: error.message,
          color: 'danger'
        });
      } finally {
        reset();
      }
    },
    [reset, setProfile, toast, user]
  );

  const { createList } = watch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <Form
            flex={1}
            justifyContent="center"
            minWidth={300}
            onSubmit={handleSubmit(handleOnSubmit)}
            backgroundColor="$background"
            paddingHorizontal="$8"
            paddingVertical="$4"
            rowGap="$4"
          >
            <H2 paddingBottom="$4">Create Your Profile</H2>

            <Controller<OnboardingProfileData>
              name={'picture'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Stack width={'80%'} marginHorizontal="auto" aspectRatio={1}>
                  <ImageUpload
                    fileUri={
                      (value as FileAsset)?.fileUrl || profile?.picture?.fileUrl
                    }
                    onUploadComplete={(asset: FileAsset) => {
                      onChange(asset);
                    }}
                  />
                </Stack>
              )}
            />

            <InputField
              control={control}
              name="username"
              label="Username"
              id="onBoardingUsername"
            />
            <Separator marginVertical={15} />
            <Stack>
              <H4>Your List</H4>
              <CheckBoxField
                control={control}
                name="createList"
                label="Create List"
                id={'onBoardingCreateList'}
              />

              <InputField
                readOnly={!createList}
                control={control}
                name="listName"
                label="List Name"
                id="onBoardingListName"
              />
              <Separator marginVertical={15} />
            </Stack>
            <Form.Trigger asChild disabled={isLoading || isSubmitting}>
              <Button
                width={'100%'}
                icon={isSubmitting ? () => <Spinner /> : undefined}
              >
                Create
              </Button>
            </Form.Trigger>

            <Button width={'100%'} onPress={() => AuthService.signOut()}>
              Sing Out
            </Button>
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InitialProfileScreen;
