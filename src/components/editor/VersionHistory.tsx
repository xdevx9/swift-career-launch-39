
import React, { useState, useEffect } from 'react';
import { Resume, ResumeVersion } from '@/types/resume';
import { getVersions, restoreVersion, deleteVersion } from '@/services/version.service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, RotateCcw, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  resume: Resume;
  onRestore: (resume: Resume) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistory = ({ resume, onRestore, isOpen, onClose }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const resumeVersions = getVersions(resume.id).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setVersions(resumeVersions);
    }
  }, [resume.id, isOpen]);

  const handleRestore = (version: ResumeVersion) => {
    const restoredResume = restoreVersion(version.id, resume.id);
    if (restoredResume) {
      onRestore(restoredResume);
      toast({
        title: "Version Restored",
        description: `Restored to version from ${formatDistanceToNow(new Date(version.timestamp))} ago`,
      });
      onClose();
    } else {
      toast({
        title: "Restore Failed",
        description: "Failed to restore the selected version",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (version: ResumeVersion) => {
    deleteVersion(version.id, resume.id);
    setVersions(versions.filter(v => v.id !== version.id));
    toast({
      title: "Version Deleted",
      description: "Version has been removed from history",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Version History
            </h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No version history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{version.description}</h3>
                      {version.isAutoSave && (
                        <Badge variant="secondary" className="text-xs">
                          Auto-save
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(version)}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(version)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(version.timestamp))} ago
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
