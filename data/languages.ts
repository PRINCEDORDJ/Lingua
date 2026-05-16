import { Language } from '../types/learning';
import { units } from './units';

export const languages: Language[] = [
  {
    id: 'es',
    name: 'Spanish',
    code: 'es',
    flag: 'https://flagcdn.com/w320/es.png',
    units: units['es'] || [],
  },
  {
    id: 'fr',
    name: 'French',
    code: 'fr',
    flag: 'https://flagcdn.com/w320/fr.png',
    units: units['fr'] || [],
  },
  {
    id: 'de',
    name: 'German',
    code: 'de',
    flag: 'https://flagcdn.com/w320/de.png',
    units: units['de'] || [],
  },
  {
    id: 'it',
    name: 'Italian',
    code: 'it',
    flag: 'https://flagcdn.com/w320/it.png',
    units: units['it'] || [],
  },
  {
    id: 'ja',
    name: 'Japanese',
    code: 'ja',
    flag: 'https://flagcdn.com/w320/jp.png',
    units: units['ja'] || [],
  },
  {
    id: 'en',
    name: 'English',
    code: 'en',
    flag: 'https://flagcdn.com/w320/us.png',
    units: units['en'] || [],
  }
];
