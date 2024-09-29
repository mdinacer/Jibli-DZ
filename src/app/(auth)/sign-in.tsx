import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { Button } from '@/components/Themed/Button';
import Link from '@/components/Themed/Link';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import Text from '@/components/Themed/Text';
import { SignInFormData, SignInFormSchema } from '@/schemas/SingInFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

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
    <SafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={{ flexGrow: 1, padding: 24 }}>
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                marginBottom: 8,
                fontFamily: 'Poppins-SemiBold',
                fontSize: 24,
                lineHeight: 32
              }}
            >
              {t('title')}
            </Text>
          </View>

          <View style={{ rowGap: 16, marginBottom: 32 }}>
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

          <View style={{ rowGap: 8, marginBottom: 16 }}>
            <Button onPress={handleSubmit(handleOnSubmit)}>
              {t('submit_button')}
            </Button>
            <GoogleAuthButton />
          </View>

          <View
            style={{
              columnGap: 8,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text>{t('no_account_prompt')}</Text>
            <Link href={'/sign-up'}>{t('no_account_link')}</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
