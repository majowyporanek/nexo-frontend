import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import plAuth from './locales/pl/auth.json';
import enCommon from './locales/en/common.json';
import plCommon from './locales/pl/common.json';

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
  },
  pl: {
    auth: plAuth,
    common: plCommon,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (typeof window !== 'undefined' && localStorage.getItem('nexo_lang')) || 'pl', // Default language (persisted)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;