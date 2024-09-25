import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

export default function useAppearanceListener() {
  const { colorScheme, setColorScheme } = useColorScheme();
  // const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
  //   Appearance.getColorScheme()
  // );
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Handle color scheme changes here
      setColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return { colorScheme };
}
