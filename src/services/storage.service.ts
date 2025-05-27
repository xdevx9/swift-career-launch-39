import { Resume, UserBasicInfo } from '@/types/resume';

const STORAGE_KEYS = {
  RESUMES: 'ai-resume-builder-resumes',
  CURRENT_RESUME: 'ai-resume-builder-current',
  USER_INFO: 'ai-resume-builder-user-info',
  GEMINI_API_KEY: 'ai-resume-builder-gemini-key'
};

export const saveResume = (resume: Resume): void => {
  try {
    const resumes = getResumes();
    const existingIndex = resumes.findIndex(r => r.id === resume.id);
    
    if (existingIndex >= 0) {
      resumes[existingIndex] = resume;
    } else {
      resumes.push(resume);
    }
    
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
    localStorage.setItem(STORAGE_KEYS.CURRENT_RESUME, JSON.stringify(resume));
  } catch (error) {
    console.error('Error saving resume:', error);
  }
};

export const getResumes = (): Resume[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESUMES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading resumes:', error);
    return [];
  }
};

export const getCurrentResume = (): Resume | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_RESUME);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading current resume:', error);
    return null;
  }
};

export const deleteResume = (id: string): void => {
  try {
    const resumes = getResumes().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
    
    const current = getCurrentResume();
    if (current?.id === id) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RESUME);
    }
  } catch (error) {
    console.error('Error deleting resume:', error);
  }
};

export const saveUserInfo = (userInfo: UserBasicInfo): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

export const getUserInfo = (): UserBasicInfo | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading user info:', error);
    return null;
  }
};

export const saveGeminiApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key:', error);
  }
};

export const getGeminiApiKey = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
  } catch (error) {
    console.error('Error loading API key:', error);
    return null;
  }
};
