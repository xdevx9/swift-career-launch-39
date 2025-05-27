
import React, { useState } from 'react';
import { Resume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Upload, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface JobMatcherProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const JobMatcher = ({ resume, onResumeUpdate }: JobMatcherProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState<any>(null);

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        overallMatch: 78,
        strengths: [
          'Strong technical skills alignment',
          'Relevant project experience',
          'Educational background matches'
        ],
        gaps: [
          'Missing cloud platform experience',
          'Limited leadership experience',
          'No mention of specific frameworks'
        ],
        recommendations: [
          'Add AWS or Azure certifications to skills',
          'Highlight any team leadership in project descriptions',
          'Mention React/Angular frameworks if experienced'
        ],
        keywordMatches: {
          matched: ['JavaScript', 'Python', 'Git', 'SQL'],
          missing: ['AWS', 'Docker', 'Kubernetes', 'React']
        }
      };
      
      setMatchResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const optimizeResume = () => {
    if (!matchResults) return;
    
    // Add missing keywords to skills if they're not already there
    const currentSkills = resume.sections?.skills || [];
    const missingSkills = matchResults.keywordMatches.missing.filter(
      (skill: string) => !currentSkills.includes(skill)
    );
    
    if (missingSkills.length > 0) {
      const updatedResume = {
        ...resume,
        sections: {
          ...resume.sections,
          skills: [...currentSkills, ...missingSkills.slice(0, 3)] // Add up to 3 missing skills
        }
      };
      onResumeUpdate(updatedResume);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Job Description Matcher
          </CardTitle>
          <CardDescription>
            Paste a job description to analyze how well your resume matches and get optimization suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
            />
          </div>
          
          <Button 
            onClick={analyzeMatch} 
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {matchResults && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Overall Match Score</Label>
                  <span className="text-2xl font-bold text-green-600">
                    {matchResults.overallMatch}%
                  </span>
                </div>
                <Progress value={matchResults.overallMatch} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center text-green-600 mb-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Strengths
                  </Label>
                  <ul className="space-y-1">
                    {matchResults.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="flex items-center text-orange-600 mb-2">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Areas for Improvement
                  </Label>
                  <ul className="space-y-1">
                    {matchResults.gaps.map((gap: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600">• {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-green-600 mb-2 block">Matched Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {matchResults.keywordMatches.matched.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-orange-600 mb-2 block">Missing Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {matchResults.keywordMatches.missing.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={optimizeResume} className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Auto-Optimize Resume
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {matchResults.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
