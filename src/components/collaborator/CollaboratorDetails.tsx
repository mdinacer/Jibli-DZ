import { View, Image } from 'react-native';
import React from 'react';
import { Collaborator } from '@/models/Collaborator';
import { Icons } from '@/constants';
import Text from '../Themed/Text';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Props {
  title?: string;
  collaborator: Collaborator;
}

const CollaboratorDetails: React.FC<Props> = ({ title, collaborator }) => {
  const theme = useThemeColor({}) as ThemeType;

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 16
      }}
    >
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {collaborator.picture ? (
          <Image
            resizeMode="cover"
            source={{ uri: collaborator.picture }}
            style={{
              height: 56,
              width: 56,
              borderRadius: 9999
            }}
          />
        ) : (
          <View
            style={{
              height: 56,
              width: 56,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9999,
              backgroundColor: theme.muted
            }}
          >
            <Icons.UserIcon
              color={theme.mutedForeground}
              style={{ height: 32, width: 32 }}
            />
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text muted style={{ textTransform: 'capitalize' }}>
          {collaborator.username}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 18,
            lineHeight: 28,
            textTransform: 'capitalize'
          }}
        >
          {title || collaborator.email}
        </Text>
      </View>
    </View>
  );
};

export default CollaboratorDetails;
