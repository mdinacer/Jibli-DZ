import { Path, Svg, SvgProps } from 'react-native-svg';

export const PlusIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill={'none'} {...props}>
    <Path
      d="M12 4V20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 12H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
