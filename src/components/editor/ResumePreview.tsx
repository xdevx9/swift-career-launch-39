
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
    <div className="bg-gray-100 p-4 rounded-lg">
      {renderTemplate()}
    </div>
  );
};
