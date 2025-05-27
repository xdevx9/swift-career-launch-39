
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '@/config/gemini.config';

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  if (!ai) {
    const apiKey = getGeminiApiKey();
    if (apiKey) {
      ai = new GoogleGenAI({ apiKey });
    }
  }
  return ai;
};

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi'
};

export const translateContent = async (content: string, targetLanguage: string): Promise<string> => {
  const aiInstance = initializeAI();
  if (!aiInstance) {
    throw new Error('Translation service not available');
  }

  const languageName = SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES];
  
  const prompt = `Translate the following resume content to ${languageName}. Maintain professional tone and formatting. Return only the translated text without any additional formatting or explanations:

${content}`;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    return response.text?.trim() || content;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate content');
  }
};

export const translateResume = async (resume: any, targetLanguage: string) => {
  const aiInstance = initializeAI();
  if (!aiInstance) {
    throw new Error('Translation service not available');
  }

  const languageName = SUPPORTED_LANGUAGES[targetLanguage as keyof typeof SUPPORTED_LANGUAGES];
  
  const resumeContent = {
    summary: resume.sections.summary,
    experience: resume.sections.experience,
    education: resume.sections.education,
    skills: resume.sections.skills
  };

  const prompt = `Translate this entire resume to ${languageName}. Keep the JSON structure exactly the same but translate all text content. Maintain professional resume language:

${JSON.stringify(resumeContent, null, 2)}`;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    let translatedContent = response.text?.trim() || '';
    
    // Clean up response
    if (translatedContent.includes('```json')) {
      translatedContent = translatedContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    
    const translatedData = JSON.parse(translatedContent);
    
    return {
      ...resume,
      sections: {
        ...resume.sections,
        summary: translatedData.summary,
        experience: translatedData.experience,
        education: translatedData.education,
        skills: translatedData.skills
      },
      language: targetLanguage
    };
  } catch (error) {
    console.error('Resume translation error:', error);
    throw new Error('Failed to translate resume');
  }
};
