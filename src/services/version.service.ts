import { Resume, ResumeVersion } from '@/types/resume';

const STORAGE_KEY = 'ai-resume-builder-versions';

export const saveVersion = (resume: Resume, description?: string, isAutoSave = false): void => {
  try {
    const versions = getVersions(resume.id);
    
    // Generate automatic description if none provided
    let finalDescription = description;
    if (!finalDescription) {
      if (isAutoSave) {
        finalDescription = `Auto-save - ${new Date().toLocaleTimeString()}`;
      } else {
        finalDescription = `Manual save - ${new Date().toLocaleString()}`;
      }
    }
    
    const newVersion: ResumeVersion = {
      id: crypto.randomUUID(),
      resumeId: resume.id,
      timestamp: new Date(),
      description: finalDescription,
      data: JSON.parse(JSON.stringify(resume)), // Deep clone
      isAutoSave,
    };
    
    versions.push(newVersion);
    
    // Keep only last 50 versions
    if (versions.length > 50) {
      versions.splice(0, versions.length - 50);
    }
    
    localStorage.setItem(`${STORAGE_KEY}-${resume.id}`, JSON.stringify(versions));
  } catch (error) {
    console.error('Error saving version:', error);
  }
};

export const saveVersionWithCustomName = (resume: Resume, customName: string): void => {
  saveVersion(resume, customName, false);
};

export const getVersions = (resumeId: string): ResumeVersion[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${resumeId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading versions:', error);
    return [];
  }
};

export const restoreVersion = (versionId: string, resumeId: string): Resume | null => {
  try {
    const versions = getVersions(resumeId);
    const version = versions.find(v => v.id === versionId);
    return version ? version.data : null;
  } catch (error) {
    console.error('Error restoring version:', error);
    return null;
  }
};

export const deleteVersion = (versionId: string, resumeId: string): void => {
  try {
    const versions = getVersions(resumeId).filter(v => v.id !== versionId);
    localStorage.setItem(`${STORAGE_KEY}-${resumeId}`, JSON.stringify(versions));
  } catch (error) {
    console.error('Error deleting version:', error);
  }
};
