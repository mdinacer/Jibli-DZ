import ImageUpload from '@/components/fileAsset/ImageUpload';
import { Collections } from '@/config/collections';
import { Icons } from '@/constants';
import FileAssetService from '@/services/FileAssetService';
import ProfileService from '@/services/ProfileService';
import { useProfileStore } from '@/stores/useProfileStore';
import React, { useCallback } from 'react';
import { Alert, Text, View } from 'react-native';
import AppButton from '../AppButton';
import { FileAsset } from '@/models/FileAsset';
import { useTranslation } from 'react-i18next';

interface Props {}
const ProfilePictureUpdater: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation('common');
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
      t('profile_picture_delete.title'),
      t('profile_picture_delete.description'),
      [
        {
          text: t('profile_picture_delete.cancel'),
          style: 'cancel'
        },
        {
          text: t('profile_picture_delete.delete'),
          style: 'destructive',
          onPress: handleDeleteAsset
        }
      ]
    );
  };

  const handleUpdatePicture = useCallback(
    async (asset: FileAsset) => {
      if (!profile) return;

      try {
        if (profile.picture) {
          const { fileName } = profile.picture;
          await FileAssetService.deleteFile(Collections.PICTURES, fileName);
        }
        const updatedProfile = await ProfileService.update(profile.id, {
          picture: asset
        });

        if (updatedProfile) {
          updateProfile({ picture: null });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [profile, updateProfile]
  );

  return (
    <View
      {...props}
      className="relative aspect-square w-full overflow-hidden rounded-lg"
    >
      <View>
        <View>
          <ImageUpload
            fileUri={profile?.picture?.fileUrl}
            onUploadComplete={handleUpdatePicture}
          />
        </View>
      </View>
      <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between bg-black/40 px-4 py-2">
        <View>
          <Text className="font-pbold text-2xl text-white">
            {profile?.username}
          </Text>
        </View>
        {profile?.picture && (
          <AppButton
            icon={Icons.ImageDeleteIcon}
            iconStyles="h-6 w-6 text-white"
            variant="destructive"
            onPress={handlePictureDeletePrompt}
          />
        )}
      </View>
    </View>
  );
};

export default ProfilePictureUpdater;
