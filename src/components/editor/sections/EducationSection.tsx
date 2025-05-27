
import React, { useState } from 'react';
import { Education } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit, Trash2, Calendar, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface EducationSectionProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
}

export const EducationSection = ({ education, onUpdate }: EducationSectionProps) => {
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
    };
    setEditingEducation(newEducation);
    setIsDialogOpen(true);
  };

  const editEducation = (edu: Education) => {
    setEditingEducation({ ...edu });
    setIsDialogOpen(true);
  };

  const saveEducation = () => {
    if (!editingEducation) return;
    
    const existingIndex = education.findIndex(edu => edu.id === editingEducation.id);
    if (existingIndex >= 0) {
      const updated = [...education];
      updated[existingIndex] = editingEducation;
      onUpdate(updated);
    } else {
      onUpdate([...education, editingEducation]);
    }
    
    setEditingEducation(null);
    setIsDialogOpen(false);
  };

  const deleteEducation = (id: string) => {
    onUpdate(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Education</Label>
        <Button type="button" size="sm" variant="outline" onClick={addEducation}>
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                {edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}
              </h4>
              <div className="flex space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => editEducation(edu)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => deleteEducation(edu.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{edu.institution}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {edu.startDate} - {edu.current ? 'Present' : edu.endDate || 'Present'}
            </p>
            {edu.gpa && (
              <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEducation?.institution ? 'Edit Education' : 'Add Education'}
            </DialogTitle>
          </DialogHeader>
          
          {editingEducation && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={editingEducation.institution}
                  onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                  placeholder="University of Technology"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={editingEducation.degree}
                    onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                    placeholder="Bachelor's"
                  />
                </div>
                <div>
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    value={editingEducation.field || ''}
                    onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={editingEducation.startDate}
                    onChange={(e) => setEditingEducation({ ...editingEducation, startDate: e.target.value })}
                    placeholder="Sep 2020"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={editingEducation.endDate || ''}
                    onChange={(e) => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                    placeholder="May 2024"
                    disabled={editingEducation.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={editingEducation.current}
                  onCheckedChange={(checked) => setEditingEducation({ 
                    ...editingEducation, 
                    current: checked as boolean,
                    endDate: checked ? '' : editingEducation.endDate
                  })}
                />
                <Label htmlFor="current">Currently enrolled</Label>
              </div>

              <div>
                <Label htmlFor="gpa">GPA (Optional)</Label>
                <Input
                  id="gpa"
                  value={editingEducation.gpa || ''}
                  onChange={(e) => setEditingEducation({ ...editingEducation, gpa: e.target.value })}
                  placeholder="3.8"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={saveEducation}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
