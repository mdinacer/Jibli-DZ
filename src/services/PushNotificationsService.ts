import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import {
  TokenPushNotification,
  UserPushNotification,
  UsersPushNotification
} from '@/models/PushNotification';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

// Function to get the Expo push token
async function getExpoPushToken(): Promise<string | null> {
  let token = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }

  if (true) {
    // Device.isDevice

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

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      // Get the Expo push token
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (error: any) {
      token = `${error.message}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  console.log('Generated token: ', token);

  return token;
}

// Function to check if the token is already saved in Firestore
async function isTokenSaved(userId: string, token: string): Promise<boolean> {
  const docRef = firebaseServices.firestore
    .collection(Collections.TOKENS)
    .doc(userId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    const savedToken = docSnap.data()?.expoPushToken;
    return savedToken === token;
  }
  return false;
}

// Function to check if the token is already saved in Firestore
async function getSavedToken(userId: string): Promise<string | null> {
  const docRef = firebaseServices.firestore
    .collection(Collections.TOKENS)
    .doc(userId); //doc(firestore, 'users', userId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data()?.expoPushToken || null;
  }
  return null;
}

// Function to save the token in Firestore if it's new
async function saveTokenToFirestore(userId: string, token: string) {
  const tokenAlreadySaved = await isTokenSaved(userId, token);

  if (!tokenAlreadySaved) {
    const userRef = firebaseServices.firestore
      .collection(Collections.TOKENS)
      .doc(userId);
    await userRef.set({ expoPushToken: token, uid: userId }, { merge: true });
  } else {
    console.log('Token already exists in Firestore');
  }
}

// Register for notifications and persist the token in Firestore
async function registerForPushNotifications(userId: string) {
  const token = await getExpoPushToken();
  if (token) {
    await saveTokenToFirestore(userId, token);
  }
}

async function updateTokenIfNeeded(userId: string) {
  const currentToken = await getExpoPushToken();
  const savedToken = await getSavedToken(userId);

  // If the token is new or has changed, update Firestore
  if (currentToken && currentToken !== savedToken) {
    await saveTokenToFirestore(userId, currentToken);
    console.log('Token updated in Firestore');
  } else {
    console.log('Token is already up to date');
  }
}

async function sendPushNotification(notificationData: TokenPushNotification) {
  const { token, title, body, data } = notificationData;
  const message = {
    to: token,
    sound: 'default',
    title,
    body,
    data
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function sendNotificationToUser(notificationData: UserPushNotification) {
  const { userId, title, body, data } = notificationData;
  const token = await getSavedToken(userId);

  if (token) {
    await sendPushNotification({ token, title, body, data });
  } else {
    console.error('No push token found for user:', userId);
  }
}

async function sendNotificationToUsers(
  notificationData: UsersPushNotification
) {
  const { userIds, title, body, data } = notificationData;
  // Fetch tokens for all userIds
  const tokenPromises = userIds.map(
    async (userId) => await getSavedToken(userId)
  );
  const tokens = await Promise.all(tokenPromises);

  // Remove null tokens
  const validTokens = tokens.filter((token) => token !== null) as string[];

  console.log('validTokens', validTokens);

  if (validTokens.length > 0) {
    // Send notification to each token
    for (const token of validTokens) {
      await sendPushNotification({ token, title, body, data });
    }
  } else {
    console.error('No valid push tokens found');
  }
}

const PushNotificationsService = {
  getToken: getExpoPushToken,
  getSavedToken,
  register: registerForPushNotifications,
  save: saveTokenToFirestore,
  isSaved: isTokenSaved,
  updateTokenIfNeeded,
  send: sendNotificationToUser,
  multicast: sendNotificationToUsers
};

export default PushNotificationsService;
