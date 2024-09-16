import { useCollaboratorStore } from '@/stores/useCollaboratorStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useCallback, useEffect } from 'react';

export default function useLoadCollaborators() {
  const { profile } = useProfileStore();
  const { fetchCollaborators, loaded, loading, error, collaborators } =
    useCollaboratorStore();

  const handleLoadCollaborators = useCallback(async () => {
    if (!profile) return;
    await fetchCollaborators(profile.collaborators);
  }, [fetchCollaborators, profile]);

  useEffect(() => {
    if (!loading && !loaded && !error) {
      handleLoadCollaborators();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loaded, error, profile]);

  return { handleLoadCollaborators, collaborators };
}
