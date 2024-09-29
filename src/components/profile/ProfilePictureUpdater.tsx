import ImageUpload from '@/components/fileAsset/ImageUpload';
import IconButton from '@/components/IconButton';
import Text from '@/components/Themed/Text';
import { Collections } from '@/config/collections';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FileAsset } from '@/models/FileAsset';
import FileAssetService from '@/services/FileAssetService';
import ProfileService from '@/services/ProfileService';
import { useProfileStore } from '@/stores/useProfileStore';
import { hslToRgb, parseHSL } from '@/utils/hslConverter';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

interface Props {}
const ProfilePictureUpdater: React.FC<Props> = ({ ...props }) => {
  const theme = useThemeColor({}) as ThemeType;

  const rgbBackground = useMemo(() => {
    const rgbValues = parseHSL(theme.background);

    return rgbValues
      ? hslToRgb(rgbValues[0], rgbValues[1], rgbValues[2])
      : null;
  }, [theme.background]);

  const { t } = useTranslation('common');
  const { profile } = useProfileStore();

  const handleDeleteAsset = useCallback(async () => {
    if (!profile || !profile.picture) return;
    try {
      const { fileName } = profile.picture;
      await FileAssetService.deleteFile(Collections.PICTURES, fileName);
      await ProfileService.update(profile.id, {
        picture: null
      });
    } catch (error: any) {
      console.error(error);
    }
  }, [profile]);

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
        await ProfileService.update(profile.id, {
          picture: asset
        });
      } catch (error) {
        console.error(error);
      }
    },
    [profile]
  );

  return (
    <View
      {...props}
      style={{
        position: 'relative',
        aspectRatio: 1,
        width: '100%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.background,
        borderRadius: 16
      }}
    >
      <View>
        <View>
          <ImageUpload
            fileUri={profile?.picture?.fileUrl}
            onUploadComplete={handleUpdatePicture}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: rgbBackground
            ? `rgba(${rgbBackground},0.4)`
            : 'rgba(156 163 175 / 0.2)'
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              lineHeight: 32,
              fontFamily: 'Poppins-Bold',
              color: theme.foreground
            }}
          >
            {profile?.username}
          </Text>
          <Text
            style={{
              color: theme.foreground,
              fontSize: 14,
              lineHeight: 20
            }}
          >
            {profile?.email}
          </Text>
        </View>
        {profile?.picture && (
          <IconButton
            icon={Icons.ImageDeleteIcon}
            style={{
              backgroundColor: theme.destructive,
              padding: 8,
              borderRadius: 9999
            }}
            iconStyles={{
              height: 24,
              width: 24,
              color: theme.destructiveForeground
            }}
            onPress={handlePictureDeletePrompt}
          />
        )}
      </View>
    </View>
  );
};

export default ProfilePictureUpdater;
