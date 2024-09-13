import { crashlyticsInstance } from '@/config/firebaseConfig';
import * as ImageManipulator from 'expo-image-manipulator';

export const convertToWebP = async (uri: string) => {
  try {
    let imageUri = '';
    // Manipulate the image and convert to WebP format
    const manipResult = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1, // Maximum quality
      format: ImageManipulator.SaveFormat.WEBP
    });

    imageUri = manipResult.uri;
    return imageUri;
  } catch (error: any) {
    crashlyticsInstance.recordError(error);
  }
};

export const resizeAndConvertToWebP = async (
  imageUri: string,
  shouldResizeImage: boolean = false // Parameter to conditionally resize the image
): Promise<string | undefined> => {
  try {
    // Define the manipulations based on the shouldResizeImage flag
    const manipulations = shouldResizeImage
      ? [{ resize: { width: 400, height: 400 } }] // Resize to 400x400 if shouldResizeImage is true
      : [];

    // Manipulate the image and convert to WebP format
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      manipulations, // Apply resizing if needed
      {
        compress: 1, // Maximum quality
        format: ImageManipulator.SaveFormat.WEBP
      }
    );

    const convertedUri = result.uri;
    return convertedUri;
  } catch (error: any) {
    crashlyticsInstance.recordError(error);
  }
};
