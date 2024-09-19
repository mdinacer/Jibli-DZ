import useLoadUserProfile from '@/hooks/useLoadUserProfile';
import { Text } from 'react-native';

const UserProfileLoader = () => {
  const { status } = useLoadUserProfile(); // Load user profile and set push notification token

  if (status !== 'idle') {
    return <Text>{status}</Text>;
  }
  return null;
};

export default UserProfileLoader;
