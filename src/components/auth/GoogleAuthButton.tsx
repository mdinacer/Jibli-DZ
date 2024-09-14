import firebaseServices from '@/config/firebaseConfig';
import { Icons } from '@/constants';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { TouchableOpacityProps } from 'react-native';
import AppButton from '../AppButton';

interface Props extends TouchableOpacityProps {
  action: 'signUp' | 'signIn';
  onAuthenticated?: (user: FirebaseAuthTypes.User) => void;
}

const GoogleAuthButton: React.FC<Props> = ({
  action,
  onAuthenticated,
  ...props
}) => {
  const handleGoogleAuthentication = useCallback(async () => {
    try {
      // Initiate the Google sign-in process
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data) return;

      // Create a Firebase credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.data.idToken
      );

      // Sign in to Firebase with the credential
      const userCredentials =
        await firebaseServices.auth.signInWithCredential(googleCredential);

      const { user } = userCredentials;

      onAuthenticated?.(user);

      router.push('/home');

      console.info('User signed in with Google');
    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
    }
  }, [onAuthenticated]);

  return (
    <AppButton
      icon={Icons.GoogleIcon}
      className="flex-row items-center justify-center rounded-md bg-destructive px-4 py-2"
      {...props}
      iconStyles="text-white"
      onPress={handleGoogleAuthentication}
    >
      {` ${action === 'signUp' ? 'Sign Up' : 'Sign In'} with Google`}
    </AppButton>
  );
};

export default GoogleAuthButton;
