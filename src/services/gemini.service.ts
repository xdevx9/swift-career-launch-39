
import { GoogleGenAI } from '@google/genai';
import { UserBasicInfo, Resume } from '@/types/resume';

let ai: GoogleGenAI | null = null;

export const initializeGemini = (apiKey: string) => {
  ai = new GoogleGenAI({ apiKey });
};

export const generateResumeContent = async (userInfo: UserBasicInfo): Promise<Partial<Resume['sections']>> => {
  if (!ai) {
    throw new Error('Gemini AI not initialized. Please provide your API key.');
  }

  const prompt = `
    Create a professional resume content for the following person:
    
    Name: ${userInfo.fullName}
    Target Job Title: ${userInfo.jobTitle}
    ${userInfo.targetRole ? `Target Role: ${userInfo.targetRole}` : ''}
    ${userInfo.experience ? `Experience Level: ${userInfo.experience}` : ''}
    
    Generate ONLY the following sections in JSON format:
    1. summary - A compelling 2-3 sentence professional summary
    2. experience - Array of 2-3 relevant work experiences with realistic details
    3. education - Array of 1-2 education entries
    4. skills - Array of 8-12 relevant technical and soft skills
    
    Make it ATS-friendly and industry-appropriate. Return only valid JSON without any markdown formatting.
    
    Format:
    {
      "summary": "Professional summary here...",
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
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    const content = response.text;
    console.log('Gemini response:', content);
    
    // Parse the JSON response
    const resumeData = JSON.parse(content);
    
    // Add IDs to the data
    resumeData.experience = resumeData.experience?.map((exp: any, index: number) => ({
      ...exp,
      id: `exp-${index}`,
    })) || [];
    
    resumeData.education = resumeData.education?.map((edu: any, index: number) => ({
      ...edu,
      id: `edu-${index}`,
    })) || [];
    
    resumeData.customSections = [];
    
    return resumeData;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Failed to generate resume content. Please try again.');
  }
};

export const enhanceContent = async (content: string, type: 'summary' | 'experience' | 'skills'): Promise<string> => {
  if (!ai) {
    throw new Error('Gemini AI not initialized.');
  }

  const prompts = {
    summary: `Improve this professional summary to be more compelling and ATS-friendly: "${content}"`,
    experience: `Enhance this job description with stronger action verbs and quantified achievements: "${content}"`,
    skills: `Suggest additional relevant skills to complement this list: "${content}"`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: prompts[type],
  });

  return response.text || content;
};
