
import { Resume } from '@/types/resume';

const STORAGE_KEY = 'ai-resume-builder-resume';
const API_KEY_STORAGE_KEY = 'gemini-api-key';

export const saveResume = (resume: Resume): void => {
  try {
    const resumeData = {
      ...resume,
      lastModified: new Date(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  } catch (error) {
    console.error('Error saving resume:', error);
  }
};

export const getCurrentResume = (): Resume | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading resume:', error);
    return null;
  }
};

export const clearResume = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};
