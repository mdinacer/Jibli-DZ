import { Collections } from '@/config/collections';
import { FileAsset } from '@/models/FileAsset';
import FileAssetService from '@/services/FileAssetService';
import { resizeAndConvertToWebP } from '@/utils/ImageConverter';
import { ImageMinus, ImagePlus } from '@tamagui/lucide-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Button, Stack, Image } from 'tamagui';

interface Props {
  onUploadComplete: (asset: FileAsset) => void;
  onDelete?: () => void;
  fileUri?: string;
  shouldConvert?: boolean;
  shouldResize?: boolean;
}
const ImageUpload: React.FC<Props> = ({
  shouldConvert = true,
  shouldResize = true,
  fileUri,
  onUploadComplete,
  onDelete
}) => {
  const openFilePicker = useCallback(async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
        base64: false
      });
      if (!result.canceled) {
        const [asset] = result.assets;

        let fileUri = asset.uri;

        if (shouldConvert) {
          const convertedImage = await resizeAndConvertToWebP(
            asset.uri,
            shouldResize
          );

          fileUri = convertedImage || asset.uri;
        }

        const uploadedAsset = await FileAssetService.uploadUri(
          Collections.PICTURES,
          fileUri
        );

        if (uploadedAsset) {
          Alert.alert('Success', 'File uploaded successfully');
          onUploadComplete(uploadedAsset);
        }
      } else {
        setTimeout(() => {
          Alert.alert('Error', 'No file selected');
        }, 100);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }, [onUploadComplete, shouldConvert, shouldResize]);

  return (
    <TouchableOpacity
      onPress={() => openFilePicker()}
      style={{
        width: '100%',
        height: '100%',
        marginHorizontal: 'auto'
      }}
    >
      {fileUri ? (
        <Stack position="relative" flex={1}>
          <Image
            source={{ uri: fileUri }}
            style={{ height: '100%', width: '100%' }}
            objectFit="cover"
          />
          {onDelete && (
            <Button
              position="absolute"
              bottom={10}
              right={10}
              borderRadius={999}
              size={'$7'}
              padding="$1"
              aspectRatio={1}
              onPress={onDelete}
              backgroundColor={'$red10'}
              color="$white1"
              icon={ImageMinus}
              scaleIcon={1.4}
            ></Button>
          )}
        </Stack>
      ) : (
        <Stack
          flex={1}
          alignItems="center"
          justifyContent="center"
          borderRadius={16}
          paddingHorizontal={'$4'}
        >
          <Stack
            height={'$20'}
            width={'$20'}
            borderRadius={16}
            borderStyle="dashed"
            borderColor={'$borderColor'}
            borderWidth={5}
            alignItems="center"
            justifyContent="center"
          >
            <ImagePlus size={'$10'} color={'$borderColor'} />
          </Stack>
        </Stack>
      )}
    </TouchableOpacity>
  );
};

export default ImageUpload;
