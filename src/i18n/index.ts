import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from '@/locales/en-US/translation.json';
import translationAr from '@/locales/ar-DZ/translation.json';
import translationFr from '@/locales/fr-FR/translation.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  'ar-DZ': { common: translationAr },
  'en-US': { common: translationEn },
  'fr-FR': { common: translationFr }
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
