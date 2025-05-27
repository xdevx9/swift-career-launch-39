
import React from 'react';
import { Resume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, FileText, User, Briefcase, GraduationCap, Code, Award } from 'lucide-react';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
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

  const updateExperience = (experience: any[]) => {
    updateResume({
      sections: { ...resume.sections, experience }
    });
  };

  const updateEducation = (education: any[]) => {
    updateResume({
      sections: { ...resume.sections, education }
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Resume Editor</h2>
        </div>
        
        {/* Template Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateSelector 
              currentTemplate={resume.template} 
              onTemplateChange={updateTemplate} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PersonalInfoSection
            userInfo={resume.userInfo}
            onUpdate={updateUserInfo}
          />
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resume.sections.summary}
            onChange={(e) => updateSummary(e.target.value)}
            className="h-32"
            placeholder="Write a compelling professional summary that highlights your key qualifications and career objectives..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Tip: Keep it concise (2-3 sentences) and focus on your most relevant achievements.
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills
            </div>
            <Button 
              type="button" 
              size="sm" 
              variant="outline"
              onClick={addSkill}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resume.sections.skills.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No skills added yet</p>
              <p className="text-sm">Click "Add Skill" to get started</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {resume.sections.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExperienceSection
            experience={resume.sections.experience}
            onUpdate={updateExperience}
          />
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EducationSection
            education={resume.sections.education}
            onUpdate={updateEducation}
          />
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectsSection
            projects={resume.sections.projects || []}
            onUpdate={updateProjects}
          />
        </CardContent>
      </Card>
    </div>
  );
};
