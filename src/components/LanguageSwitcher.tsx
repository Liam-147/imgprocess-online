'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-deep-blue px-3 py-1 rounded"
      >
        <span>{languages.find(lang => lang.code === currentLang)?.name || '中文'}</span>
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-deep-blue rounded shadow-lg z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                currentLang === lang.code ? 'bg-gray-700' : ''
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 