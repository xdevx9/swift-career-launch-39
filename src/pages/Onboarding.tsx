
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { ApiKeyInput } from '@/components/onboarding/ApiKeyInput';
import { UserBasicInfo, Resume } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';
import { 
  initializeGemini, 
  generateResumeContent 
} from '@/services/gemini.service';
import { 
  saveResume, 
  saveUserInfo, 
  saveGeminiApiKey, 
  getGeminiApiKey 
} from '@/services/storage.service';

const Onboarding = () => {
  const [step, setStep] = useState<'api-key' | 'form'>('api-key');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key already exists
    const existingApiKey = getGeminiApiKey();
    if (existingApiKey) {
      initializeGemini(existingApiKey);
      setStep('form');
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    try {
      initializeGemini(apiKey);
      saveGeminiApiKey(apiKey);
      setStep('form');
      
      toast({
        title: "API Key Connected",
        description: "Successfully connected to Gemini AI.",
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to Gemini AI. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const handleFormComplete = async (userInfo: UserBasicInfo) => {
    setIsGenerating(true);
    
    try {
      // Save user info
      saveUserInfo(userInfo);
      
      // Generate resume content with AI
      const aiSections = await generateResumeContent(userInfo);
      
      // Create complete resume
      const newResume: Resume = {
        id: `resume-${Date.now()}`,
        userInfo,
        sections: {
          summary: aiSections.summary || '',
          experience: aiSections.experience || [],
          education: aiSections.education || [],
          skills: aiSections.skills || [],
          customSections: aiSections.customSections || [],
        },
        template: 'modern',
        language: 'en',
        lastModified: new Date(),
        createdAt: new Date(),
      };
      
      // Save resume
      saveResume(newResume);
      
      toast({
        title: "Resume Generated!",
        description: "Your AI-powered resume has been created successfully.",
      });
      
      // Navigate to editor
      navigate('/editor');
      
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === 'api-key') {
    return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <OnboardingForm 
      onComplete={handleFormComplete} 
      isGenerating={isGenerating}
    />
  );
};

export default Onboarding;
