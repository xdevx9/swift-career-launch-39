
import React, { useState, useEffect } from 'react';
import { Resume, AISuggestion } from '@/types/resume';
import { ResumePreview } from './ResumePreview';
import { ResumeForm } from './ResumeForm';
import { AIToolbar } from './AIToolbar';
import { VersionHistory } from './VersionHistory';
import { AISuggestions } from './AISuggestions';
import { JobMatcher } from './JobMatcher';
import { useAutoSave } from '@/hooks/useAutoSave';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveResume } from '@/services/storage.service';
import { exportToPDF, exportToDOCX, exportToText, exportToJSON } from '@/services/export.service';
import { Download, Save, ArrowLeft, FileText, File, History, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResumeEditorProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const ResumeEditor = ({ resume, onResumeUpdate }: ResumeEditorProps) => {
  const [currentResume, setCurrentResume] = useState<Resume>(resume);
  const [isExporting, setIsExporting] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveStatus, scheduleAutoSave, manualSave } = useAutoSave(currentResume);

  useEffect(() => {
    setCurrentResume(resume);
  }, [resume]);

  const handleResumeChange = (updatedResume: Resume) => {
    setCurrentResume(updatedResume);
    onResumeUpdate(updatedResume);
    scheduleAutoSave(updatedResume);
  };

  const handleManualSave = () => {
    manualSave(currentResume);
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved with version history.",
    });
  };

  const handleVersionRestore = (restoredResume: Resume) => {
    setCurrentResume(restoredResume);
    onResumeUpdate(restoredResume);
    manualSave(restoredResume);
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    // Apply the suggestion to the resume
    // This is a simplified implementation - you could make it more sophisticated
    toast({
      title: "Suggestion Applied",
      description: `Applied ${suggestion.type} suggestion for ${suggestion.section}`,
    });
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(currentResume, 'resume-preview');
          toast({
            title: "PDF Exported",
            description: "Your resume has been downloaded as a PDF file.",
          });
          break;
        case 'docx':
          await exportToDOCX(currentResume);
          toast({
            title: "DOCX Exported",
            description: "Your resume has been downloaded as a DOCX file.",
          });
          break;
        case 'txt':
          exportToText(currentResume);
          toast({
            title: "Text Exported",
            description: "Your resume has been downloaded as a text file.",
          });
          break;
        case 'json':
          exportToJSON(currentResume);
          toast({
            title: "JSON Exported",
            description: "Your resume has been downloaded as a JSON file.",
          });
          break;
        default:
          throw new Error('Unsupported format');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: `Failed to export ${format.toUpperCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return '• Saving...';
      case 'saved': return '• Saved';
      case 'error': return '• Save failed';
      default: return '';
    }
  };

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving': return 'text-blue-600';
      case 'saved': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Resume Editor
              </h1>
              <span className={`text-sm ${getSaveStatusColor()}`}>
                {getSaveStatusText()}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowVersionHistory(true)}
                className="flex items-center"
              >
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              
              <Button
                variant="outline"
                onClick={handleManualSave}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={isExporting}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('docx')}>
                    <File className="mr-2 h-4 w-4" />
                    Export as DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('txt')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    <File className="mr-2 h-4 w-4" />
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="edit">Edit Resume</TabsTrigger>
                <TabsTrigger value="ai-suggestions">
                  <Zap className="h-4 w-4 mr-1" />
                  AI Suggestions
                </TabsTrigger>
                <TabsTrigger value="job-match">
                  <Target className="h-4 w-4 mr-1" />
                  Job Matcher
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="space-y-6">
                <AIToolbar resume={currentResume} onResumeUpdate={handleResumeChange} />
                <ResumeForm resume={currentResume} onResumeUpdate={handleResumeChange} />
              </TabsContent>
              
              <TabsContent value="ai-suggestions">
                <AISuggestions
                  resume={currentResume}
                  onApplySuggestion={handleApplySuggestion}
                  onResumeUpdate={handleResumeChange}
                />
              </TabsContent>
              
              <TabsContent value="job-match">
                <JobMatcher
                  resume={currentResume}
                  onResumeUpdate={handleResumeChange}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <div id="resume-preview">
              <ResumePreview resume={currentResume} />
            </div>
          </div>
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistory
        resume={currentResume}
        onRestore={handleVersionRestore}
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
      />
    </div>
  );
};
