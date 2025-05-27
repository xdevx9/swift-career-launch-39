
const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini-api-key',
  OPENAI_API_KEY: 'openai-api-key',
} as const;

export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
};

export const setGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
};

export const getOpenAIApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.OPENAI_API_KEY);
};

export const setOpenAIApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.OPENAI_API_KEY, apiKey);
};

export const hasGeminiApiKey = (): boolean => {
  return !!getGeminiApiKey();
};

export const hasOpenAIApiKey = (): boolean => {
  return !!getOpenAIApiKey();
};
