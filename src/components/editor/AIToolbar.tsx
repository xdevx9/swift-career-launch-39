
import React, { useState } from 'react';
import { Resume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { enhanceContent } from '@/services/gemini.service';
import { translateResume, SUPPORTED_LANGUAGES } from '@/services/translation.service';
import { analyzeJobMatch } from '@/services/job-matcher.service';
import { Sparkles, Loader2, Zap, Globe, FileText, Languages, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AIToolbarProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const AIToolbar = ({ resume, onResumeUpdate }: AIToolbarProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isJobMatchOpen, setIsJobMatchOpen] = useState(false);
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

  const handleTranslate = async () => {
    if (!selectedLanguage) {
      toast({
        title: "Select Language",
        description: "Please select a target language for translation.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const translatedResume = await translateResume(resume, selectedLanguage);
      onResumeUpdate(translatedResume);
      
      toast({
        title: "Resume Translated",
        description: `Your resume has been translated to ${SUPPORTED_LANGUAGES[selectedLanguage as keyof typeof SUPPORTED_LANGUAGES]}.`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed",
        description: "Failed to translate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleJobMatch = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to analyze match.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const matchResult = await analyzeJobMatch(resume, jobDescription);
      
      // Apply suggestions if available
      if (matchResult.suggestedImprovements.summary || matchResult.suggestedImprovements.skills?.length) {
        const updatedResume = {
          ...resume,
          sections: {
            ...resume.sections,
            summary: matchResult.suggestedImprovements.summary || resume.sections.summary,
            skills: matchResult.suggestedImprovements.skills?.length 
              ? [...new Set([...resume.sections.skills, ...matchResult.suggestedImprovements.skills])]
              : resume.sections.skills
          }
        };
        onResumeUpdate(updatedResume);
      }
      
      toast({
        title: `Job Match: ${matchResult.matchScore}%`,
        description: `Added ${matchResult.suggestedImprovements.skills?.length || 0} suggested skills and improvements.`,
      });
      
      setIsJobMatchOpen(false);
      setJobDescription('');
    } catch (error) {
      console.error('Job match error:', error);
      toast({
        title: "Job Match Failed",
        description: "Failed to analyze job match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
        <h3 className="font-semibold text-gray-900">AI Enhancement Tools</h3>
      </div>
      
      {/* First row of buttons */}
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

        <Dialog open={isJobMatchOpen} onOpenChange={setIsJobMatchOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center justify-center">
              <Target className="h-4 w-4 mr-2" />
              Job Matcher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Job Matcher & Resume Optimizer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleJobMatch} 
                disabled={isEnhancing}
                className="w-full"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Match...
                  </>
                ) : (
                  'Analyze & Optimize Resume'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Translation section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Languages className="h-4 w-4 text-blue-600" />
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleTranslate}
          disabled={isEnhancing || !selectedLanguage}
          variant="outline"
        >
          {isEnhancing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Languages className="h-4 w-4 mr-2" />
          )}
          Translate
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        Use these AI-powered tools to enhance, translate, and optimize your resume for specific job opportunities.
      </p>
    </div>
  );
};
