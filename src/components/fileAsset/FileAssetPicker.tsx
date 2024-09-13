import { FileAsset } from '@/models/FileAsset';
import React, { useState } from 'react';
import { View } from 'react-native';
import ImageUpload from './ImageUpload';

const FileAssetPicker = () => {
  const [asset, setAsset] = useState<FileAsset | null>(null);

  return (
    <View>
      <ImageUpload
        fileUri={asset?.fileUrl}
        onUploadComplete={function (asset: FileAsset): void {
          setAsset(asset);
          console.log(asset);
        }}
      />
    </View>
  );
};

export default FileAssetPicker;
