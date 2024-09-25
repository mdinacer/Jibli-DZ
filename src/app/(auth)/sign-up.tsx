import AppButton from '@/components/AppButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { SignUpFormData, SignUpFormSchema } from '@/schemas/SingUpFormSchema';
import ProfileService from '@/services/ProfileService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
  const { setProfile } = useProfileStore();
  const { t } = useTranslation('common', { keyPrefix: 'sign_up_form' });
  const { signUpWithEmailPassword, handleAuthErrors, setUser } = useAuthStore();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: 'nacer',
      email: 'mdi.nacer@outlook.com',
      password: '12345678'
    }
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    setError,
    reset
  } = form;

  const handleCreateNewProfile = useCallback(
    async (user: FirebaseAuthTypes.User, username: string) => {
      try {
        const createdProfile = await ProfileService.create({
          username: username,
          email: user.email!,
          picture: null
        });
        setProfile(createdProfile);
      } catch (error: any) {
        console.error(`Error creating new profile: ${error.message}`);
      }
    },
    [setProfile]
  );

  const handleOnSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        const { email, password } = data;
        const user = await signUpWithEmailPassword(email, password);
        setUser(user);
        await handleCreateNewProfile(user, data.username);
        reset();
        router.push('/');
      } catch (error: any) {
        console.error(error);
        // check if error is firebase auth error
        if (error.code) {
          const errorMessage = handleAuthErrors(error.code);
          setError('email', { message: errorMessage });
        }
      }
    },
    [
      handleAuthErrors,
      handleCreateNewProfile,
      reset,
      setError,
      setUser,
      signUpWithEmailPassword
    ]
  );

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView className="flex-grow p-6">
          <View className="mb-4">
            <Text className="mb-2 text-2xl font-semibold text-foreground">
              {t('title')}
            </Text>
          </View>

          <View style={{ rowGap: 16 }} className="mb-6">
            <InputField
              name="username"
              label={t('fields.username.label')}
              control={control}
              placeholder={t('fields.username.placeholder')}
            />
            <InputField
              name="email"
              label={t('fields.email.label')}
              control={control}
              placeholder={t('fields.email.placeholder')}
            />
            <InputField
              name="password"
              label={t('fields.password.label')}
              control={control}
              placeholder={t('fields.password.placeholder')}
              secureTextEntry
            />
          </View>

          <View className="mb-4" style={{ rowGap: 8 }}>
            <AppButton
              disabled={isSubmitting}
              onPress={handleSubmit(handleOnSubmit)}
            >
              {t('submit_button')}
            </AppButton>
            <GoogleAuthButton />
          </View>

          <View
            style={{ columnGap: 8 }}
            className="mt-4 flex-row items-center justify-center"
          >
            <Text className="font-pregular text-sm text-foreground">
              {t('has_account_prompt')}
            </Text>
            <Link
              className="font-pregular text-sm text-foreground underline"
              href={'/sign-in'}
            >
              {t('has_account_link')}
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
