import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { SignInFormData, SignInFormSchema } from '@/schemas/SingInFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View>
        <Text>Login to JIBLI</Text>

        <View>
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
        </View>

        <View>
          <TouchableOpacity>Sign In</TouchableOpacity>

          <GoogleAuthButton action="signIn" />
        </View>

        <View>
          <Text> Don&apos;t have account?</Text>
          <Link href={'/sign-up'}>Sign Up!</Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
