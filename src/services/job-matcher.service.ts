
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '@/config/api.config';
import { Resume } from '@/types/resume';

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

export interface JobMatchSuggestions {
  matchScore: number;
  missingSkills: string[];
  suggestedImprovements: {
    summary?: string;
    experience?: string[];
    skills?: string[];
  };
  keywordSuggestions: string[];
}

export const analyzeJobMatch = async (resume: Resume, jobDescription: string): Promise<JobMatchSuggestions> => {
  const aiInstance = initializeAI();
  if (!aiInstance) {
    throw new Error('Job matcher service not available. Please configure your API key.');
  }

  const resumeContent = {
    summary: resume.sections.summary,
    experience: resume.sections.experience.map(exp => ({
      position: exp.position,
      company: exp.company,
      description: exp.description
    })),
    skills: resume.sections.skills
  };

  const prompt = `Analyze how well this resume matches the job description. Provide specific feedback.

RESUME:
${JSON.stringify(resumeContent, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Return JSON in this exact format:
{
  "matchScore": 75,
  "missingSkills": ["skill1", "skill2"],
  "suggestedImprovements": {
    "summary": "improved summary text",
    "experience": ["suggestion1", "suggestion2"],
    "skills": ["skill1", "skill2"]
  },
  "keywordSuggestions": ["keyword1", "keyword2"]
}`;

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text().trim();
    
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Job match analysis error:', error);
    throw new Error('Failed to analyze job match. Please try again.');
  }
};

export const optimizeResumeForJob = async (resume: Resume, jobDescription: string): Promise<Resume> => {
  const suggestions = await analyzeJobMatch(resume, jobDescription);
  
  return {
    ...resume,
    sections: {
      ...resume.sections,
      summary: suggestions.suggestedImprovements.summary || resume.sections.summary,
      skills: [...new Set([...resume.sections.skills, ...(suggestions.suggestedImprovements.skills || [])])],
    }
  };
};
