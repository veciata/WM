import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tr from "./languages/tr";
import en from "./languages/en";

export type LanguageCode = "tr" | "en";

interface LocalizationContextType {
  t: (key: string) => string;
  currentLanguage: LanguageCode;
  setLanguage: (languageCode: LanguageCode) => Promise<void>;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("tr");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage && (savedLanguage === "tr" || savedLanguage === "en")) {
        setCurrentLanguage(savedLanguage as LanguageCode);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const setLanguage = async (languageCode: LanguageCode) => {
    try {
      await AsyncStorage.setItem("language", languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key: string): string => {
    const translations = currentLanguage === "tr" ? tr : en;
    return translations[key as keyof typeof translations] || key;
  };

  const value = {
    t,
    currentLanguage,
    setLanguage,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error("useLocalization must be used within a LocalizationProvider");
  }
  return context;
}

export default LocalizationProvider;
