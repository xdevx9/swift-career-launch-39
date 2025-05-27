
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeEditor } from '@/components/editor/ResumeEditor';
import { Resume } from '@/types/resume';
import { getCurrentResume, saveResume } from '@/services/storage.service';
import { Loader2 } from 'lucide-react';

const Editor = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResume = () => {
      const currentResume = getCurrentResume();
      
      if (!currentResume) {
        // No resume found, redirect to onboarding
        navigate('/create');
        return;
      }
      
      setResume(currentResume);
      setLoading(false);
    };

    loadResume();
  }, [navigate]);

  const handleResumeUpdate = (updatedResume: Resume) => {
    setResume(updatedResume);
    saveResume(updatedResume);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return null; // Will redirect in useEffect
  }

  return (
    <ResumeEditor 
      resume={resume} 
      onResumeUpdate={handleResumeUpdate}
    />
  );
};

export default Editor;
