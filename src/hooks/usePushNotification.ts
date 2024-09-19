import firebaseServices from '@/config/firebaseConfig';
import PushNotificationsService from '@/services/PushNotificationsService';
import { set } from 'date-fns';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export interface PushNotificationsState {
  notification?: Notifications.Notification;
  expoPushToken: Notifications.ExpoPushToken | null;
}
export default function usePushNotification(): PushNotificationsState {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowAlert: true
    })
  });

  const [expoPushToken, setExpoPushToken] =
    useState<Notifications.ExpoPushToken | null>(null);

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    let token: Notifications.ExpoPushToken | null = null;
    if (true) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return null;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      // Get the Expo push token
      token = await Notifications.getExpoPushTokenAsync({ projectId });

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C'
        });
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  const setupToken = async (token: Notifications.ExpoPushToken | null) => {
    setExpoPushToken(token);
    const user = firebaseServices.auth.currentUser;
    if (!user || !token) {
      return;
    }
    console.log('Push token:', token);

    // Get and update token if needed
    await PushNotificationsService.updateTokenIfNeeded(user.uid);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(setupToken);

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Listener for notification responses (when user interacts with notification)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    expoPushToken,
    notification
  };
}
