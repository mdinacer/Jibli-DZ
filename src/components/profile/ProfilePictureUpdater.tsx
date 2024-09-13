import { useProfileStore } from '@/stores/useProfileStore';
import { ImageMinus } from '@tamagui/lucide-icons';
import React, { useCallback } from 'react';
import { Button, Card, CardProps, H2, Stack, XStack } from 'tamagui';
import ImageUpload from '../fileAsset/ImageUpload';
import { Collections } from '@/config/collections';
import FileAssetService from '@/services/FileAssetService';
import ProfileService from '@/services/ProfileService';
import { useToastController } from '@tamagui/toast';
import { Alert } from 'react-native';

interface Props extends CardProps {}
const ProfilePictureUpdater: React.FC<Props> = ({ ...props }) => {
  const toast = useToastController();
  const { profile, updateProfile } = useProfileStore();

  const handleDeleteAsset = useCallback(async () => {
    if (!profile || !profile.picture) return;
    try {
      const { fileName } = profile.picture;
      await FileAssetService.deleteFile(Collections.PICTURES, fileName);
      const updatedProfile = await ProfileService.update(profile.id, {
        picture: null
      });
      if (updatedProfile) {
        updateProfile({ picture: null });
      }
    } catch (error: any) {
      toast.show('An error occurred while deleting the profile picture', {
        message: error.message
      });
    }
  }, [profile, toast, updateProfile]);

  const handlePictureDeletePrompt = () => {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to delete your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDeleteAsset
        }
      ]
    );
  };

  return (
    <Card
      aspectRatio={1}
      borderRadius={8}
      overflow="hidden"
      elevate
      bordered
      {...props}
    >
      <Card.Footer
        padded
        backgroundColor="rgba(0, 0, 0, 0.3)"
        paddingVertical="$2"
      >
        <XStack flex={1}>
          <H2 color={'white'}>{profile?.username}</H2>
        </XStack>
        {profile?.picture && (
          <Button
            aspectRatio={1}
            scaleIcon={1.8}
            backgroundColor="$red10Light"
            color={'white'}
            icon={ImageMinus}
            borderRadius="$10"
            onPress={handlePictureDeletePrompt}
          />
        )}
      </Card.Footer>
      <Card.Background>
        <Stack width={'100%'}>
          <ImageUpload
            fileUri={profile?.picture?.fileUrl}
            onUploadComplete={(asset) => {}}
          />
        </Stack>
      </Card.Background>
    </Card>
  );
};

export default ProfilePictureUpdater;
