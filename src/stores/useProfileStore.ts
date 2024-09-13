import { Profile } from '@/models/Profile';
import ProfileService from '@/services/ProfileService';
import { create } from 'zustand';

interface ProfileStoreState {
  profile: Profile | null;
  loaded: boolean;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  setProfile: (profile: Profile | null) => void;
  reloadProfile: () => Promise<void>;
  setLoaded: (loaded: boolean) => void;
  setStatus: (status: 'idle' | 'pending' | 'success' | 'error') => void;
  updateProfile: (updates: Partial<Profile>) => void;
}

const initialStoreState: Pick<
  ProfileStoreState,
  'profile' | 'loaded' | 'status' | 'error'
> = {
  profile: null,
  loaded: false,
  status: 'idle',
  error: null
};

export const useProfileStore = create<ProfileStoreState>((set) => ({
  ...initialStoreState,

  setProfile: (profile: Profile | null) =>
    set({
      profile,
      loaded: true,
      status: profile ? 'success' : 'idle', // set status based on whether profile is set or not
      error: null
    }),

  updateProfile: (updates: Partial<Profile>) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null
    })),

  setStatus: (status: 'idle' | 'pending' | 'success' | 'error') =>
    set({
      status,
      loaded: status === 'success' || status === 'error' // set loaded to true if status is success or error
    }),

  setLoaded: (loaded: boolean) => set({ loaded }),

  reloadProfile: async () => {
    set({ status: 'pending', error: null });
    try {
      const profile = await ProfileService.getCurrent();
      set({
        profile,
        status: 'success',
        loaded: true
      });
    } catch (error: any) {
      set({
        status: 'error',
        error: error.message || 'Failed to load profile'
      });
    }
  }
}));
