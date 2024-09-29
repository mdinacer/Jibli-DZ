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
      className="w-full items-center justify-center px-4"
      style={{ rowGap: 16 }}
    >
      <View className="w-full gap-y-2">
        {title && (
          <Text className="text-center font-pmedium text-xl text-muted-foreground">
            {title}
          </Text>
        )}
        {description && (
          <Text className="text-center font-pmedium text-sm text-muted-foreground">
            {description}
          </Text>
        )}
      </View>
      {action}
    </View>
  );
};

export default EmptyState;
