
import { GoogleGenAI } from '@google/genai';
import { Resume, AISuggestion } from '@/types/resume';
import { getGeminiApiKey } from '@/services/storage.service';

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
    throw new Error('AI not initialized. Please provide your API key.');
  }

  const prompt = `
    Analyze this resume content and provide specific suggestions for improvement:
    
    ${JSON.stringify(resume, null, 2)}
    
    Please provide suggestions in the following categories:
    1. Grammar and spelling errors
    2. Style and readability improvements  
    3. Content enhancement (stronger action verbs, quantified achievements)
    4. ATS optimization (keyword usage, formatting)
    5. Missing information or sections
    
    Return a JSON array of suggestions with this format:
    [
      {
        "type": "grammar|style|content|ats|keyword",
        "section": "summary|experience|education|skills|projects",
        "field": "specific field name if applicable",
        "message": "Description of the issue",
        "suggestion": "Specific improvement suggestion",
        "severity": "low|medium|high"
      }
    ]
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    let content = response.text.trim();
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }

    const suggestions = JSON.parse(content);
    return suggestions.map((suggestion: any, index: number) => ({
      id: `suggestion-${index}`,
      applied: false,
      ...suggestion,
    }));
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return [];
  }
};

export const calculateATSScore = async (resume: Resume): Promise<number> => {
  const aiInstance = initializeAI();
  if (!aiInstance) return 0;

  const prompt = `
    Analyze this resume for ATS (Applicant Tracking System) compatibility and return a detailed score from 0-100.
    
    Evaluate these specific criteria:
    1. Contact Information (10 points): Complete name, email, phone, location
    2. Section Headers (15 points): Clear, standard headers like "Experience", "Education", "Skills"
    3. Formatting (20 points): Simple formatting, no tables/graphics, consistent bullet points
    4. Keywords (25 points): Industry-relevant keywords and skills
    5. Experience Details (15 points): Job titles, companies, dates, quantified achievements
    6. Education (10 points): Degree, institution, graduation date
    7. Skills Section (5 points): Relevant technical and soft skills listed
    
    Resume content: ${JSON.stringify(resume)}
    
    Provide a detailed breakdown and return ONLY a JSON object with this format:
    {
      "totalScore": 85,
      "breakdown": {
        "contactInfo": 8,
        "sectionHeaders": 12,
        "formatting": 18,
        "keywords": 20,
        "experience": 13,
        "education": 9,
        "skills": 5
      },
      "feedback": "Brief explanation of the score"
    }
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    let content = response.text.trim();
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }

    const result = JSON.parse(content);
    return result.totalScore || 0;
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

  const prompt = `
    Optimize this resume to better match the job description while keeping all information truthful.
    
    Current Resume: ${JSON.stringify(resume)}
    
    Job Description: ${jobDescription}
    
    Provide improvements for:
    1. Professional summary tailored to the role
    2. Skills reordering/highlighting relevant ones
    3. Experience descriptions emphasizing relevant achievements
    4. Suggested keywords to include
    
    Return only the modified sections in JSON format:
    {
      "summary": "improved summary",
      "skills": ["reordered skills array"],
      "experience": [updated experience entries with same structure],
      "suggestions": ["keyword suggestions array"]
    }
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    let content = response.text.trim();
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw error;
  }
};
