import AppButton from '@/components/AppButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { SignInFormData, SignInFormSchema } from '@/schemas/SingInFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
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

const SignIn = () => {
  const { t } = useTranslation('common', { keyPrefix: 'sign_in_form' });
  const { signInWithEmailPassword, handleAuthErrors, setUser } = useAuthStore();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: 'mdi.nacer@outlook.com',
      password: '12345678'
    }
  });

  const { control, handleSubmit, setError, reset } = form;

  const handleOnSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        const { email, password } = data;
        const user = await signInWithEmailPassword(email, password);
        setUser(user);
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
    [handleAuthErrors, reset, setError, setUser, signInWithEmailPassword]
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView className="flex-grow p-6">
          <View className="mb-8">
            <Text className="mb-2 text-2xl font-semibold text-foreground">
              {t('title')}
            </Text>
          </View>

          <View style={{ rowGap: 16 }} className="mb-8">
            <InputField
              name="email"
              label={t('fields.username.label')}
              control={control}
              placeholder={t('fields.username.placeholder')}
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
            <AppButton onPress={handleSubmit(handleOnSubmit)}>
              {t('submit_button')}
            </AppButton>
            <GoogleAuthButton />
          </View>

          <View
            style={{ columnGap: 8 }}
            className="mt-4 flex-row items-center justify-center"
          >
            <Text className="text-base text-foreground">
              {t('no_account_prompt')}
            </Text>
            <Link
              className="text-base text-foreground underline"
              href={'/sign-up'}
            >
              {t('no_account_link')}
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
