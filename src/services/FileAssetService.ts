import { Collections } from '@/config/collections';
import firebaseServices from '@/config/firebaseConfig';
import { FileAsset as Asset } from '@/models/FileAsset';
import CustomError from '@/utils/CustomError';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  uploadBytes
} from '@react-native-firebase/storage';

export function parseFileNameAndExtension(uri: string): {
  fileName: string;
  extension: string;
} {
  const fullFileName = uri.split('/').pop() || '';
  const [fileName, extension] = fullFileName.split('.');
  return { fileName, extension };
}

export async function uploadUri(
  folderPath: string,
  fileUri: string
): Promise<Asset> {
  try {
    const { fileName } = parseFileNameAndExtension(fileUri);
    const storageRef = firebaseServices.storage.ref(
      `${folderPath}/${fileName}`
    );
    await storageRef.putFile(fileUri);

    let downloadURL = await storageRef.getDownloadURL();

    return {
      fileName: fileName,
      fileUrl: downloadURL
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Error uploading file URI', 'UPLOAD_URI_FAILED');
  }
}

export async function uploadFile(
  folderPath: string,
  file: File
): Promise<Asset> {
  try {
    const storageRef = firebaseServices.storage.ref(
      `${folderPath}/${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      fileName: file.name,
      fileUrl: downloadURL
    };
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Error uploading file', 'UPLOAD_FILE_FAILED');
  }
}

export async function updateFile(
  existingFilePath: string,
  newFile: File
): Promise<Asset> {
  try {
    const storageRef = firebaseServices.storage.ref(existingFilePath);
    await deleteObject(storageRef); // Delete existing file

    return uploadFile(existingFilePath, newFile); // Upload new file with same path
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Error updating file', 'UPDATE_FILE_FAILED');
  }
}

export async function downloadFile(
  filePath: string,
  fileName: string
): Promise<Asset> {
  try {
    const storageRef = firebaseServices.storage.ref(`${filePath}/${fileName}`);
    const downloadURL = await getDownloadURL(storageRef);
    return { fileName, fileUrl: downloadURL };
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Error downloading file', 'DOWNLOAD_FILE_FAILED');
  }
}

export async function deleteFile(
  filePath: string,
  fileName: string
): Promise<void> {
  try {
    const storageRef = firebaseServices.storage.ref(`${filePath}/${fileName}`);
    await deleteObject(storageRef);
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Error deleting file', 'DELETE_FILE_FAILED');
  }
}

export async function getAllFiles(): Promise<string[]> {
  try {
    const directoryRef = firebaseServices.storage.ref(Collections.PICTURES);
    const result = await listAll(directoryRef);
    const urls = await Promise.all(
      result.items.map((itemRef) => getDownloadURL(itemRef))
    );
    return urls;
  } catch (error: any) {
    if (error instanceof CustomError) {
      error.logToCrashlytics();
    } else {
      firebaseServices.crashlytics.recordError(error);
    }
    throw new CustomError('Error getting all files', 'GET_ALL_FILES_FAILED');
  }
}

const FileAssetService = {
  uploadFile,
  uploadUri,
  updateFile,
  deleteFile,
  downloadFile,
  getAllFiles
};

export default FileAssetService;
