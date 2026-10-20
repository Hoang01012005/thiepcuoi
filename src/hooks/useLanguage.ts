import { useState, useEffect } from 'react';
import { translations, type Language } from '../config/translations';

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('wedding_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('wedding_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = translations[lang];

  return { lang, setLang, toggleLang, t };
}
