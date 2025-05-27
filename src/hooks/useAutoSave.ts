
import { useState, useRef, useCallback } from 'react';
import { Resume } from '@/types/resume';
import { saveVersion } from '@/services/version.service';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const useAutoSave = (initialResume: Resume) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  const scheduleAutoSave = useCallback((resume: Resume) => {
    const resumeString = JSON.stringify(resume);
    
    // Don't save if content hasn't changed
    if (resumeString === lastSavedRef.current) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSaveStatus('saving');
    
    // Auto-save after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      try {
        saveVersion(resume, undefined, true);
        lastSavedRef.current = resumeString;
        setSaveStatus('saved');
        
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 2000);
  }, []);

  const manualSave = useCallback((resume: Resume) => {
    try {
      setSaveStatus('saving');
      saveVersion(resume, `Manual save - ${new Date().toLocaleString()}`, false);
      lastSavedRef.current = JSON.stringify(resume);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, []);

  return {
    saveStatus,
    scheduleAutoSave,
    manualSave,
  };
};
