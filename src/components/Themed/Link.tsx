import { useThemeColor } from '@/hooks/useThemeColor';
import { Link as ExpoLink, LinkProps } from 'expo-router';
import React from 'react';
import { ThemeProps } from './types';

type Props = LinkProps<string | object> & ThemeProps;
const Link: React.FC<Props> = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}) => {
  const color = useThemeColor(
    {
      light: lightColor,
      dark: darkColor
    },
    'primary'
  ) as string;

  return (
    <ExpoLink
      {...otherProps}
      style={[
        {
          fontFamily: 'Poppins-Regular',
          fontSize: 16,
          lineHeight: 24,
          color,
          textDecorationLine: 'underline',
          textDecorationColor: 'currentColor'
        },
        style
      ]}
    />
  );
};

export default Link;
