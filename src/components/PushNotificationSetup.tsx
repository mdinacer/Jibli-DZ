import { usePushNotificationSetup } from '@/hooks/usePushNotificationSetup';
import * as Notifications from 'expo-notifications';
import { Text, View } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

const PushNotificationSetup = () => {
  const { notification, channels } = usePushNotificationSetup();

  return notification ? (
    <View>
      <Text>{JSON.stringify(notification, null, 2)}</Text>
      <Text>{JSON.stringify(channels, null, 2)}</Text>
    </View>
  ) : null;
};

export default PushNotificationSetup;
