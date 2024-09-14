import { styled } from 'nativewind';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { SvgProps } from 'react-native-svg';

const buttonStyles = {
  base: ' aspect-square rounded-full items-center justify-center',
  variants: {
    default: 'bg-primary',
    destructive: 'bg-destructive hover:bg-destructive/90',
    bordered: 'border border-input bg-background',
    secondary: 'bg-secondary border border-secondary',
    ghost: 'bg-transparent ',
    link: ''
  },
  sizes: {
    default: 'h-12',
    sm: 'h-9',
    lg: 'h-11',
    icon: 'h-10'
  },
  textStyles: {
    default: 'text-primary-foreground',
    destructive: 'text-destructive-foreground',
    bordered: 'text-accent-foreground',
    secondary: 'text-secondary-foreground',
    ghost: 'hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  }
};
interface Props extends TouchableOpacityProps {
  icon: (props: SvgProps) => JSX.Element;
  iconStyles?: string;
  className?: string;
  variant?: keyof typeof buttonStyles.variants;
  size?: keyof typeof buttonStyles.sizes;
}

const StyledButton = styled(TouchableOpacity);

const IconButton: React.FC<Props> = ({
  icon: Icon,
  iconStyles = 'h-5 w-5',
  className,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const variantStyle = buttonStyles.variants[variant];
  const sizeStyle = buttonStyles.sizes[size];
  const textStyle = buttonStyles.textStyles[variant];
  return (
    <StyledButton
      {...props}
      className={`${buttonStyles.base} ${sizeStyle} ${variantStyle} ${className} ${props.disabled && 'opacity-50'}`}
    >
      <Icon className={`${textStyle} ${iconStyles}`} />
    </StyledButton>
  );
};

export default IconButton;
