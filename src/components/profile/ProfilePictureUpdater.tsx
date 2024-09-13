import { Collections } from '@/config/collections';
import FileAssetService from '@/services/FileAssetService';
import ProfileService from '@/services/ProfileService';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import ImageUpload from '@/components/fileAsset/ImageUpload';

interface Props {}
const ProfilePictureUpdater: React.FC<Props> = ({ ...props }) => {
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
      console.error(error);
    }
  }, [profile, updateProfile]);

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
    <View {...props}>
      <View>
        <View>
          <Text>{profile?.username}</Text>
        </View>
        {profile?.picture && (
          <Button title="remove image" onPress={handlePictureDeletePrompt} />
        )}
      </View>
      <View>
        <View>
          <ImageUpload
            fileUri={profile?.picture?.fileUrl}
            onUploadComplete={(asset) => {}}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfilePictureUpdater;
