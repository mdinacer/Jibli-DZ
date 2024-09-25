import firebaseServices from '@/config/firebaseConfig';
import { Icons } from '@/constants';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';
import AppButton from '../AppButton';
import { useTranslation } from 'react-i18next';
import { GoogleIcon } from '@/assets/icons/GoogleIcon';

interface Props extends TouchableOpacityProps {
  onAuthenticated?: (user: FirebaseAuthTypes.User) => void;
}

const GoogleAuthButton: React.FC<Props> = ({ onAuthenticated, ...props }) => {
  const { t } = useTranslation('common', { keyPrefix: 'google_auth' });
  const handleGoogleAuthentication = useCallback(async () => {
    try {
      // Initiate the Google sign-in process
      GoogleSignin.configure({});
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
    <TouchableOpacity
      className="flex-row items-center justify-center space-x-2 rounded-lg bg-destructive px-4 py-2"
      onPress={handleGoogleAuthentication}
    >
      <Icons.GoogleIcon className="h-5 w-5 text-destructive-foreground" />
      <Text
        className={`font-pmedium text-base capitalize text-destructive-foreground`}
      >
        {t('sign_in')}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleAuthButton;
