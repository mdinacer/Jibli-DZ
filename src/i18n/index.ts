import translationEn from '@/locales/en-US/translation.json';
import errorsEn from '@/locales/en-US/errors.json';
import notificationsEn from '@/locales/en-US/notifications.json';
import translationFr from '@/locales/fr-FR/translation.json';
import errorsFr from '@/locales/fr-FR/errors.json';
import notificationsFr from '@/locales/fr-FR/notifications.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  // 'ar-DZ': { common: translationAr },
  'en-US': {
    common: translationEn,
    errors: errorsEn,
    notifications: notificationsEn
  },
  'fr-FR': {
    common: translationFr,
    errors: errorsFr,
    notifications: notificationsFr
  }
};
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = 'en-US';
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: savedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  });
};

initI18n();

export default i18n;
