import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/Card';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const EmptyState: React.FC<Props> = ({ title, description, action, style }) => {
  const theme = useThemeColor({}) as ThemeType;
  return (
    <View
      style={[
        {
          aspectRatio: 16 / 9,
          width: '100%',
          borderRadius: 8,
          rowGap: 16,
          padding: 24,
          backgroundColor: theme.background
        },
        style
      ]}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 8
        }}
      >
        {title && (
          <CardTitle
            style={{ color: theme.mutedForeground, textAlign: 'center' }}
          >
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription style={{ textAlign: 'center' }}>
            {description}
          </CardDescription>
        )}
      </View>
      {action}
    </View>
  );
};

export default EmptyState;
