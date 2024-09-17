import { View, Text, Image } from 'react-native';
import React from 'react';
import { Collaborator } from '@/models/Collaborator';
import { Icons } from '@/constants';

interface Props {
  title?: string;
  collaborator: Collaborator;
}

const CollaboratorDetails: React.FC<Props> = ({ title, collaborator }) => {
  return (
    <View className="w-full flex-row items-center space-x-4">
      <View className="h-full items-center justify-center">
        {collaborator.picture ? (
          <Image
            resizeMode="cover"
            source={{ uri: collaborator.picture }}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <View className="h-14 w-14 items-center justify-center rounded-full bg-gray-200">
            <Icons.UserIcon className="h-8 w-8 text-muted" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text className="font-pregular text-base text-muted-foreground">
          {collaborator.username}
        </Text>
        <Text className="font-psemibold text-lg">
          {title || collaborator.email}
        </Text>
      </View>
    </View>
  );
};

export default CollaboratorDetails;
