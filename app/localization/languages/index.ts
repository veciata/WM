import en from "./en";
import tr from "./tr";

export const languages = {
  en,
  tr,
};

export type LanguageCode = keyof typeof languages;
