import { Collections } from '@/config/collections';
import { Icons } from '@/constants';
import { FileAsset } from '@/models/FileAsset';
import FileAssetService from '@/services/FileAssetService';
import { resizeAndConvertToWebP } from '@/utils/ImageConverter';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Alert, Button, Image, TouchableOpacity, View } from 'react-native';

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
        <View>
          <Image
            source={{ uri: fileUri }}
            style={{ height: '100%', width: '100%' }}
            resizeMode="cover"
          />
          {onDelete && <Button title="delete"></Button>}
        </View>
      ) : (
        <View>
          <View>
            <Icons.ImageUploadIcon />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageUpload;
