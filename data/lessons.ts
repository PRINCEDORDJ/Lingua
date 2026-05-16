import { Lesson } from '../types/learning';

export const lessons: Record<string, Lesson[]> = {
  'es-unit-1': [
    {
      id: 'es-l1',
      unitId: 'es-unit-1',
      title: 'Hola! Basics',
      description: 'Learn basic greetings and introductions in Spanish.',
      type: 'vocabulary',
      xpReward: 10,
      activities: [
        {
          id: 'es-l1-a1',
          type: 'multiple-choice',
          question: 'How do you say "Hola" in Spanish?',
          options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
          correctAnswer: 'Hola',
        },
        {
          id: 'es-l1-a2',
          type: 'translation',
          question: 'Translate: "Buenos días"',
          correctAnswer: 'Good morning',
        },
        {
          id: 'es-l1-a3',
          type: 'listening',
          question: 'Listen and select the correct word',
          correctAnswer: 'Gracias',
          audioUrl: 'https://example.com/audio/es/gracias.mp3',
        }
      ],
      vocabulary: [
        {
          id: 'es-v1',
          word: 'Hola',
          translation: 'Hello',
          phonetic: '/ˈola/',
          exampleSentence: 'Hola, ¿cómo estás?',
        },
        {
          id: 'es-v2',
          word: 'Gracias',
          translation: 'Thank you',
          phonetic: '/ˈɡɾasjas/',
        }
      ],
      goals: [
        { id: 'es-g1', description: 'Master basic greetings' },
        { id: 'es-g2', description: 'Learn to say thank you' }
      ],
      aiTeacherPrompt: {
        id: 'es-ai-p1',
        context: 'A student is learning basic greetings for the first time.',
        instructions: 'Encourage the student to practice "Hola" and "Buenos días". Use a friendly, upbeat tone.',
        sampleDialogues: [
          { role: 'teacher', text: '¡Hola! Bienvenido a tu primera clase de español.' },
          { role: 'student', text: 'Hola, teacher!' },
          { role: 'teacher', text: 'Excelente. Ahora intenta decir: Buenos días.' }
        ]
      }
    },
    {
      id: 'es-l2',
      unitId: 'es-unit-1',
      title: 'Common Objects',
      description: 'Learn the names of everyday items in Spanish.',
      type: 'vocabulary',
      xpReward: 15,
      activities: [
        {
          id: 'es-l2-a1',
          type: 'matching',
          question: 'Match the object to its Spanish name',
          options: ['Libro - Book', 'Mesa - Table', 'Silla - Chair'],
          correctAnswer: 'Libro - Book, Mesa - Table, Silla - Chair',
        }
      ],
      vocabulary: [
        { id: 'es-v3', word: 'Libro', translation: 'Book' },
        { id: 'es-v4', word: 'Mesa', translation: 'Table' }
      ]
    },
    {
      id: 'es-l3',
      unitId: 'es-unit-1',
      title: 'Family Members',
      description: 'Learn the words for family members in Spanish.',
      type: 'vocabulary',
      xpReward: 15,
      activities: [
        {
          id: 'es-l3-a1',
          type: 'translation',
          question: 'Translate: "La madre"',
          correctAnswer: 'The mother',
        }
      ],
      vocabulary: [
        { id: 'es-v5', word: 'Madre', translation: 'Mother' },
        { id: 'es-v6', word: 'Padre', translation: 'Father' }
      ]
    }
  ],
  'fr-unit-1': [
    {
      id: 'fr-l1',
      unitId: 'fr-unit-1',
      title: 'Bonjour! Basics',
      description: 'Learn basic greetings in French.',
      type: 'vocabulary',
      xpReward: 10,
      activities: [
        {
          id: 'fr-l1-a1',
          type: 'multiple-choice',
          question: 'How do you say "Hello" in French?',
          options: ['Bonjour', 'Salut', 'Au revoir', 'Merci'],
          correctAnswer: 'Bonjour',
        }
      ],
      vocabulary: [
        { id: 'fr-v1', word: 'Bonjour', translation: 'Hello/Good day', phonetic: '/bɔ̃ʒuʁ/' }
      ],
      aiTeacherPrompt: {
        id: 'fr-ai-p1',
        context: 'A student is learning French greetings.',
        instructions: 'Focus on the pronunciation of "Bonjour". Be encouraging.',
        sampleDialogues: [
          { role: 'teacher', text: 'Bonjour ! Comment ça va ?' },
          { role: 'student', text: 'Bonjour ! Ça va bien.' }
        ]
      }
    },
    {
      id: 'fr-l2',
      unitId: 'fr-unit-1',
      title: 'Common Colors',
      description: 'Learn basic colors in French.',
      type: 'vocabulary',
      xpReward: 12,
      activities: [
        {
          id: 'fr-l2-a1',
          type: 'multiple-choice',
          question: 'What color is "Bleu"?',
          options: ['Blue', 'Red', 'Green', 'Yellow'],
          correctAnswer: 'Blue',
        }
      ],
      vocabulary: [
        { id: 'fr-v2', word: 'Bleu', translation: 'Blue' },
        { id: 'fr-v3', word: 'Rouge', translation: 'Red' }
      ]
    }
  ],
  'ja-unit-1': [
    {
      id: 'ja-l1',
      unitId: 'ja-unit-1',
      title: 'Hiragana Basics',
      description: 'Learn the first few Hiragana characters.',
      type: 'vocabulary',
      xpReward: 10,
      activities: [
        {
          id: 'ja-l1-a1',
          type: 'multiple-choice',
          question: 'Which character is "a"?',
          options: ['あ', 'い', 'う', 'え'],
          correctAnswer: 'あ',
        }
      ],
      vocabulary: [
        { id: 'ja-v1', word: 'あ (a)', translation: 'a' },
        { id: 'ja-v2', word: 'い (i)', translation: 'i' }
      ]
    },
    {
      id: 'ja-l2',
      unitId: 'ja-unit-1',
      title: 'Common Greetings',
      description: 'Learn how to say hello and goodbye in Japanese.',
      type: 'vocabulary',
      xpReward: 15,
      activities: [
        {
          id: 'ja-l2-a1',
          type: 'translation',
          question: 'Translate: "こんにちは"',
          correctAnswer: 'Hello',
        }
      ],
      vocabulary: [
        { id: 'ja-v3', word: 'こんにちは (Konnichiwa)', translation: 'Hello' },
        { id: 'ja-v4', word: 'さようなら (Sayounara)', translation: 'Goodbye' }
      ]
    }
  ],
  'en-unit-1': [
    {
      id: 'en-l1',
      unitId: 'en-unit-1',
      title: 'English Greetings',
      description: 'Master the most common English greetings.',
      type: 'vocabulary',
      xpReward: 10,
      activities: [
        {
          id: 'en-l1-a1',
          type: 'multiple-choice',
          question: 'How do you say "Hola" in English?',
          options: ['Hello', 'Goodbye', 'Please', 'Thanks'],
          correctAnswer: 'Hello',
        }
      ],
      vocabulary: [
        { id: 'en-v1', word: 'Hello', translation: 'Hola' }
      ]
    },
    {
      id: 'en-l2',
      unitId: 'en-unit-1',
      title: 'Numbers 1-10',
      description: 'Learn to count in English.',
      type: 'vocabulary',
      xpReward: 12,
      activities: [
        {
          id: 'en-l2-a1',
          type: 'multiple-choice',
          question: 'What is the number "Five"?',
          options: ['5', '3', '8', '10'],
          correctAnswer: '5',
        }
      ],
      vocabulary: [
        { id: 'en-v2', word: 'One', translation: 'Uno' },
        { id: 'en-v3', word: 'Two', translation: 'Dos' }
      ]
    }
  ],
  'de-unit-1': [
    {
      id: 'de-l1',
      unitId: 'de-unit-1',
      title: 'German Basics',
      description: 'Learn basic German greetings.',
      type: 'vocabulary',
      xpReward: 10,
      activities: [
        {
          id: 'de-l1-a1',
          type: 'multiple-choice',
          question: 'How do you say "Hello" in German?',
          options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'],
          correctAnswer: 'Hallo',
        }
      ],
      vocabulary: [
        { id: 'de-v1', word: 'Hallo', translation: 'Hello' }
      ]
    }
  ],
  'it-unit-1': [
    {
      id: 'it-l1',
      unitId: 'it-unit-1',
      title: 'Italian Basics',
      description: 'Learn basic Italian greetings.',
      type: 'vocabulary',
      xpReward: 10,
      activities: [
        {
          id: 'it-l1-a1',
          type: 'multiple-choice',
          question: 'How do you say "Hello" in Italian?',
          options: ['Ciao', 'Arrivederci', 'Grazie', 'Prego'],
          correctAnswer: 'Ciao',
        }
      ],
      vocabulary: [
        { id: 'it-v1', word: 'Ciao', translation: 'Hello/Hi' }
      ]
    }
  ]
};
