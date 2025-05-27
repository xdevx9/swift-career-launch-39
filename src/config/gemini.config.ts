
export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem('gemini-api-key');
};
