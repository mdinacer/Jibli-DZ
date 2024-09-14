import { Circle, Svg, SvgProps } from 'react-native-svg';

export const CircleIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill={'none'} {...props}>
    <Circle
      cx="12"
      cy="12"
      r="8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </Svg>
);
