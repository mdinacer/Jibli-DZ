import { Collaborator } from '@/models/Collaborator';
import collaboratorService from '@/services/collaborator-service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CollaboratorStoreState {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  collaborators: Collaborator[];
  setLoadingStatus: (isLoading: boolean, isLoaded?: boolean) => void;
  fetchCollaborators: (ids: string[]) => Promise<void>;
  fetchCollaboratorById: (id: string) => Promise<Collaborator | undefined>;
  fetchCollaboratorByEmail: (email: string) => Promise<void>;
  getCollaborator: (id: string) => Collaborator | undefined;
  setCollaborators: (collaborators: Collaborator[]) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (id: string, data: Partial<Collaborator>) => void;
  removeCollaborator: (id: string) => void;
}

const initialState: Pick<
  CollaboratorStoreState,
  'collaborators' | 'loaded' | 'loading' | 'error'
> = {
  collaborators: [],
  loaded: false,
  loading: false,
  error: null
};

export const useCollaboratorStore = create<CollaboratorStoreState>()(
  devtools((set, get) => ({
    ...initialState,

    // Sets the loading status
    setLoadingStatus: (isLoading: boolean, isLoaded = get().loaded) =>
      set({ loading: isLoading, loaded: isLoaded }, false, 'setLoadingStatus'),

    // Fetches a list of collaborators by their IDs
    fetchCollaborators: async (ids: string[]) => {
      set({ loading: true }, false, 'fetchCollaborators/start');

      try {
        const collaborators =
          (await collaboratorService.getCollaboratorsByIds(ids)) || [];
        set(
          { collaborators, loaded: true, loading: false },
          false,
          'fetchCollaborators/success'
        );
      } catch {
        set(
          {
            error: 'Error fetching collaborators',
            loading: false,
            loaded: true
          },
          false,
          'fetchCollaborators/error'
        );
      }
    },

    // Fetches a collaborator by ID and updates the store
    fetchCollaboratorById: async (id: string) => {
      set({ loading: true, error: null }, false, 'fetchCollaboratorById/start');

      try {
        const collaborator = await collaboratorService.getCollaboratorById(id);
        if (collaborator) {
          set(
            (state) => ({
              collaborators: state.collaborators.some((c) => c.userId === id)
                ? state.collaborators.map((c) =>
                    c.userId === id ? collaborator : c
                  )
                : [...state.collaborators, collaborator],
              loading: false,
              loaded: true
            }),
            false,
            'fetchCollaboratorById/success'
          );
          return collaborator;
        } else {
          set(
            { error: 'Collaborator not found', loading: false, loaded: true },
            false,
            'fetchCollaboratorById/notFound'
          );
          return undefined;
        }
      } catch {
        set(
          {
            error: 'Error fetching collaborator by ID',
            loading: false,
            loaded: true
          },
          false,
          'fetchCollaboratorById/error'
        );
        return undefined;
      }
    },

    // Fetches a collaborator by email and updates the store
    fetchCollaboratorByEmail: async (email: string) => {
      set(
        { loading: true, error: null },
        false,
        'fetchCollaboratorByEmail/start'
      );

      try {
        const collaborator =
          await collaboratorService.getCollaboratorByEmail(email);
        if (collaborator) {
          set(
            (state) => ({
              collaborators: state.collaborators.some(
                (c) => c.userId === collaborator.userId
              )
                ? state.collaborators.map((c) =>
                    c.userId === collaborator.userId ? collaborator : c
                  )
                : [...state.collaborators, collaborator],
              loading: false,
              loaded: true
            }),
            false,
            'fetchCollaboratorByEmail/success'
          );
        } else {
          set(
            { error: 'Collaborator not found', loading: false, loaded: true },
            false,
            'fetchCollaboratorByEmail/notFound'
          );
        }
      } catch {
        set(
          {
            error: 'Error fetching collaborator by email',
            loading: false,
            loaded: true
          },
          false,
          'fetchCollaboratorByEmail/error'
        );
      }
    },

    // Sets the entire list of collaborators
    setCollaborators: (collaborators: Collaborator[]) => {
      set({ collaborators });
    },

    // Gets a collaborator by ID
    getCollaborator: (id: string) => {
      return get().collaborators.find((c) => c.userId === id);
    },

    // Adds a new collaborator to the store
    addCollaborator: (collaborator: Collaborator) => {
      set(
        (state) => ({
          collaborators: [...state.collaborators, collaborator]
        }),
        false,
        'addCollaborator'
      );
    },

    // Updates an existing collaborator
    updateCollaborator: (id: string, data: Partial<Collaborator>) => {
      set(
        (state) => ({
          collaborators: state.collaborators.map((c) =>
            c.userId === id ? { ...c, ...data } : c
          )
        }),
        false,
        'updateCollaborator'
      );
    },

    // Removes a collaborator from the store
    removeCollaborator: (id: string) => {
      set(
        (state) => ({
          collaborators: state.collaborators.filter((c) => c.userId !== id)
        }),
        false,
        'removeCollaborator'
      );
    }
  }))
);
