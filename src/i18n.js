import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DateTime } from "luxon";

import translationEn from "./locales/en/translation.json";
import translationDe from "./locales/de/translation.json";
import translationEs from "./locales/es/translation.json";
import translationFr from "./locales/fr/translation.json";
import translationIt from "./locales/it/translation.json";
import translationNb_NO from "./locales/nb_NO/translation.json";
import translationZh_Hans from "./locales/zh_Hans/translation.json";
import translationRu from "./locales/ru/translation.json";
import translationJa from "./locales/ja/translation.json";
import translationSv from "./locales/sv/translation.json";

const resources = {
  en: {
    translation: translationEn,
  },
  de: {
    translation: translationDe,
  },
  es: {
    translation: translationEs,
  },
  fr: {
    translation: translationFr,
  },
  it: {
    translation: translationIt,
  },
  nb_NO: {
    translation: translationNb_NO,
  },
  zh_Hans: {
    translation: translationZh_Hans,
  },
  ru: {
    translation: translationRu,
  },
  ja: {
    translation: translationJa,
  },
  sv: {
    translation: translationSv,
  },
};
i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    debug: true,
    fallbackLng: "en",
    interpolation: {
      format: (value, format, lng) => {
        if (value instanceof Date) {
          return DateTime.fromJSDate(value)
            .setLocale(lng)
            .toLocaleString(DateTime[format]);
        }
        return value;
      },
    },
  });

export default i18n;
