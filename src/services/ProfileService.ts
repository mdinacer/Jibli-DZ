import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { Profile, ProfileCreateInput, UserRole } from '@/models/Profile';
import CustomError from '@/utils/CustomError';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  FirebaseFirestoreTypes,
  Timestamp
} from '@react-native-firebase/firestore';

// Firestore collection reference for user profiles
const profilesCollection = firebaseServices.firestore.collection(
  Collections.PROFILES
) as FirebaseFirestoreTypes.CollectionReference<Profile>;

function getCurrentUser(): FirebaseAuthTypes.User {
  const user = firebaseServices.auth.currentUser;
  if (!user) {
    throw new CustomError('User not logged in', 'USER_NOT_LOGGED_IN');
  }
  return user;
}

// Create a new profile and optionally an initial list
async function create(input: ProfileCreateInput): Promise<Profile> {
  try {
    const user = getCurrentUser();
    const uid = user.uid;

    const { username, email, picture } = input;

    const profileRef = firebaseServices.firestore
      .collection(Collections.PROFILES)
      .doc(user.uid);

    const profileData: Omit<Profile, 'id'> = {
      uid,
      username,
      email,
      collaborators: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      role: UserRole.both,
      picture: picture || null
    };

    await profileRef.set(profileData);

    // Fetch the newly created document snapshot
    const createdUserSnapshot = await profileRef.get();

    if (!createdUserSnapshot.exists) {
      throw new CustomError('Profile not created', 'PROFILE_NOT_CREATED');
    }

    return {
      id: createdUserSnapshot.id,
      ...createdUserSnapshot.data()
    } as Profile;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw error;
  }
}

// Update an existing user profile
async function update(
  profileId: string,
  updates: Partial<Profile>
): Promise<Profile | undefined> {
  try {
    const profileRef = profilesCollection.doc(profileId);

    await profileRef.update(updates);

    const updatedProfileSnapshot = await profileRef.get();

    return updatedProfileSnapshot.exists
      ? ({
          ...updatedProfileSnapshot.data(),
          id: updatedProfileSnapshot.id
        } as Profile)
      : undefined;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw error;
  }
}

// Update the current user's profile
async function updateCurrent(updates: Partial<Profile>) {
  try {
    const user = getCurrentUser();
    return await update(user.uid, updates);
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw error;
  }
}

// Get a profile by user ID
async function getByUserId(userId: string): Promise<Profile | undefined> {
  try {
    // Directly reference the document by userId
    const profileDoc = await profilesCollection.doc(userId).get();

    if (!profileDoc.exists) {
      return undefined; // No profile found for the given userId
    }

    const profileData = profileDoc.data();

    if (!profileData) {
      return undefined;
    }

    // Return the profile data, including the document ID
    return { ...profileData, id: profileDoc.id } as Profile;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Failed to fetch user profile by ID',
      'FETCH_PROFILE_FAILED'
    );
  }
}

// Get current user profile
async function getCurrent() {
  const { uid: userId } = getCurrentUser();
  return await getByUserId(userId);
}

const ProfileService = {
  create,
  update,
  updateCurrent,
  getByUserId,
  getCurrent
};

export default ProfileService;
