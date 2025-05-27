
import React, { useState, useEffect } from 'react';
import { Resume, ResumeVersion } from '@/types/resume';
import { getVersions, restoreVersion, deleteVersion, saveVersionWithCustomName } from '@/services/version.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Clock, RotateCcw, Trash2, FileText, Save, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  resume: Resume;
  onRestore: (resume: Resume) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistory = ({ resume, onRestore, isOpen, onClose }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [newVersionName, setNewVersionName] = useState('');
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
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
        description: `Restored to "${version.description}"`,
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
      description: `"${version.description}" has been removed from history`,
    });
  };

  const handleCreateNamedVersion = () => {
    if (!newVersionName.trim()) return;
    
    setIsCreatingVersion(true);
    try {
      saveVersionWithCustomName(resume, newVersionName.trim());
      const updatedVersions = getVersions(resume.id).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setVersions(updatedVersions);
      setNewVersionName('');
      toast({
        title: "Version Saved",
        description: `Created version "${newVersionName.trim()}"`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to create version",
        variant: "destructive",
      });
    } finally {
      setIsCreatingVersion(false);
    }
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
          
          {/* Create Named Version */}
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Enter version name (e.g., 'Final Draft', 'Before Interview')"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCreateNamedVersion}
              disabled={!newVersionName.trim() || isCreatingVersion}
              className="flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              Save Version
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No version history available</p>
              <p className="text-sm mt-2">Save a named version to get started</p>
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
                      <h3 className="font-medium flex items-center gap-1">
                        {!version.isAutoSave && <Edit2 className="h-3 w-3 text-blue-500" />}
                        {version.description}
                      </h3>
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
