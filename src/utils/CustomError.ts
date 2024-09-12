import { crashlyticsInstance } from '@/config/firebaseConfig';

export default class CustomError extends Error {
  public readonly code: string;
  public readonly details: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Method to log error details to Crashlytics
  public logToCrashlytics() {
    crashlyticsInstance.recordError(this);
    crashlyticsInstance.log(`Error Code: ${this.code}`);
    if (this.details) {
      crashlyticsInstance.log(`Details: ${JSON.stringify(this.details)}`);
    }
  }

  public showToast() {
    // Toast.show({
    //   type: 'error',
    //   position: 'bottom',
    //   text1: this.message,
    //   text2: this.details ? JSON.stringify(this.details) : '',
    //   visibilityTime: 4000
    // });
  }
}
