import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
//import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';

export const authInstance = auth();
export const firestoreInstance = firestore();
export const databaseInstance = database();
export const storageInstance = storage();
//export const messagingInstance = messaging();
export const crashlyticsInstance = crashlytics();

const hostIP = '172.20.10.4';

if (false) {
  authInstance.useEmulator(`http://${hostIP}:9099`);
  firestoreInstance.settings({
    persistence: false // disable offline persistence
  });
  firestoreInstance.useEmulator(hostIP, 8080);
  databaseInstance.useEmulator(hostIP, 9000);
  storageInstance.useEmulator(hostIP, 9199);
}

const firebaseServices = {
  auth: authInstance,
  firestore: firestoreInstance,
  database: databaseInstance,
  storage: storageInstance,
  //messaging: messagingInstance,
  crashlytics: crashlyticsInstance
};

export default firebaseServices;
