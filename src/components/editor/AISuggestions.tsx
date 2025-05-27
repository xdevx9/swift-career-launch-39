
import React, { useState, useEffect } from 'react';
import { Resume, AISuggestion } from '@/types/resume';
import { analyzeResumeContent, calculateATSScore } from '@/services/ai-enhancement.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Check, X, Zap, Target, AlertCircle } from 'lucide-react';

interface AISuggestionsProps {
  resume: Resume;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onResumeUpdate: (resume: Resume) => void;
}

export const AISuggestions = ({ resume, onApplySuggestion, onResumeUpdate }: AISuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [atsScore, setAtsScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeCurrent = async () => {
    setIsAnalyzing(true);
    try {
      const [newSuggestions, score] = await Promise.all([
        analyzeResumeContent(resume),
        calculateATSScore(resume)
      ]);
      
      setSuggestions(newSuggestions);
      setAtsScore(score);
      
      // Update resume with ATS score and suggestions
      onResumeUpdate({
        ...resume,
        atsScore: score,
        aiSuggestions: newSuggestions
      });
      
      toast({
        title: "Analysis Complete",
        description: `Found ${newSuggestions.length} suggestions to improve your resume`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Please ensure your AI API key is configured",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion);
    setSuggestions(suggestions.map(s => 
      s.id === suggestion.id ? { ...s, applied: true } : s
    ));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  useEffect(() => {
    if (resume.aiSuggestions) {
      setSuggestions(resume.aiSuggestions);
    }
    if (resume.atsScore) {
      setAtsScore(resume.atsScore);
    }
  }, [resume]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          AI Analysis
        </h3>
        <Button
          onClick={analyzeCurrent}
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>

      {atsScore > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">ATS Compatibility Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(atsScore)}`}>
              {atsScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                atsScore >= 80 ? 'bg-green-500' :
                atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${atsScore}%` }}
            />
          </div>
        </div>
      )}

      <ScrollArea className="max-h-96">
        <div className="space-y-3">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No suggestions available. Run an analysis to get started.</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`border rounded-lg p-4 transition-all ${
                  suggestion.applied ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(suggestion.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.section}
                      </Badge>
                      <Badge 
                        variant={suggestion.type === 'ats' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{suggestion.message}</p>
                    <p className="text-sm font-medium text-gray-900">{suggestion.suggestion}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!suggestion.applied ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applySuggestion(suggestion)}
                          className="flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissSuggestion(suggestion.id)}
                          className="text-gray-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        Applied
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
