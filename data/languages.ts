import { Language } from '../types/learning';
import { units } from './units';

export const languages: Language[] = [
  {
    id: 'es',
    name: 'Spanish',
    code: 'es',
    flag: 'https://flagcdn.com/w320/es.png',
    learnerCount: '28.4M learners',
    units: units['es'] || [],
  },
  {
    id: 'fr',
    name: 'French',
    code: 'fr',
    flag: 'https://flagcdn.com/w320/fr.png',
    learnerCount: '19.4M learners',
    units: units['fr'] || [],
  },
  {
    id: 'ja',
    name: 'Japanese',
    code: 'ja',
    flag: 'https://flagcdn.com/w320/jp.png',
    learnerCount: '12.7M learners',
    units: units['ja'] || [],
  },
  {
    id: 'ko',
    name: 'Korean',
    code: 'ko',
    flag: 'https://flagcdn.com/w320/kr.png',
    learnerCount: '9.3M learners',
    units: units['ko'] || [],
  },
  {
    id: 'de',
    name: 'German',
    code: 'de',
    flag: 'https://flagcdn.com/w320/de.png',
    learnerCount: '8.1M learners',
    units: units['de'] || [],
  },
  {
    id: 'zh',
    name: 'Chinese',
    code: 'zh',
    flag: 'https://flagcdn.com/w320/cn.png',
    learnerCount: '7.4M learners',
    units: units['zh'] || [],
  },
];
