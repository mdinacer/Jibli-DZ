import { Icons } from '@/constants';
import { Collaborator } from '@/models/Collaborator';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import AppButton from '../AppButton';

interface Props {
  collaborator: Collaborator;
  onRevoke: (collaborator: Collaborator) => void;
}

const CollaboratorCard: React.FC<Props> = ({ collaborator, onRevoke }) => {
  const { t } = useTranslation('common');
  return (
    <View className="relative w-[60vw] overflow-hidden rounded-lg bg-card">
      <View className="relative aspect-square w-[full] items-center justify-center overflow-hidden bg-border">
        {collaborator.picture ? (
          <Image
            source={{ uri: collaborator.picture }}
            resizeMode="cover"
            className="h-full w-full"
          />
        ) : (
          <Icons.UserIcon className="h-28 w-28 text-muted-foreground" />
        )}
        <View className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-2">
          <Text className="font-psemibold text-lg capitalize text-primary-foreground">
            {collaborator.username}
          </Text>
          <Text className="font-pregular text-base text-white/80">
            {collaborator.email}
          </Text>
        </View>
      </View>

      <AppButton
        className="rounded-none"
        variant="destructive"
        onPress={() => onRevoke(collaborator)}
      >
        {t('collaborator_revoke')}
      </AppButton>
    </View>
  );
};

export default CollaboratorCard;
