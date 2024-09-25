import { ThemeProps } from '@/components/Themed/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Text as DefaultText, TextProps } from 'react-native';

type Props = ThemeProps & TextProps & { muted?: boolean };

const Text: React.FC<Props> = ({
  style,
  lightColor,
  darkColor,
  muted = false,
  ...otherProps
}) => {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    muted ? 'mutedForeground' : 'foreground'
  ) as string;

  return (
    <DefaultText
      style={[
        { color, fontFamily: 'Poppins-Regular', fontSize: 16, lineHeight: 24 },
        style
      ]}
      {...otherProps}
    />
  );
};

export default Text;
