import { Path, Svg, SvgProps } from 'react-native-svg';

export const CancelIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill={'none'} {...props}>
    <Path
      d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
