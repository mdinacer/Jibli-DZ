import firebaseServices from '@/config/firebaseConfig';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonProps } from 'react-native';
import { Button } from '../Themed/Button';

interface Props extends ButtonProps {
  onAuthenticated?: (user: FirebaseAuthTypes.User) => void;
}

const GoogleAuthButton: React.FC<Props> = ({ onAuthenticated, ...props }) => {
  const theme = useThemeColor({}) as ThemeType;
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
    <Button
      variant="destructive"
      icon={Icons.GoogleIcon}
      iconStyles={{
        height: 20,
        width: 20,
        color: theme.destructiveForeground
      }}
      onPress={handleGoogleAuthentication}
      {...props}
    >
      {t('sign_in')}
    </Button>
  );
};

export default GoogleAuthButton;
