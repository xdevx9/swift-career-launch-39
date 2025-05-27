
import { useCallback, useEffect, useRef, useState } from 'react';
import { Resume } from '@/types/resume';
import { saveResume } from '@/services/storage.service';
import { saveVersion } from '@/services/version.service';

export const useAutoSave = (resume: Resume, delay = 3000) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  const save = useCallback((currentResume: Resume, isManual = false) => {
    const resumeString = JSON.stringify(currentResume);
    
    // Don't save if no changes
    if (resumeString === lastSavedRef.current) {
      return;
    }
    
    setSaveStatus('saving');
    
    try {
      const updatedResume = {
        ...currentResume,
        lastModified: new Date(),
      };
      
      saveResume(updatedResume);
      
      if (isManual) {
        saveVersion(updatedResume, 'Manual save');
      } else {
        saveVersion(updatedResume, 'Auto save', true);
      }
      
      lastSavedRef.current = resumeString;
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, []);

  const scheduleAutoSave = useCallback((currentResume: Resume) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      save(currentResume, false);
    }, delay);
  }, [save, delay]);

  const manualSave = useCallback((currentResume: Resume) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save(currentResume, true);
  }, [save]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { saveStatus, scheduleAutoSave, manualSave };
};
