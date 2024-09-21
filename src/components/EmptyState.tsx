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
    <View
      className="w-full items-center justify-center rounded-2xl bg-background p-6"
      style={{ rowGap: 16 }}
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
    </View>
  );
};

export default EmptyState;
