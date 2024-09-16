import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import CustomError from '@/utils/CustomError';
import { Collaborator } from '@/models/Collaborator';
import { List } from '@/models/List';
import { Profile } from '@/models/Profile';
import {
  FirebaseFirestoreTypes,
  and,
  arrayRemove,
  arrayUnion,
  where
} from '@react-native-firebase/firestore';

// Firestore collection reference for user profiles
const collaboratorsCollection = firebaseServices.firestore.collection(
  Collections.PROFILES
) as FirebaseFirestoreTypes.CollectionReference<Profile>;

// Helper function to get the current user
function getCurrentUser() {
  const user = firebaseServices.auth.currentUser;
  if (!user) {
    throw new CustomError('User not found', 'USER_NOT_FOUND');
  }
  return user;
}

// Helper function to get a Firestore reference to a profile
async function getProfileRefById(uid: string) {
  return collaboratorsCollection.doc(uid);
}

// Helper function to convert Profile to Collaborator
function ProfileToCollaborator(profile: Profile): Collaborator {
  return {
    username: profile.username,
    userId: profile.uid,
    email: profile.email,
    picture: profile.picture?.fileUrl
  };
}

// Get collaborators by their IDs
async function getCollaboratorsByIds(
  collaboratorsIds: string[]
): Promise<Collaborator[] | undefined> {
  try {
    if (collaboratorsIds.length === 0) return [];

    const user = getCurrentUser();

    const collaboratorsQuery = firebaseServices.firestore
      .collection(Collections.PROFILES)
      .where('__name__', 'in', collaboratorsIds)
      .where('collaborators', 'array-contains', user.uid);

    const querySnapshot = await collaboratorsQuery.get();

    if (querySnapshot.empty) {
      console.warn('No matching profiles found for ids:', collaboratorsIds);
      return undefined;
    }

    const profiles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Profile[];

    return profiles.map(ProfileToCollaborator);
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Error getting collaborators',
      'GET_COLLABORATORS_FAILED'
    );
  }
}

// Get collaborator by email
async function getCollaboratorByEmail(
  email: string
): Promise<Collaborator | undefined> {
  try {
    getCurrentUser();

    const profilesQuery = firebaseServices.firestore
      .collection(Collections.PROFILES)
      .where('email', '==', email);

    const querySnapshot = await profilesQuery.get();

    if (querySnapshot.empty) {
      console.warn('No matching profile found for email:', email);
      return undefined;
    }

    const profileDoc = querySnapshot.docs[0];
    return ProfileToCollaborator({
      ...profileDoc.data(),
      id: profileDoc.id
    } as Profile);
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Unable to fetch user profile by email',
      'FETCH_PROFILE_BY_EMAIL_FAILED'
    );
  }
}

// Get collaborator by ID
async function getCollaboratorById(
  uid: string
): Promise<Collaborator | undefined> {
  try {
    getCurrentUser();

    const profileRef = await getProfileRefById(uid);
    const profileDoc = await profileRef.get();

    if (profileDoc.exists) {
      return ProfileToCollaborator({
        ...profileDoc.data(),
        id: profileDoc.id
      } as Profile);
    } else {
      console.error('No such user with UID:', uid);
      return undefined;
    }
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Error fetching user by UID',
      'FETCH_USER_BY_UID_FAILED'
    );
  }
}

// Get reference to current user's profile document
async function getCurrentUserProfileRef() {
  try {
    const user = getCurrentUser();

    const profilesQuery = firebaseServices.firestore
      .collection(Collections.PROFILES)
      .where('uid', '==', user.uid);

    const querySnapshot = await profilesQuery.get();

    if (querySnapshot.empty) {
      throw new CustomError('User profile not found', 'USER_PROFILE_NOT_FOUND');
    }

    return firebaseServices.firestore
      .collection(Collections.PROFILES)
      .doc(querySnapshot.docs[0].id);
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Error getting current user profile reference',
      'GET_USER_PROFILE_REF_FAILED'
    );
  }
}

// Add a collaborator to the current user's profile
async function addCollaborator(collaboratorId: string) {
  try {
    const currentUserRef = await getCurrentUserProfileRef();
    await currentUserRef.update({
      collaborators: arrayUnion(collaboratorId)
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Failed to add collaborator',
      'ADD_COLLABORATOR_FAILED'
    );
  }
}

// Remove a collaborator from the current user's profile
async function removeCollaborator(collaboratorId: string) {
  try {
    const currentUserRef = await getCurrentUserProfileRef();
    await currentUserRef.update({
      collaborators: arrayRemove(collaboratorId)
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Failed to remove collaborator',
      'REMOVE_COLLABORATOR_FAILED'
    );
  }
}

// Revoke collaboration between the current user and a collaborator
async function revokeCollaboration(collaboratorUid: string) {
  const user = getCurrentUser();
  const batch = firebaseServices.firestore.batch();

  try {
    const currentUserRef = await getCurrentUserProfileRef();
    const collaboratorRef = await getProfileRefById(collaboratorUid);

    const currentUserSnapshot = await currentUserRef.get();
    if (!currentUserSnapshot.exists) {
      throw new CustomError(
        'Current user profile not found',
        'CURRENT_USER_PROFILE_NOT_FOUND'
      );
    }

    const collaboratorSnapshot = await collaboratorRef.get();
    if (!collaboratorSnapshot.exists) {
      throw new CustomError(
        'Collaborator profile not found',
        'COLLABORATOR_PROFILE_NOT_FOUND'
      );
    }

    // Update current user's collaborators
    batch.update(currentUserRef, {
      collaborators: arrayRemove(collaboratorUid)
    });

    // Update collaborator's collaborators
    batch.update(collaboratorRef, {
      collaborators: arrayRemove(user.uid)
    });

    // Get lists shared with the collaborator by the current user
    const collaboratorListsQuery = firebaseServices.firestore
      .collection(Collections.LISTS)
      .where('ownerId', '==', collaboratorUid)
      .where('collaborators', 'array-contains', user.uid);

    const collaboratorListsSnapshot = await collaboratorListsQuery.get();
    collaboratorListsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        collaborators: arrayRemove(user.uid)
      });
    });

    // Get lists shared with the current user by the collaborator
    const currentUserListsQuery = firebaseServices.firestore
      .collection(Collections.LISTS)
      .where('ownerId', '==', user.uid)
      .where('collaborators', 'array-contains', collaboratorUid);

    const currentUserListsSnapshot = await currentUserListsQuery.get();
    currentUserListsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        collaborators: arrayRemove(collaboratorUid)
      });
    });

    // Commit the batch
    await batch.commit();
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError(
      'Failed to revoke collaboration',
      'REVOKE_COLLABORATION_FAILED'
    );
  }
}

const collaboratorService = {
  getCollaboratorById,
  getCollaboratorsByIds,
  getCollaboratorByEmail,
  addCollaborator,
  removeCollaborator,
  revokeCollaboration,
  ProfileToCollaborator
};

export default collaboratorService;
