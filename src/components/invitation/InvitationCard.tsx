import { Card, CardContent, CardFooter, CardHeader } from '@/components/Card';
import IconButton from '@/components/IconButton';
import Text from '@/components/Themed/Text';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { MockCollaborators } from '@/data/mock-data';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Collaborator } from '@/models/Collaborator';
import { Invitation } from '@/models/Invitation';
import collaboratorService from '@/services/collaborator-service';
import { useProfileStore } from '@/stores/useProfileStore';
import { formatDistanceToNow } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable
} from 'react-native-gesture-handler';

interface Props {
  invitation: Invitation;
  onAccept: (collaborator: Collaborator) => void;
  onDecline: (action: 'revoke' | 'decline') => void;
}

const InvitationCard: React.FC<Props> = ({
  invitation,
  onAccept,
  onDecline
}) => {
  const theme = useThemeColor({}) as ThemeType;
  const { profile } = useProfileStore();
  const isSent = invitation.isOwner;
  const [collaborator, setCollaborator] = useState<Collaborator | undefined>(
    undefined
  );

  const mockCollaborator = useMemo(
    () => MockCollaborators.find((c) => c.userId === invitation.senderId),
    [invitation.senderId]
  );

  const handleAcceptInvitation = useCallback(
    (swipeable: Swipeable) => {
      if (!collaborator) return;
      onAccept(collaborator);
      swipeable.close();
    },
    [collaborator, onAccept]
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
            <View style={styles.iconContainer}>
              <IconButton
                style={styles.button}
                iconStyles={{
                  ...styles.icon,
                  color: theme.destructive
                }}
                icon={Icons.TrashIcon}
                onPress={() => {
                  swipeable.close();
                  onDecline('revoke');
                }}
              />
            </View>
          ) : (
            <View style={styles.buttonsWrapper}>
              <IconButton
                style={styles.button}
                iconStyles={{ ...styles.icon, color: '#16a34a' }}
                icon={Icons.MailValidationIcon}
                onPress={() => handleAcceptInvitation(swipeable)}
              />
              <IconButton
                style={styles.button}
                icon={Icons.MailRemoveIcon}
                iconStyles={{ ...styles.icon, color: theme.destructive }}
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
    [handleAcceptInvitation, isSent, onDecline, theme.destructive]
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
        <Card style={{ gap: 8, overflow: 'hidden' }}>
          <CardHeader
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 16
            }}
          >
            <View
              style={{
                height: 48,
                width: 48,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 9999,
                backgroundColor: theme.border
              }}
            >
              {collaborator.picture ? (
                <Image
                  source={{ uri: collaborator.picture }}
                  resizeMode="cover"
                  style={{
                    height: 48,
                    width: 48
                  }}
                />
              ) : (
                <Icons.UserIcon
                  color={theme.mutedForeground}
                  style={{
                    height: 24,
                    width: 24
                  }}
                />
              )}
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  lineHeight: 24,
                  textTransform: 'capitalize'
                }}
              >
                {collaborator.username}
              </Text>
              <Text
                muted
                style={{
                  fontSize: 14,
                  lineHeight: 20
                }}
              >
                {collaborator.email}
              </Text>
            </View>
          </CardHeader>

          {invitation.message && (
            <CardContent>
              <Text>{invitation.message}</Text>
            </CardContent>
          )}

          <CardFooter>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20
              }}
              muted
            >
              {isSent ? 'Sent ' : 'Received '}
              {formatDistanceToNow(invitation.createdAt.toDate(), {
                addSuffix: true
              })}
            </Text>
          </CardFooter>
        </Card>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default InvitationCard;

const styles = StyleSheet.create({
  iconContainer: {
    width: '100%',
    paddingHorizontal: 16
  },
  button: {
    height: '100%',
    width: 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 32,
    width: 32
  },
  buttonsWrapper: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-end',
    columnGap: 8,
    paddingHorizontal: 16,
    width: 'auto'
  }
});
