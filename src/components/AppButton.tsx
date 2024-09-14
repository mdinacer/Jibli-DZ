import React, { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styled } from 'nativewind';
import { SvgProps } from 'react-native-svg';

const buttonStyles = {
  base: 'inline-flex items-center space-x-2 justify-center rounded-md disabled:opacity-50',
  variants: {
    default: 'bg-primary hover:bg-primary/90',
    destructive: 'bg-destructive hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent ',
    secondary: 'bg-secondary  hover:bg-secondary/80',
    ghost: 'hover:bg-accent ',
    link: ''
  },
  sizes: {
    default: 'px-4 py-2 h-12',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  },
  textStyles: {
    default: 'text-primary-foreground',
    destructive: 'text-destructive-foreground',
    outline: 'hover:text-accent-foreground',
    secondary: 'text-secondary-foreground',
    ghost: 'hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  }
};

const StyledButton = styled(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
  className?: string;
  variant?: keyof typeof buttonStyles.variants;
  size?: keyof typeof buttonStyles.sizes;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: (props: SvgProps) => JSX.Element;
  iconStyles?: string;
  onPress?: () => void;
}

const AppButton = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      disabled,
      children,
      onPress,
      icon: Icon,
      iconStyles,
      className,
      ...props
    },
    ref
  ) => {
    const variantStyle = buttonStyles.variants[variant];
    const sizeStyle = buttonStyles.sizes[size];
    const textStyle = buttonStyles.textStyles[variant];

    return (
      <StyledButton
        ref={ref}
        className={`${buttonStyles.base} ${variantStyle} ${sizeStyle} ${className} ${disabled ? 'opacity-50' : 'opacity-100'}`}
        disabled={disabled}
        onPress={onPress}
        {...props}
      >
        {Icon && <Icon className={`h-5 w-5 ${iconStyles}`} />}
        {children && (
          <Text className={`${textStyle} font-pmedium text-base capitalize`}>
            {children}
          </Text>
        )}
      </StyledButton>
    );
  }
);

AppButton.displayName = 'AppButton';

export default AppButton;
