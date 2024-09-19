import { FileAsset } from '@/models/FileAsset';
import React, { useState } from 'react';
import { View } from 'react-native';
import ImageUpload from '@/components/fileAsset/ImageUpload';

const FileAssetPicker = () => {
  const [asset, setAsset] = useState<FileAsset | null>(null);

  return (
    <View>
      <ImageUpload
        fileUri={asset?.fileUrl}
        onUploadComplete={function (asset: FileAsset): void {
          setAsset(asset);
        }}
      />
    </View>
  );
};

export default FileAssetPicker;
