
import React, { useState } from 'react';
import { Experience } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface ExperienceSectionProps {
  experience: Experience[];
  onUpdate: (experience: Experience[]) => void;
}

export const ExperienceSection = ({ experience, onUpdate }: ExperienceSectionProps) => {
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    setEditingExperience(newExperience);
    setIsDialogOpen(true);
  };

  const editExperience = (exp: Experience) => {
    setEditingExperience({ ...exp });
    setIsDialogOpen(true);
  };

  const saveExperience = () => {
    if (!editingExperience) return;
    
    const existingIndex = experience.findIndex(exp => exp.id === editingExperience.id);
    if (existingIndex >= 0) {
      const updated = [...experience];
      updated[existingIndex] = editingExperience;
      onUpdate(updated);
    } else {
      onUpdate([...experience, editingExperience]);
    }
    
    setEditingExperience(null);
    setIsDialogOpen(false);
  };

  const deleteExperience = (id: string) => {
    onUpdate(experience.filter(exp => exp.id !== id));
  };

  const addDescription = () => {
    if (!editingExperience) return;
    setEditingExperience({
      ...editingExperience,
      description: [...editingExperience.description, '']
    });
  };

  const updateDescription = (index: number, value: string) => {
    if (!editingExperience) return;
    const newDescription = [...editingExperience.description];
    newDescription[index] = value;
    setEditingExperience({
      ...editingExperience,
      description: newDescription
    });
  };

  const removeDescription = (index: number) => {
    if (!editingExperience || editingExperience.description.length <= 1) return;
    setEditingExperience({
      ...editingExperience,
      description: editingExperience.description.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Experience</Label>
        <Button type="button" size="sm" variant="outline" onClick={addExperience}>
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{exp.position || 'Position'} at {exp.company || 'Company'}</h4>
              <div className="flex space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => editExperience(exp)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => deleteExperience(exp.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {exp.location && (
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {exp.location}
              </p>
            )}
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              {exp.description.map((desc, descIndex) => (
                <li key={descIndex}>• {desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience?.company ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
          </DialogHeader>
          
          {editingExperience && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={editingExperience.position}
                    onChange={(e) => setEditingExperience({ ...editingExperience, position: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={editingExperience.company}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    placeholder="Tech Corp"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editingExperience.location || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={editingExperience.startDate}
                    onChange={(e) => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                    placeholder="Jan 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={editingExperience.endDate || ''}
                    onChange={(e) => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                    placeholder="Dec 2023"
                    disabled={editingExperience.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={editingExperience.current}
                  onCheckedChange={(checked) => setEditingExperience({ 
                    ...editingExperience, 
                    current: checked as boolean,
                    endDate: checked ? '' : editingExperience.endDate
                  })}
                />
                <Label htmlFor="current">I currently work here</Label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Job Description</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addDescription}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Point
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingExperience.description.map((desc, index) => (
                    <div key={index} className="flex space-x-2">
                      <Textarea
                        value={desc}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        placeholder="Describe your responsibilities and achievements..."
                        rows={2}
                      />
                      {editingExperience.description.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeDescription(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={saveExperience}>
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
