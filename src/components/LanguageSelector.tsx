import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  I18nManager,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

const languages = [
  { lang: 'ar-DZ', name: 'Arabic' },
  { lang: 'en-US', name: 'English' },
  { lang: 'fr-FR', name: 'French' }
];

const LanguageSelector = () => {
  const { top } = useSafeAreaInsets();
  const { y } = useSafeAreaFrame();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  const setRTL = useCallback((lang: string) => {
    const shouldBeRTL = lang === 'ar-DZ';
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    Updates.reloadAsync();
  }, []);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    setRTL(lang);
  };
  return (
    <View
      className="h-8 w-full bg-pink-500"
      style={{
        flexGrow: 1,

        top,
        position: 'absolute',
        zIndex: 5
      }}
    >
      <ScrollView
        className="w-full"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', paddingVertical: 10 }}
      >
        {languages.map(({ lang, name }) => (
          <TouchableOpacity
            key={name}
            onPress={() => changeLanguage(lang)}
            style={[
              { paddingHorizontal: 10, height: 16 },
              currentLanguage === lang && { transform: [{ scale: 1.2 }] },
              currentLanguage !== lang && { opacity: 0.5 }
            ]}
          >
            <Text>{name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default LanguageSelector;
