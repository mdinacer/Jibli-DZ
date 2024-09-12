import { crashlyticsInstance } from '@/config/firebaseConfig';

class LoggingService {
  // Report non-fatal exceptions
  static logError(error: any, customMessage: string = '') {
    if (customMessage) {
      crashlyticsInstance.log(customMessage);
    }

    crashlyticsInstance.recordError(error);
  }

  // Set user information for tracking
  static setUser(userId: string, email?: string, name?: string) {
    crashlyticsInstance.setUserId(userId);
    if (email) crashlyticsInstance.setAttribute('email', email);
    if (name) crashlyticsInstance.setAttribute('name', name);
  }

  // Custom log messages
  static log(message: string) {
    crashlyticsInstance.log(message);
  }

  // Handle fatal errors
  static handleFatalError(error: any) {
    crashlyticsInstance.recordError(error);
  }

  // Force a crash for testing
  static forceCrash() {
    crashlyticsInstance.crash();
  }
}

export default LoggingService;
