import AppButton from '@/components/AppButton';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { CardDescription, CardTitle } from '@/components/Card';
import InputField from '@/components/fields/InputField';
import { SignUpFormData, SignUpFormSchema } from '@/schemas/SingUpFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
  const { t } = useTranslation('common', { keyPrefix: 'sign_up_form' });
  const { signUpWithEmailPassword, handleAuthErrors, setUser } = useAuthStore();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: 'nacer',
      email: 'mdi.nacer@outlook.com',
      password: '12345678',
      confirmPassword: '12345678'
    }
  });

  const {
    control,

    handleSubmit,
    setError,
    reset
  } = form;

  const handleOnSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        const { email, password } = data;
        const user = await signUpWithEmailPassword(email, password);
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
    [handleAuthErrors, reset, setError, setUser, signUpWithEmailPassword]
  );

  return (
    <SafeAreaView className="flex-1 justify-center p-6">
      <View style={{ rowGap: 32 }} className=" ">
        <View>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </View>

        <View style={{ rowGap: 16 }} className="">
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

          <InputField
            name="confirmPassword"
            label={t('fields.confirm_password.label')}
            control={control}
            placeholder={t('fields.confirm_password.placeholder')}
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
            {t('has_account_prompt')}
          </Text>
          <Link
            className="font-pregular text-base underline underline-offset-2"
            href={'/sign-in'}
          >
            {t('has_account_link')}
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
