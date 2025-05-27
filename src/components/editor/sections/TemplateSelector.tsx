
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean design with gradient header' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant design' },
  { id: 'creative', name: 'Creative', description: 'Colorful sidebar layout' },
];

export const TemplateSelector = ({ currentTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label>Resume Template</Label>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            type="button"
            variant={currentTemplate === template.id ? "default" : "outline"}
            className="h-auto p-3 flex flex-col items-start"
            onClick={() => onTemplateChange(template.id)}
          >
            <span className="font-medium">{template.name}</span>
            <span className="text-xs text-left opacity-70">{template.description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
