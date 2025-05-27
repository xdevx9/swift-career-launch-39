
// For production, you should store the API key in a secure backend
// This is a temporary solution for development
export const GEMINI_CONFIG = {
  // Replace this with your actual API key
  // NOTE: In a production app, this should be handled via a backend service
  API_KEY: 'YOUR_GEMINI_API_KEY_HERE', // Replace with your actual key
  MODEL: 'gemini-2.0-flash-001'
};

// Helper function to get API key from various sources
export const getGeminiApiKey = (): string | null => {
  // Priority order:
  // 1. From localStorage (user input)
  // 2. From config (your hardcoded key)
  // 3. Return null if none available
  
  const userApiKey = localStorage.getItem('ai-resume-builder-gemini-key');
  if (userApiKey) {
    return userApiKey;
  }
  
  if (GEMINI_CONFIG.API_KEY && GEMINI_CONFIG.API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    return GEMINI_CONFIG.API_KEY;
  }
  
  return null;
};
