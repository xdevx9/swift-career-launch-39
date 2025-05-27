
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { Resume, UserBasicInfo } from '@/types/resume';
import { saveResume, saveUserInfo } from '@/services/storage.service';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = (userInfo: UserBasicInfo) => {
    // Save user info
    saveUserInfo(userInfo);

    // Create initial resume
    const newResume: Resume = {
      id: Date.now().toString(),
      userInfo,
      sections: {
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: [],
        customSections: [],
      },
      template: 'modern',
      language: 'en',
      lastModified: new Date(),
      createdAt: new Date(),
    };

    // Save the resume
    saveResume(newResume);

    // Navigate to editor
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Let's Create Your Perfect Resume
            </h1>
            <p className="text-lg text-gray-600">
              Tell us about yourself and we'll help you build a professional resume
              that stands out to employers.
            </p>
          </div>
          
          <OnboardingForm onComplete={handleOnboardingComplete} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
