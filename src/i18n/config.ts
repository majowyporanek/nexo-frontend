import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import plAuth from './locales/pl/auth.json';

const resources = {
  en: {
    auth: enAuth,
  },
  pl: {
    auth: plAuth,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pl', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;