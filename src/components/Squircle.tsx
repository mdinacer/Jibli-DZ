import React from 'react';
import {
  SquircleParams,
  SquircleView,
  SquircleViewProps
} from 'react-native-figma-squircle';

interface Props extends Omit<SquircleViewProps, 'squircleParams'> {
  squircleParams?: Partial<SquircleParams>;
}

const Squircle: React.FC<Props> = ({ children, squircleParams, ...props }) => {
  return (
    <SquircleView
      style={{ width: 200, height: 200 }}
      squircleParams={{
        cornerSmoothing: 0.7,
        cornerRadius: 30,
        ...squircleParams
      }}
      {...props}
    >
      {children}
    </SquircleView>
  );
};

export default Squircle;
