import { useColorScheme } from 'react-native';

export function Provider({ children }: React.PropsWithChildren) {
  const colorScheme = useColorScheme();

  return <>{children}</>;
}
