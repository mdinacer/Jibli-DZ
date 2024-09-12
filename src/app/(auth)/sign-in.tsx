import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { SignInFormData, SignInFormSchema } from '@/schemas/SingInFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Form, H4, Spinner, Text, XStack, YStack } from 'tamagui';

const SignIn = () => {
  const { signInWithEmailPassword, handleAuthErrors, setUser } = useAuthStore();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: 'mdi.nacer@outlook.com',
      password: '12345678'
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
        <H4>Login to JIBLI</H4>

        <YStack width={'100%'} gap="$4">
          <InputField
            id={'signInEmail'}
            name="email"
            label="Email"
            control={control}
            placeholder="Type your email"
          />
          <InputField
            id={'signInPassword'}
            name="password"
            label="Password"
            control={control}
            placeholder="Password"
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
              Sign In
            </Button>
          </Form.Trigger>

          <GoogleAuthButton action="signIn" />
        </YStack>

        <XStack marginTop="$8" columnGap="$2" alignItems="center">
          <Text> Don&apos;t have account?</Text>
          <Link href={'/sign-up'}>Sign Up!</Link>
        </XStack>
      </Form>
    </SafeAreaView>
  );
};

export default SignIn;
