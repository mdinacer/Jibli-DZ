import { Path, Svg, SvgProps } from 'react-native-svg';

export const CheckIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill={'none'} {...props}>
    <Path
      d="M5 14L8.5 17.5L19 6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
