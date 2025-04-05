import tr from "./tr";
import en from "./en";

export { tr, en };

const languages = {
  tr,
  en,
};

export default languages;

export type LanguageCode = keyof typeof languages;
