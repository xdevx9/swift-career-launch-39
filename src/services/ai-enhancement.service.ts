
import { GoogleGenAI } from '@google/genai';
import { Resume, AISuggestion } from '@/types/resume';
import { getGeminiApiKey } from '@/config/api.config';

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  const apiKey = getGeminiApiKey();
  if (apiKey && !ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const analyzeResumeContent = async (resume: Resume): Promise<AISuggestion[]> => {
  const aiInstance = initializeAI();
  if (!aiInstance) {
    throw new Error('AI not initialized. Please provide your API key in settings.');
  }

  const resumeText = `
    Name: ${resume.userInfo.fullName}
    Title: ${resume.userInfo.jobTitle}
    Summary: ${resume.sections.summary}
    Experience: ${resume.sections.experience.map(exp => `${exp.position} at ${exp.company}: ${exp.description.join(', ')}`).join('; ')}
    Education: ${resume.sections.education.map(edu => `${edu.degree} from ${edu.institution}`).join('; ')}
    Skills: ${resume.sections.skills.join(', ')}
  `;

  const prompt = `Analyze this resume and provide 5-8 specific suggestions for improvement. Focus on ATS optimization, content enhancement, and professional presentation.

Resume content:
${resumeText}

Return a JSON array with this exact format:
[
  {
    "type": "ats|content|grammar|style|keyword",
    "section": "summary|experience|education|skills|userInfo",
    "field": "specific field name if applicable",
    "message": "Brief description of the issue",
    "suggestion": "Specific improvement recommendation",
    "severity": "low|medium|high"
  }
]`;

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text().trim();
    
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }

    const suggestions = JSON.parse(content);
    return suggestions.map((suggestion: any, index: number) => ({
      id: `suggestion-${Date.now()}-${index}`,
      applied: false,
      ...suggestion,
    }));
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume. Please check your API key and try again.');
  }
};

export const calculateATSScore = async (resume: Resume): Promise<number> => {
  const aiInstance = initializeAI();
  if (!aiInstance) return 0;

  const prompt = `Rate this resume for ATS compatibility on a scale of 0-100. Consider: contact info completeness (10%), clear section headers (15%), simple formatting (20%), relevant keywords (25%), detailed experience (15%), education info (10%), skills section (5%).

Resume: ${JSON.stringify(resume)}

Return only a number between 0-100.`;

  try {
    const model = aiInstance.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const scoreText = response.text().trim();
    const score = parseInt(scoreText.match(/\d+/)?.[0] || '0');
    return Math.min(Math.max(score, 0), 100);
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    return 0;
  }
};

export const optimizeForJobDescription = async (
  resume: Resume,
  jobDescription: string
): Promise<Partial<Resume>> => {
  const aiInstance = initializeAI();
  if (!aiInstance) {
    throw new Error('AI not initialized.');
  }

  const prompt = `Optimize this resume for the job description. Suggest improvements while keeping information truthful.

Resume: ${JSON.stringify(resume.sections)}
Job Description: ${jobDescription}

Return JSON with improved sections:
{
  "summary": "improved summary",
  "skills": ["relevant skills array"],
  "suggestions": ["keyword suggestions"]
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
    console.error('Error optimizing resume:', error);
    throw error;
  }
};
