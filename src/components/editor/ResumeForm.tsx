
import React from 'react';
import { Resume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Resume</h2>
      
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={resume.userInfo.fullName}
              onChange={(e) => updateUserInfo('fullName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={resume.userInfo.jobTitle}
              onChange={(e) => updateUserInfo('jobTitle', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={resume.userInfo.email || ''}
              onChange={(e) => updateUserInfo('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={resume.userInfo.phone || ''}
              onChange={(e) => updateUserInfo('phone', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resume.userInfo.location || ''}
              onChange={(e) => updateUserInfo('location', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <textarea
          id="summary"
          value={resume.sections.summary}
          onChange={(e) => updateSummary(e.target.value)}
          className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
