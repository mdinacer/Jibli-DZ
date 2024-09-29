import { ThemeProps } from '@/components/Themed/types';
import { shadowStyles, ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Card = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View> & ThemeProps
>(({ lightColor, darkColor, style, ...props }, ref) => {
  const theme = useThemeColor({
    light: lightColor,
    dark: darkColor
  }) as ThemeType;

  return (
    <View
      ref={ref}
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: theme['card'],
          borderColor: theme['border']
        },
        style
      ]}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View>
>(({ style, ...props }, ref) => (
  <View ref={ref} {...props} style={[styles.cardHeader, style]} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  Text,
  React.ComponentPropsWithoutRef<typeof Text> & ThemeProps
>(({ lightColor, darkColor, style, ...props }, ref) => {
  const color = useThemeColor(
    {
      light: lightColor,
      dark: darkColor
    },
    'cardForeground'
  ) as string;

  return (
    <Text
      role="heading"
      aria-level={3}
      ref={ref}
      {...props}
      style={[styles.cardTitle, { color }, style]}
    />
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  Text,
  React.ComponentPropsWithoutRef<typeof Text> & ThemeProps
>(({ lightColor, darkColor, style, ...props }, ref) => {
  const color = useThemeColor(
    {
      light: lightColor,
      dark: darkColor
    },
    'mutedForeground'
  ) as string;

  return (
    <Text
      ref={ref}
      {...props}
      style={[styles.cardDescription, { color }, style]}
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View>
>(({ style, ...props }, ref) => (
  <View ref={ref} {...props} style={[styles.cardContent, style]} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View>
>(({ style, ...props }, ref) => (
  <View ref={ref} {...props} style={[styles.cardFooter, style]} />
));
CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    ...shadowStyles.shadowSm
  },
  cardHeader: {
    flexDirection: 'column',
    padding: 24
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 0,
    letterSpacing: -0.4
  },
  cardDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 26,
    marginBottom: 0
  },
  cardContent: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    paddingTop: 0
  },
  cardFooter: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    paddingTop: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  }
});

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};
