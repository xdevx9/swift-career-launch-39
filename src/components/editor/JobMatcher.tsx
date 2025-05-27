
import React, { useState } from 'react';
import { Resume } from '@/types/resume';
import { optimizeForJobDescription } from '@/services/ai-enhancement.service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Target, Wand2 } from 'lucide-react';

interface JobMatcherProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const JobMatcher = ({ resume, onResumeUpdate }: JobMatcherProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to optimize your resume",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const optimizations = await optimizeForJobDescription(resume, jobDescription);
      
      const optimizedResume: Resume = {
        ...resume,
        sections: {
          ...resume.sections,
          summary: optimizations.summary || resume.sections.summary,
          skills: optimizations.skills || resume.sections.skills,
          experience: optimizations.experience || resume.sections.experience,
        },
        lastModified: new Date(),
      };

      onResumeUpdate(optimizedResume);
      
      toast({
        title: "Resume Optimized",
        description: "Your resume has been tailored to match the job description",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Please ensure your AI API key is configured",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Target className="h-5 w-5 text-purple-600" />
        Job Matcher
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to optimize your resume for this specific role..."
          className="h-32"
        />
      </div>
      
      <Button
        onClick={handleOptimize}
        disabled={isOptimizing || !jobDescription.trim()}
        className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        {isOptimizing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Optimizing Resume...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Optimize Resume for This Job
          </>
        )}
      </Button>
      
      <p className="text-sm text-gray-600">
        This will analyze the job description and suggest improvements to better match the role requirements.
      </p>
    </div>
  );
};
