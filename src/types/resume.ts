
export interface UserBasicInfo {
  fullName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  targetRole?: string;
  experience?: string;
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

export interface CustomSection {
  id: string;
  title: string;
  content: string[];
}

export interface Resume {
  id: string;
  userInfo: UserBasicInfo;
  sections: {
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
    customSections: CustomSection[];
  };
  template: 'modern' | 'classic' | 'minimal';
  language: string;
  lastModified: Date;
  createdAt: Date;
}
