import AppButton from '@/components/AppButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { CardDescription, CardTitle } from '@/components/Card';
import InputField from '@/components/fields/InputField';
import { SignInFormData, SignInFormSchema } from '@/schemas/SingInFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
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
    <SafeAreaView className="flex-1 justify-center p-6">
      <View style={{ rowGap: 32 }} className=" ">
        <View>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </View>

        <View style={{ rowGap: 16 }} className="">
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

        <View className="gap-y-2">
          <AppButton onPress={handleSubmit(handleOnSubmit)}>
            {t('submit_button')}
          </AppButton>

          <GoogleAuthButton />
        </View>

        <View className="flex-row items-center justify-center space-x-2">
          <Text className="font-pregular text-base">
            {t('no_account_prompt')}
          </Text>
          <Link
            className="font-pregular text-base underline underline-offset-2"
            href={'/sign-up'}
          >
            {t('no_account_link')}
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
