import { CardHeader, CardTitle } from '@/components/Card';
import InputField from '@/components/fields/InputField';
import ImageUpload from '@/components/fileAsset/ImageUpload';
import { Button } from '@/components/Themed/Button';
import SafeAreaView from '@/components/Themed/SafeAreaView';
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
  View,
  StyleSheet
} from 'react-native';

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
    formState: { isSubmitting },
    handleSubmit,
    reset
  } = form;

  const handleOnSubmit = useCallback(
    async (data: OnboardingProfileData) => {
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

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.formContainer}>
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
            </CardHeader>

            <Controller<OnboardingProfileData>
              name="picture"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.imageUploadContainer}>
                  <ImageUpload
                    fileUri={
                      (value as FileAsset)?.fileUrl || profile?.picture?.fileUrl
                    }
                    onUploadComplete={(asset: FileAsset) => onChange(asset)}
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

            <View style={styles.buttonContainer}>
              <Button
                disabled={isSubmitting}
                onPress={handleSubmit(handleOnSubmit)}
              >
                {isSubmitting ? 'Saving...' : 'Create'}
              </Button>

              <Button
                disabled={isSubmitting}
                variant="destructive"
                onPress={() => AuthService.signOut()}
              >
                Sign Out
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InitialProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB' // Replace with theme background if available
  },
  flexContainer: {
    flex: 1
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16
  },
  formContainer: {
    rowGap: 16
  },
  imageUploadContainer: {
    aspectRatio: 1, // Makes the view a square
    width: '100%',
    borderRadius: 8 // Rounded corners
  },
  listSection: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Border color
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 16
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
    gap: 16 // Space between buttons
  }
});
