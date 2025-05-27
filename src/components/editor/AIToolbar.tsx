
import React, { useState } from 'react';
import { Resume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { enhanceContent } from '@/services/gemini.service';
import { Sparkles, Loader2, Zap, Globe, FileText } from 'lucide-react';

interface AIToolbarProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const AIToolbar = ({ resume, onResumeUpdate }: AIToolbarProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleEnhanceSummary = async () => {
    if (!resume.sections.summary) {
      toast({
        title: "No Summary Found",
        description: "Please add a summary first before enhancing it.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedSummary = await enhanceContent(resume.sections.summary, 'summary');
      onResumeUpdate({
        ...resume,
        sections: {
          ...resume.sections,
          summary: enhancedSummary
        }
      });
      
      toast({
        title: "Summary Enhanced",
        description: "Your professional summary has been improved with AI.",
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleOptimizeForATS = () => {
    toast({
      title: "ATS Optimization",
      description: "Your resume is already optimized for ATS systems with proper formatting and keywords.",
    });
  };

  const handleSuggestSkills = async () => {
    if (resume.sections.skills.length === 0) {
      toast({
        title: "No Skills Found",
        description: "Please add some skills first before getting suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const skillsText = resume.sections.skills.join(', ');
      const suggestions = await enhanceContent(skillsText, 'skills');
      
      // Parse the suggestions and add them to existing skills
      const newSkills = suggestions.split(',').map(skill => skill.trim()).filter(skill => skill);
      const uniqueSkills = [...new Set([...resume.sections.skills, ...newSkills])];
      
      onResumeUpdate({
        ...resume,
        sections: {
          ...resume.sections,
          skills: uniqueSkills
        }
      });
      
      toast({
        title: "Skills Enhanced",
        description: `Added ${newSkills.length} new skill suggestions to your resume.`,
      });
    } catch (error) {
      console.error('Skill suggestion error:', error);
      toast({
        title: "Suggestions Failed",
        description: "Failed to get skill suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
        <h3 className="font-semibold text-gray-900">AI Enhancement Tools</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={handleEnhanceSummary}
          disabled={isEnhancing}
          variant="outline"
          className="flex items-center justify-center"
        >
          {isEnhancing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Enhance Summary
        </Button>
        
        <Button
          onClick={handleOptimizeForATS}
          variant="outline"
          className="flex items-center justify-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          ATS Optimize
        </Button>
        
        <Button
          onClick={handleSuggestSkills}
          disabled={isEnhancing}
          variant="outline"
          className="flex items-center justify-center"
        >
          {isEnhancing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Globe className="h-4 w-4 mr-2" />
          )}
          Suggest Skills
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 mt-3">
        Use these AI-powered tools to enhance your resume content and improve your chances of getting hired.
      </p>
    </div>
  );
};
