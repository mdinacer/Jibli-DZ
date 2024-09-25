import { ThemeProps } from '@/components/Themed/types';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

// const buttonStyles = {
//   base: {
//     aspectRatio: 1,
//     borderRadius: 9999, // Fully rounded
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   variants: {
//     default: {
//       backgroundColor: 'var(--primary)'
//     },
//     destructive: {
//       backgroundColor: 'var(--destructive)',
//       hover: {
//         backgroundColor: 'rgba(255, 0, 0, 0.9)' // Adjust for hover effect
//       }
//     },
//     bordered: {
//       borderColor: 'var(--input)',
//       backgroundColor: 'var(--background)',
//       borderWidth: 1
//     },
//     secondary: {
//       backgroundColor: 'var(--secondary)',
//       borderColor: 'var(--secondary)',
//       borderWidth: 1
//     },
//     ghost: {
//       backgroundColor: 'transparent'
//     },
//     link: {}
//   },
//   sizes: {
//     default: {
//       height: 48 // Example height
//     },
//     sm: {
//       height: 36 // Small size
//     },
//     lg: {
//       height: 44 // Large size
//     },
//     icon: {
//       height: 40 // Icon button size
//     }
//   }
// };

interface Props extends TouchableOpacityProps, ThemeProps {
  icon: (props: SvgProps) => JSX.Element;
  iconStyles?: SvgProps;
  // variant?: keyof typeof buttonStyles.variants;
  // size?: keyof typeof buttonStyles.sizes;
}

const IconButton: React.FC<Props> = ({
  icon: Icon,
  iconStyles = { height: 20, width: 20 },
  darkColor,
  lightColor,
  style,
  // variant = 'default',
  // size = 'default',
  ...props
}) => {
  const theme = useThemeColor({
    light: lightColor,
    dark: darkColor
  }) as ThemeType;

  // const variantStyle = buttonStyles.variants[variant];
  // const sizeStyle = buttonStyles.sizes[size];

  return (
    <TouchableOpacity
      {...props}
      style={[
        // buttonStyles.base as ViewStyle,
        // variantStyle,
        // sizeStyle,
        style,
        props.disabled && { opacity: 0.5 }
      ]}
    >
      <Icon color={theme.primary} {...iconStyles} />
    </TouchableOpacity>
  );
};

export default IconButton;
