import PushNotificationsService from '@/services/PushNotificationsService';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

// Custom hook to handle notification setup
export const usePushNotificationSetup = () => {
  const { user } = useAuthStore();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const setupNotifications = async (userId: string) => {
    // Get and update token if needed
    const token = await PushNotificationsService.getToken();
    if (token) {
      setExpoPushToken(token);
      await PushNotificationsService.updateTokenIfNeeded(userId);
    }
  };

  useEffect(() => {
    if (!user) return;
    const { uid: userId } = user;
    setupNotifications(userId);
  }, [user]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log(`Notification received: `, notification);
        Alert.alert('Notification received', JSON.stringify(notification));
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
  }, []);

  return {
    expoPushToken,
    notification,
    channels
  };
};
