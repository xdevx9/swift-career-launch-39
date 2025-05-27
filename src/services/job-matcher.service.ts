
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '@/config/gemini.config';
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
    throw new Error('Job matcher service not available');
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

  const prompt = `Analyze how well this resume matches the following job description and provide suggestions for improvement.

RESUME:
${JSON.stringify(resumeContent, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Please provide a JSON response with the following structure:
{
  "matchScore": (number between 0-100),
  "missingSkills": ["skill1", "skill2"],
  "suggestedImprovements": {
    "summary": "improved summary text",
    "experience": ["suggestion1", "suggestion2"],
    "skills": ["skill1", "skill2"]
  },
  "keywordSuggestions": ["keyword1", "keyword2"]
}

Focus on:
1. Skills alignment
2. Experience relevance
3. Keywords from job description
4. Industry-specific terminology

Return only valid JSON.`;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    let content = response.text?.trim() || '';
    
    // Clean up response
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Job match analysis error:', error);
    throw new Error('Failed to analyze job match');
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
