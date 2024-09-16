import useLoadCollaborators from '@/hooks/useLoadCollaborators';
import useLoadLists from '@/hooks/useLoadLists';
import React from 'react';

interface Props {}

const DataLoader: React.FC<Props> = () => {
  useLoadLists();
  useLoadCollaborators();
  return null;
};

export default DataLoader;
