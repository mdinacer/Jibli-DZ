import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { SignUpFormData, SignUpFormSchema } from '@/schemas/SingUpFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Form, H4, Spinner, Text, XStack, YStack } from 'tamagui';

const SignUp = () => {
  const { signUpWithEmailPassword, handleAuthErrors, setUser } = useAuthStore();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: 'mdi.nacer@outlook.com',
      password: '12345678',
      confirmPassword: '12345678'
    }
  });

  const {
    control,
    formState: { isSubmitting, isLoading },
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
    <SafeAreaView style={{ flex: 1 }}>
      <Form
        flex={1}
        alignItems="center"
        justifyContent="center"
        minWidth={300}
        gap="$4"
        onSubmit={handleSubmit(handleOnSubmit)}
        borderWidth={1}
        borderRadius="$4"
        backgroundColor="$background"
        borderColor="$borderColor"
        padding="$8"
      >
        <H4>Sign Up to JIBLI</H4>

        <YStack width={'100%'} gap="$4">
          <InputField
            id={'signUpEmail'}
            name="email"
            label="Email"
            control={control}
            placeholder="Type your email"
          />
          <InputField
            id={'signUpPassword'}
            name="password"
            label="Password"
            control={control}
            placeholder="Password"
            secureTextEntry
          />

          <InputField
            id={'signUpConfirmPassword'}
            name="confirmPassword"
            label="Confirm Password"
            control={control}
            placeholder="Confirm Password"
            secureTextEntry
          />
        </YStack>

        <YStack width={'100%'} rowGap="$4">
          <Form.Trigger asChild disabled={isLoading || isSubmitting}>
            <Button
              theme={'active_Button'}
              width={'100%'}
              icon={isSubmitting ? () => <Spinner /> : undefined}
            >
              Sign Up
            </Button>
          </Form.Trigger>

          <GoogleAuthButton action="signUp" />
        </YStack>

        <XStack marginTop="$8" columnGap="$2" alignItems="center">
          <Text>Already have an account?</Text>
          <Link href={'/sign-in'}>Sign In</Link>
        </XStack>
      </Form>
    </SafeAreaView>
  );
};

export default SignUp;
