import { languages, LanguageCode } from "./languages/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "wm_app_language";

export const useLocalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLanguage && savedLanguage in languages) {
          setCurrentLanguage(savedLanguage as LanguageCode);
        }
      } catch (error) {
        console.error("Failed to load language", error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (languageCode: LanguageCode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error("Failed to save language", error);
    }
  };

  const t = (key: keyof typeof languages.en) => {
    return languages[currentLanguage][key] || languages.en[key];
  };

  return { t, currentLanguage, changeLanguage };
};
