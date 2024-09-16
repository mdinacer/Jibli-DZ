import useInvitationsListener from '@/listeners/useInvitationsListener';
import useListCollaboratorsListener from '@/listeners/useListCollaboratorsListener';
import useListsListener from '@/listeners/useListsListener';
import React from 'react';

interface Props {}

const DataListeners: React.FC<Props> = () => {
  useListsListener();
  useListCollaboratorsListener();
  useInvitationsListener();
  return null;
};

export default DataListeners;
