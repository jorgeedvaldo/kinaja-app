import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Load saved language on startup
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@kina_ja_language');
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
        }
      } catch (e) {
        console.error('Error loading language:', e);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
      await AsyncStorage.setItem('@kina_ja_language', lng);
    } catch (e) {
      console.error('Error changing language:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;
