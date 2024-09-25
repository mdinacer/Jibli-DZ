import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import {
  SafeAreaView as DefaultSafeAreaView,
  SafeAreaViewProps
} from 'react-native-safe-area-context';
import { ThemeProps } from './types';

type Props = ThemeProps & SafeAreaViewProps;
const SafeAreaView: React.FC<Props> = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'muted'
  ) as string;
  return (
    <DefaultSafeAreaView
      style={[{ backgroundColor, flex: 1 }, style]}
      {...otherProps}
    />
  );
};

export default SafeAreaView;
