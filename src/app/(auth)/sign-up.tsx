import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import InputField from '@/components/fields/InputField';
import { SignUpFormData, SignUpFormSchema } from '@/schemas/SingUpFormSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View>
        <Text>Sign Up to JIBLI</Text>

        <View>
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
        </View>

        <View>
          <Button title="Sign Up"></Button>
          <GoogleAuthButton action="signUp" />
        </View>

        <View>
          <Text>Already have an account?</Text>
          <Link href={'/sign-in'}>Sign In</Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
