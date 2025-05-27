
import React, { useState, useEffect } from 'react';
import { Resume } from '@/types/resume';
import { ResumePreview } from './ResumePreview';
import { ResumeForm } from './ResumeForm';
import { AIToolbar } from './AIToolbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveResume } from '@/services/storage.service';
import { Download, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResumeEditorProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const ResumeEditor = ({ resume, onResumeUpdate }: ResumeEditorProps) => {
  const [currentResume, setCurrentResume] = useState<Resume>(resume);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentResume(resume);
  }, [resume]);

  const handleResumeChange = (updatedResume: Resume) => {
    setCurrentResume(updatedResume);
    setHasUnsavedChanges(true);
    onResumeUpdate(updatedResume);
  };

  const handleSave = () => {
    const updatedResume = {
      ...currentResume,
      lastModified: new Date(),
    };
    
    saveResume(updatedResume);
    setCurrentResume(updatedResume);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully.",
    });
  };

  const handleExport = () => {
    // Simple text export for now
    const resumeText = `
${currentResume.userInfo.fullName}
${currentResume.userInfo.email} | ${currentResume.userInfo.phone}
${currentResume.userInfo.location}

PROFESSIONAL SUMMARY
${currentResume.sections.summary}

EXPERIENCE
${currentResume.sections.experience.map(exp => `
${exp.position} at ${exp.company}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.description.join('\n')}
`).join('\n')}

EDUCATION
${currentResume.sections.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution}
${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}
`).join('\n')}

SKILLS
${currentResume.sections.skills.join(', ')}
    `.trim();

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResume.userInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume Exported",
      description: "Your resume has been downloaded as a text file.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Resume Editor
              </h1>
              {hasUnsavedChanges && (
                <span className="text-sm text-amber-600">• Unsaved changes</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleExport}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <AIToolbar resume={currentResume} onResumeUpdate={handleResumeChange} />
            <ResumeForm resume={currentResume} onResumeUpdate={handleResumeChange} />
          </div>
          
          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <ResumePreview resume={currentResume} />
          </div>
        </div>
      </div>
    </div>
  );
};
