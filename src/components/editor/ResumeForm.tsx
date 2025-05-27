
import React from 'react';
import { Resume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Edit } from 'lucide-react';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { TemplateSelector } from './sections/TemplateSelector';

interface ResumeFormProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const ResumeForm = ({ resume, onResumeUpdate }: ResumeFormProps) => {
  const updateResume = (updates: Partial<Resume>) => {
    onResumeUpdate({ ...resume, ...updates });
  };

  const updateUserInfo = (field: string, value: string) => {
    updateResume({
      userInfo: { ...resume.userInfo, [field]: value }
    });
  };

  const updateSummary = (summary: string) => {
    updateResume({
      sections: { ...resume.sections, summary }
    });
  };

  const updateProjects = (projects: any[]) => {
    updateResume({
      sections: { ...resume.sections, projects }
    });
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && newSkill.trim()) {
      updateResume({
        sections: {
          ...resume.sections,
          skills: [...resume.sections.skills, newSkill.trim()]
        }
      });
    }
  };

  const removeSkill = (index: number) => {
    updateResume({
      sections: {
        ...resume.sections,
        skills: resume.sections.skills.filter((_, i) => i !== index)
      }
    });
  };

  const updateTemplate = (template: string) => {
    updateResume({ template: template as any });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Resume</h2>
      
      {/* Template Selection */}
      <TemplateSelector 
        currentTemplate={resume.template} 
        onTemplateChange={updateTemplate} 
      />
      
      {/* Personal Information */}
      <PersonalInfoSection
        userInfo={resume.userInfo}
        onUpdate={updateUserInfo}
      />

      {/* Professional Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={resume.sections.summary}
          onChange={(e) => updateSummary(e.target.value)}
          className="h-24"
          placeholder="Write a compelling professional summary..."
        />
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Skills</Label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline"
            onClick={addSkill}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Skill
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.sections.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects */}
      <ProjectsSection
        projects={resume.sections.projects || []}
        onUpdate={updateProjects}
      />

      {/* Experience Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Experience</Label>
          <Button type="button" size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Experience
          </Button>
        </div>
        <div className="space-y-4">
          {resume.sections.experience.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{exp.position} at {exp.company}</h4>
                <Button type="button" size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {exp.description.map((desc, descIndex) => (
                  <li key={descIndex}>• {desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Education</Label>
          <Button type="button" size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Education
          </Button>
        </div>
        <div className="space-y-4">
          {resume.sections.education.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                <Button type="button" size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-600">
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
