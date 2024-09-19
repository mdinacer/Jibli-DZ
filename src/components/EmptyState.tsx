import Squircle from '@/components/Squircle';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  showImage?: boolean;
}

const EmptyState: React.FC<Props> = ({
  title,
  description,
  action,
  showImage = true
}) => {
  return (
    <Squircle
      className="w-full items-center justify-center p-6"
      style={{ rowGap: 16 }}
      squircleParams={{
        cornerSmoothing: 0.7,
        cornerRadius: 30,
        fillColor: '#ffffff'
      }}
    >
      <View className="w-full gap-y-2">
        {title && (
          <Text className="text-center font-pmedium text-lg text-primary">
            {title}
          </Text>
        )}
        {description && (
          <Text
            style={{ lineHeight: 24 }}
            className="text-center font-pregular text-sm leading-loose text-muted-foreground"
          >
            {description}
          </Text>
        )}
      </View>
      {action}
    </Squircle>
  );
};

export default EmptyState;
