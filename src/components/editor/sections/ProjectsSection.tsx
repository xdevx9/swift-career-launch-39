
import React, { useState } from 'react';
import { Project } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProjectsSectionProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export const ProjectsSection = ({ projects, onUpdate }: ProjectsSectionProps) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
    };
    setEditingProject(newProject);
    setIsDialogOpen(true);
  };

  const editProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsDialogOpen(true);
  };

  const saveProject = () => {
    if (!editingProject) return;
    
    const existingIndex = projects.findIndex(p => p.id === editingProject.id);
    if (existingIndex >= 0) {
      const updated = [...projects];
      updated[existingIndex] = editingProject;
      onUpdate(updated);
    } else {
      onUpdate([...projects, editingProject]);
    }
    
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const deleteProject = (id: string) => {
    onUpdate(projects.filter(p => p.id !== id));
  };

  const addTechnology = () => {
    if (!editingProject) return;
    const tech = prompt('Enter technology:');
    if (tech && tech.trim()) {
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, tech.trim()]
      });
    }
  };

  const removeTechnology = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: editingProject.technologies.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Projects</Label>
        <Button type="button" size="sm" variant="outline" onClick={addProject}>
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{project.name || 'Untitled Project'}</h4>
              <div className="flex space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => editProject(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{project.description}</p>
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.name ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
          </DialogHeader>
          
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="projectUrl">Project URL</Label>
                <Input
                  id="projectUrl"
                  value={editingProject.url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="projectGithub">GitHub URL</Label>
                <Input
                  id="projectGithub"
                  value={editingProject.github || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Technologies</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addTechnology}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editingProject.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button onClick={() => removeTechnology(index)} className="hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={saveProject}>
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
