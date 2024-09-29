import { Collections } from '@/config/collections';
import { Icons } from '@/constants';
import { ThemeType } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FileAsset } from '@/models/FileAsset';
import FileAssetService from '@/services/FileAssetService';
import { resizeAndConvertToWebP } from '@/utils/ImageConverter';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

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
  const theme = useThemeColor({}) as ThemeType;
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
      style={styles.touchableOpacity}
      onPress={() => openFilePicker()}
    >
      {fileUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: fileUri }}
            style={styles.image}
            resizeMode="cover"
          />
          {onDelete && <Button title="delete"></Button>}
        </View>
      ) : (
        <View style={styles.iconContainer}>
          <Icons.ImageUploadIcon
            style={styles.icon}
            color={theme.mutedForeground}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  touchableOpacity: { marginHorizontal: 'auto', width: '100%', height: '100%' },
  imageContainer: { aspectRatio: 1, overflow: 'hidden', borderRadius: 8 },
  image: { height: '100%', width: '100%' },
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  icon: { width: '80%', height: '80%' }
});
