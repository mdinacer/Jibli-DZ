import { View, Text, Image } from 'react-native';
import React from 'react';
import { Collaborator } from '@/models/Collaborator';
import { Icons } from '@/constants';

interface Props {
  collaborator: Collaborator;
}

const CollaboratorCard: React.FC<Props> = ({ collaborator }) => {
  return (
    <View className="relative w-[60vw] overflow-hidden rounded-lg bg-card">
      <View className="aspect-square w-[full] items-center justify-center overflow-hidden bg-border">
        {collaborator.picture ? (
          <Image
            source={{ uri: collaborator.picture }}
            resizeMode="cover"
            className="h-full w-full"
          />
        ) : (
          <Icons.UserIcon className="h-28 w-28 text-muted-foreground" />
        )}
      </View>
      <View className="px-4 py-2">
        <Text className="font-pmedium text-base">{collaborator.username}</Text>
        <Text className="font-pregular text-sm text-muted-foreground">
          {collaborator.email}
        </Text>
      </View>
    </View>
  );
};

export default CollaboratorCard;
