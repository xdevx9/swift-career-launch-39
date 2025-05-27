
import React, { useState, useEffect } from 'react';
import { Resume } from '@/types/resume';
import { ResumePreview } from './ResumePreview';
import { ResumeForm } from './ResumeForm';
import { AIToolbar } from './AIToolbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveResume } from '@/services/storage.service';
import { exportToPDF, exportToDOCX, exportToText, exportToJSON } from '@/services/export.service';
import { Download, Save, ArrowLeft, FileText, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ResumeEditorProps {
  resume: Resume;
  onResumeUpdate: (resume: Resume) => void;
}

export const ResumeEditor = ({ resume, onResumeUpdate }: ResumeEditorProps) => {
  const [currentResume, setCurrentResume] = useState<Resume>(resume);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentResume(resume);
  }, [resume]);

  const handleResumeChange = (updatedResume: Resume) => {
    setCurrentResume(updatedResume);
    setHasUnsavedChanges(true);
    onResumeUpdate(updatedResume);
  };

  const handleSave = () => {
    const updatedResume = {
      ...currentResume,
      lastModified: new Date(),
    };
    
    saveResume(updatedResume);
    setCurrentResume(updatedResume);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully.",
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
              {hasUnsavedChanges && (
                <span className="text-sm text-amber-600">• Unsaved changes</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <AIToolbar resume={currentResume} onResumeUpdate={handleResumeChange} />
            <ResumeForm resume={currentResume} onResumeUpdate={handleResumeChange} />
          </div>
          
          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <div id="resume-preview">
              <ResumePreview resume={currentResume} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
