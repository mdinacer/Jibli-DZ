import Colors, { ThemeType } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark
): string | ThemeType {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colorName ? Colors[theme][colorName] : Colors[theme];
  }
}
