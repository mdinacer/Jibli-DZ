import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { ThemeProps } from './types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemeType } from '@/constants/Colors';
import { SvgProps } from 'react-native-svg';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends TouchableOpacityProps, ThemeProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: (props: SvgProps) => JSX.Element;
  iconStyles?: SvgProps;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  style,
  lightColor,
  darkColor,
  icon: Icon,
  iconStyles = { height: 20, width: 20 },
  ...props
}) => {
  const theme = useThemeColor({
    light: lightColor,
    dark: darkColor
  }) as ThemeType;

  const { primary, destructive, background, secondary, input } = theme;

  const buttonStyles: ViewStyle = {
    opacity: props.disabled ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: size === 'sm' ? 36 : size === 'lg' ? 44 : 40,
    paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 24 : 16,
    ...(variant === 'destructive' && { backgroundColor: destructive }),
    ...(variant === 'outline' && {
      borderColor: input,
      borderWidth: 1,
      backgroundColor: background
    }),
    ...(variant === 'secondary' && { backgroundColor: secondary }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
    ...(variant === 'link' && { backgroundColor: 'transparent' }),
    ...(variant === 'default' && { backgroundColor: primary })
  };

  const foregroundColor = useMemo(() => {
    switch (variant) {
      case 'destructive':
        return theme.destructiveForeground;
      case 'outline':
        return theme.foreground;
      case 'secondary':
        return theme.accentForeground;
      case 'ghost':
        return theme.primaryForeground;
      case 'link':
        return theme.primaryForeground;
      default:
        return theme.primaryForeground;
    }
  }, [theme, variant]);

  const textStyles: TextStyle = {
    fontSize: 16,
    color: foregroundColor,
    textDecorationLine: variant === 'link' ? 'underline' : 'none',
    textAlign: 'center'
  };

  return (
    <TouchableOpacity
      style={[buttonStyles, style, Icon && { flexDirection: 'row', gap: 8 }]}
      {...props}
    >
      {Icon && <Icon color={foregroundColor} {...iconStyles} />}
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
};

export { Button };
