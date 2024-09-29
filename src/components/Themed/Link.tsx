import { useThemeColor } from '@/hooks/useThemeColor';
import { Link as ExpoLink, LinkProps } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProps } from '@/components/Themed/types';

interface Props<T extends string | object> extends LinkProps<T>, ThemeProps {}

const Link = <T extends string | object>({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: Props<T>) => {
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
        styles.link,
        {
          color,
          fontFamily: 'Poppins-Regular',
          fontSize: 16,
          lineHeight: 24
        },
        style
      ]}
    />
  );
};

export default Link;

const styles = StyleSheet.create({
  link: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
    textDecorationColor: 'currentColor'
  }
});
