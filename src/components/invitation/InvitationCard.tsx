import { Icons } from '@/constants';
import { MockCollaborators } from '@/data/mock-data';
import { Collaborator } from '@/models/Collaborator';
import { Invitation } from '@/models/Invitation';
import collaboratorService from '@/services/collaborator-service';
import { useProfileStore } from '@/stores/useProfileStore';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';
import AppButton from '../AppButton';

interface Props {
  invitation: Invitation;
  onAccept: () => void;
  onDecline: (action: 'revoke' | 'decline') => void;
}

const InvitationCard: React.FC<Props> = ({
  invitation,
  onAccept,
  onDecline
}) => {
  const { profile } = useProfileStore();
  const isSent = invitation.isOwner;
  const [collaborator, setCollaborator] = useState<Collaborator | undefined>(
    undefined
  );

  const mockCollaborator = useMemo(
    () => MockCollaborators.find((c) => c.userId === invitation.senderId),
    [invitation.senderId]
  );

  const renderRightActions = useCallback(
    (
      _: Animated.AnimatedInterpolation<string | number>,
      __: Animated.AnimatedInterpolation<string | number>,
      swipeable: Swipeable
    ) => {
      return (
        <>
          {isSent ? (
            <View className="h-full px-4">
              <AppButton
                variant="ghost"
                className="h-full w-14"
                icon={Icons.TrashIcon}
                iconStyles="h-8 w-8 text-destructive"
                onPress={() => {
                  swipeable.close();
                  onDecline('revoke');
                }}
              />
            </View>
          ) : (
            <View className="h-full flex-row justify-end space-x-2 px-4">
              <AppButton
                variant="ghost"
                className="h-full w-14"
                icon={Icons.MailValidationIcon}
                iconStyles="h-8 w-8 text-primary"
                onPress={() => {
                  swipeable.close();
                  onAccept();
                }}
              />
              <AppButton
                variant="ghost"
                className="h-full w-14"
                icon={Icons.MailRemoveIcon}
                iconStyles="h-8 w-8 text-destructive"
                onPress={() => {
                  swipeable.close();
                  onDecline('decline');
                }}
              />
            </View>
          )}
        </>
      );
    },
    [isSent, onAccept, onDecline]
  );

  const getUserDetails = useCallback(async () => {
    if (!profile) return;
    try {
      const isSent = invitation.senderId === profile.uid;

      const collaborator = await collaboratorService.getCollaboratorById(
        isSent ? invitation.recipientId : invitation.senderId
      );
      setCollaborator(collaborator);
    } catch (error) {
      setCollaborator(mockCollaborator);
      console.error(error);
    }
  }, [invitation.recipientId, invitation.senderId, mockCollaborator, profile]);

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // switch to Collaborator
  if (!collaborator) return null;

  return (
    <GestureHandlerRootView>
      <Swipeable
        friction={2}
        rightThreshold={60}
        renderRightActions={renderRightActions}
      >
        <View
          className="overflow-hidden rounded-lg bg-card p-4 shadow-sm"
          style={{ gap: 8 }}
        >
          <View className="flex-row items-center space-x-2">
            <View className="aspect-square h-12 items-center justify-center overflow-hidden rounded-full bg-border">
              {collaborator.picture ? (
                <Image
                  source={{ uri: collaborator.picture }}
                  resizeMode="cover"
                  className="h-full w-full"
                />
              ) : (
                <Icons.UserIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </View>
            <View>
              <Text className="font-pmedium text-base">
                {collaborator.username}
              </Text>
              <Text className="font-pregular text-sm text-muted-foreground">
                {collaborator.email}
              </Text>
            </View>
          </View>

          <View className="gap-y-2">
            {invitation.message && (
              <Text className="font-pregular text-base">
                {invitation.message}
              </Text>
            )}
            <Text className="font-pregular text-sm text-muted-foreground">
              {isSent ? 'Sent ' : 'Received '}
              {formatDistanceToNow(invitation.createdAt.toDate(), {
                addSuffix: true
              })}
            </Text>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default InvitationCard;
