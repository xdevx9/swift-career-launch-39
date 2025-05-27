
import { GoogleGenAI } from '@google/genai';
import { UserBasicInfo, Resume } from '@/types/resume';
import { getGeminiApiKey } from '@/config/api.config';

let ai: GoogleGenAI | null = null;

export const initializeGemini = (apiKey: string) => {
  ai = new GoogleGenAI({ apiKey });
};

export const generateResumeContent = async (userInfo: UserBasicInfo): Promise<Partial<Resume['sections']>> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API not initialized. Please provide your API key.');
  }
  
  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }

  const prompt = `Create professional resume content for: ${userInfo.fullName}, targeting ${userInfo.jobTitle}.

Generate realistic, ATS-friendly content in this exact JSON format:
{
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "startDate": "2022-01",
      "endDate": "2024-01",
      "current": false,
      "description": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "2018-09",
      "endDate": "2022-05",
      "current": false
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"]
}`;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text().trim();
    
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    
    const resumeData = JSON.parse(content);
    
    // Add IDs to the data
    resumeData.experience = resumeData.experience?.map((exp: any, index: number) => ({
      ...exp,
      id: `exp-${Date.now()}-${index}`,
    })) || [];
    
    resumeData.education = resumeData.education?.map((edu: any, index: number) => ({
      ...edu,
      id: `edu-${Date.now()}-${index}`,
    })) || [];
    
    resumeData.customSections = [];
    
    return resumeData;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Failed to generate resume content. Please try again.');
  }
};

export const enhanceContent = async (content: string, type: 'summary' | 'experience' | 'skills'): Promise<string> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey || !ai) {
    throw new Error('Gemini AI not initialized.');
  }

  const prompts = {
    summary: `Improve this professional summary to be more compelling and ATS-friendly: "${content}"`,
    experience: `Enhance this job description with stronger action verbs and quantified achievements: "${content}"`,
    skills: `Suggest 5 additional relevant skills to complement: "${content}"`
  };

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompts[type]);
    const response = await result.response;
    return response.text().trim() || content;
  } catch (error) {
    console.error('Error enhancing content:', error);
    return content;
  }
};
