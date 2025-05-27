
export interface UserBasicInfo {
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  targetRole?: string;
  experience?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string[];
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  timestamp: Date;
  description: string;
  data: Resume;
  isAutoSave: boolean;
}

export interface Resume {
  id: string;
  userInfo: UserBasicInfo;
  sections: {
    summary: string;
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: string[];
    customSections: CustomSection[];
  };
  template: 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'compact';
  language: string;
  lastModified: Date;
  createdAt: Date;
  atsScore?: number;
  aiSuggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: 'grammar' | 'style' | 'content' | 'ats' | 'keyword';
  section: string;
  field?: string;
  message: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
  applied: boolean;
}
