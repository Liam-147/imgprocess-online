'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言文件
import zhTranslation from './locales/zh.json';
import enTranslation from './locales/en.json';
import jaTranslation from './locales/ja.json';
import koTranslation from './locales/ko.json';

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    resources: {
      zh: { translation: zhTranslation },
      en: { translation: enTranslation },
      ja: { translation: jaTranslation },
      ko: { translation: koTranslation }
    },
      fallbackLng: 'zh',
      interpolation: {
        escapeValue: false
      }
    });

export default i18n; 