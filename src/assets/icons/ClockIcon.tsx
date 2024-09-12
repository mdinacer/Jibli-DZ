import { Circle, Path, Svg, SvgProps } from 'react-native-svg';

export const ClockIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill={'none'} {...props}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <Path
      d="M12 8V12L14 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
