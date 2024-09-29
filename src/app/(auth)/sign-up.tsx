import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { Button } from '@/components/Themed/Button';
import Link from '@/components/Themed/Link';
import SafeAreaView from '@/components/Themed/SafeAreaView';
import Text from '@/components/Themed/Text';
import { SignUpFormData, SignUpFormSchema } from '@/schemas/SingUpFormSchema';
import ProfileService from '@/services/ProfileService';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

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
    <SafeAreaView edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t('title')}</Text>
          </View>

          <View style={styles.inputContainer}>
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

          <View style={styles.buttonContainer}>
            <Button
              disabled={isSubmitting}
              onPress={handleSubmit(handleOnSubmit)}
            >
              {t('submit_button')}
            </Button>
            <GoogleAuthButton />
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.prompt}>{t('has_account_prompt')}</Text>
            <Link href={'/sign-in'}>{t('has_account_link')}</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  scrollView: {
    flexGrow: 1,
    padding: 24
  },
  titleContainer: {
    marginBottom: 16
  },
  title: {
    marginBottom: 8,
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Poppins-SemiBold'
  },
  inputContainer: {
    marginBottom: 24,
    rowGap: 16
  },
  buttonContainer: {
    marginBottom: 16,
    rowGap: 16
  },
  linkContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 8
  },
  prompt: {
    fontSize: 14
  },
  link: {
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

export default SignUp;
