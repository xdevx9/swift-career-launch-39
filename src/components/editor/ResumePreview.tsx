
import React from 'react';
import { Resume } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  const renderTemplate = () => {
    switch (resume.template) {
      case 'classic':
        return <ClassicTemplate resume={resume} />;
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4 overflow-auto">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden min-h-[11in] transform scale-75 origin-top">
        <div className="p-8">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
