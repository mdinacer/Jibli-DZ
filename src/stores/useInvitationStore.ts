import { Invitation, InvitationInput } from '@/models/Invitation';
import invitationService from '@/services/InvitationService';
import { create } from 'zustand';

interface InvitationState {
  invitations: Invitation[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  addInvitation: (invitation: Invitation) => void;
  fetchInvitations: () => Promise<void>;
  fetchInvitation: (invitationId: string) => Promise<void>;
  setInvitations: (invitations: Invitation[]) => void;
  createInvitation: (invitation: InvitationInput) => Promise<void>;
  updateInvitation: (
    invitationId: string,
    status: 'accepted' | 'rejected'
  ) => Promise<void>;
  removeInvitation: (invitationId: string) => Promise<void>;
  deleteInvitation: (invitation: Invitation) => Promise<void>;
  setLoadingStatus: (status: {
    isLoading: boolean;
    isLoaded: boolean;
    error?: string | null;
  }) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  invitations: [],
  loading: false,
  loaded: false,
  error: null,
  addInvitation: (invitation: Invitation) => {
    set((state) => ({
      invitations: [...state.invitations, invitation]
    }));
  },
  fetchInvitation: async (invitationId: string) => {
    set({ loading: true, error: null });
    try {
      const invitation =
        await invitationService.fetchInvitationById(invitationId);
      if (!invitation) {
        set({ loading: false, loaded: true });
        return;
      }
      set((state) => ({
        invitations: [...state.invitations, invitation],
        loading: false,
        loaded: true
      }));
    } catch (error: any) {
      set({
        error: error.message,
        loading: false,
        loaded: true
      });
    }
  },
  fetchInvitations: async () => {
    set({ loading: true, error: null });
    try {
      const invitations = await invitationService.fetchCurrentUserInvitations();
      set({ invitations, loading: false, loaded: true });
    } catch (error: any) {
      set({ error: error.message, loading: false, loaded: true });
    }
  },
  setInvitations: (invitations) => set({ invitations }, false),
  createInvitation: async (invitation: InvitationInput) => {
    set({ loading: true, error: null });
    try {
      const createdInvitation =
        await invitationService.createInvitation(invitation);
      set((state) => ({
        invitations: [...state.invitations, createdInvitation],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateInvitation: async (
    invitationId: string,
    status: 'accepted' | 'rejected'
  ) => {
    set({ loading: true, error: null });
    try {
      await invitationService.updateInvitation(invitationId, status);
      set((state) => ({
        invitations: state.invitations.map((invitation) =>
          invitation.id === invitationId
            ? { ...invitation, status }
            : invitation
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  removeInvitation: async (invitationId: string) => {
    set({ loading: true, error: null });
    try {
      set((state) => ({
        invitations: state.invitations.filter(
          (invitation) => invitation.id !== invitationId
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteInvitation: async (invitation: Invitation) => {
    set({ loading: true, error: null });
    try {
      await invitationService.deleteInvitation(invitation);
      set((state) => ({
        invitations: state.invitations.filter(
          (invitation) => invitation.id !== invitation.id
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  setLoadingStatus: (status) =>
    set({
      loading: status.isLoading,
      loaded: status.isLoaded,
      error: status.error || null
    })
}));
