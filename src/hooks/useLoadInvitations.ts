import { useInvitationStore } from '@/stores/useInvitationStore';
import { useCallback, useEffect } from 'react';

export default function useLoadInvitations() {
  const { invitations, loaded, loading, error, fetchInvitations } =
    useInvitationStore();

  const handleLoadInvitations = useCallback(async () => {
    await fetchInvitations();
  }, [fetchInvitations]);

  useEffect(() => {
    if (!loading && !loaded && !error) {
      handleLoadInvitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loaded, error]);

  return {
    handleLoadInvitations,
    invitations,
    loading
  };
}
