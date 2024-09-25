import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/Card';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';

interface Props {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({ title, description, action }) => {
  const theme = useThemeColor({}) as ThemeType;
  return (
    <Card
      style={{
        aspectRatio: 16 / 9,
        width: '100%',
        borderRadius: 8,
        rowGap: 16,
        padding: 24,
        backgroundColor: theme.background
      }}
    >
      <CardHeader
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 8
        }}
      >
        {title && <CardTitle>{title}</CardTitle>}
        {description && (
          <CardDescription style={{ textAlign: 'center' }}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      {action}
    </Card>
  );
};

export default EmptyState;
