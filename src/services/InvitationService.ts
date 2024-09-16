import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { Invitation, InvitationInput } from '@/models/Invitation';
import profileService from '@/services/ProfileService';
import {
  FirebaseFirestoreTypes,
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
  writeBatch
} from '@react-native-firebase/firestore';
import CustomError from '@/utils/CustomError';

const getCurrentUser = () => {
  const user = firebaseServices.auth.currentUser;
  if (!user) {
    const error = new CustomError(
      'Unauthenticated user',
      'UNAUTHENTICATED_USER'
    );
    error.logToCrashlytics();
    throw error;
  }
  return user;
};

async function fetchInvitations(
  queryRef: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
): Promise<Invitation[]> {
  const user = getCurrentUser();

  try {
    const querySnapshot = await getDocs(queryRef);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          isOwner: doc.data().senderId === user.uid
        }) as Invitation
    );
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to fetch invitations',
      'FETCH_INVITATIONS_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function fetchInvitationById(
  invitationId: string
): Promise<Invitation | undefined> {
  try {
    const invitationDocRef = doc(
      firebaseServices.firestore,
      Collections.INVITATIONS,
      invitationId
    );
    const invitationDoc = await getDoc(invitationDocRef);
    if (!invitationDoc.exists) {
      const customError = new CustomError(
        `Invitation with ID ${invitationId} not found.`,
        'INVITATION_NOT_FOUND'
      );
      customError.logToCrashlytics();
      return undefined;
    }
    return { id: invitationDoc.id, ...invitationDoc.data() } as Invitation;
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to fetch invitation by ID',
      'FETCH_INVITATION_BY_ID_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function fetchCurrentUserInvitations(): Promise<Invitation[]> {
  const user = getCurrentUser();

  try {
    const invitationsRef = collection(
      firebaseServices.firestore,
      Collections.INVITATIONS
    );
    const invitationsQuery = query(
      invitationsRef,
      or(
        where('senderId', '==', user.uid),
        where('recipientId', '==', user.uid)
      ),
      where('status', '==', 'pending')
    );

    return await fetchInvitations(invitationsQuery);
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to fetch current user invitations',
      'FETCH_CURRENT_USER_INVITATIONS_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function checkIfInvitationExists(
  senderId: string,
  recipientId: string
): Promise<boolean> {
  try {
    const invitationsRef = collection(
      firebaseServices.firestore,
      Collections.INVITATIONS
    );
    const senderInvitationsQuery = query(
      invitationsRef,
      where('senderId', '==', senderId),
      where('recipientId', '==', recipientId),
      where('status', '==', 'pending')
    );

    const querySnapshot = await getDocs(senderInvitationsQuery);
    return !querySnapshot.empty;
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to check for existing invitation',
      'CHECK_INVITATION_EXISTS_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function createInvitation(
  invitation: InvitationInput
): Promise<Invitation> {
  try {
    const { senderId, recipientId } = invitation;
    const recipient = await profileService.getByUserId(recipientId);
    if (!recipient) {
      const customError = new CustomError(
        'Recipient profile not found',
        'RECIPIENT_PROFILE_NOT_FOUND'
      );
      customError.logToCrashlytics();
      throw customError;
    }

    const invitationExists = await checkIfInvitationExists(
      senderId,
      recipientId
    );
    if (invitationExists) {
      const customError = new CustomError(
        'Invitation already exists for this recipient from the same sender.',
        'INVITATION_ALREADY_EXISTS'
      );
      customError.logToCrashlytics();
      throw customError;
    }

    const invitationsRef = collection(
      firebaseServices.firestore,
      Collections.INVITATIONS
    );
    const invitationData: Omit<Invitation, 'id' | 'isOwner'> = {
      ...invitation,
      status: 'pending',
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(invitationsRef, invitationData);
    return { id: docRef.id, ...invitationData, isOwner: true };
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to create invitation',
      'CREATE_INVITATION_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function updateInvitation(
  invitationId: string,
  status: 'accepted' | 'rejected'
): Promise<void> {
  try {
    const invitationRef = doc(
      firebaseServices.firestore,
      Collections.INVITATIONS,
      invitationId
    );
    await updateDoc(invitationRef, { status });
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to update invitation status',
      'UPDATE_INVITATION_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function deleteInvitation(invitation: Invitation): Promise<boolean> {
  const user = getCurrentUser();

  if (invitation.senderId !== user.uid && invitation.recipientId !== user.uid) {
    const customError = new CustomError(
      'You are not authorized to delete this invitation',
      'UNAUTHORIZED_DELETE'
    );
    customError.logToCrashlytics();
    throw customError;
  }

  try {
    const invitationRef = doc(
      firebaseServices.firestore,
      Collections.INVITATIONS,
      invitation.id
    );
    await deleteDoc(invitationRef);
    return true;
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to delete invitation',
      'DELETE_INVITATION_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

async function acceptInvitation(
  senderUserId: string,
  profileId: string
): Promise<void> {
  try {
    const user = getCurrentUser();

    const senderProfile = await profileService.getByUserId(senderUserId);
    if (!senderProfile) {
      const customError = new CustomError(
        'Sender profile not found',
        'SENDER_PROFILE_NOT_FOUND'
      );
      customError.logToCrashlytics();
      throw customError;
    }

    const batch = writeBatch(firebaseServices.firestore);

    const senderProfileRef = doc(
      firebaseServices.firestore,
      Collections.PROFILES,
      senderProfile.id
    );
    const recipientProfileRef = doc(
      firebaseServices.firestore,
      Collections.PROFILES,
      profileId
    );

    batch.update(senderProfileRef, {
      collaborators: arrayUnion(user.uid)
    });

    batch.update(recipientProfileRef, {
      collaborators: arrayUnion(senderProfile.uid)
    });

    await batch.commit();

    console.log(
      `Successfully added ${profileId} to ${senderProfile.username}'s collaborators and vice versa.`
    );
  } catch (error: any) {
    const customError = new CustomError(
      'Failed to accept invitation',
      'ACCEPT_INVITATION_FAILED',
      error
    );
    customError.logToCrashlytics();
    throw customError;
  }
}

const invitationService = {
  fetchCurrentUserInvitations,
  fetchInvitationById,
  createInvitation,
  updateInvitation,
  deleteInvitation,
  acceptInvitation
};

export default invitationService;
