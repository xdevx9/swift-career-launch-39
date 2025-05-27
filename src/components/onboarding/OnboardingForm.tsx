
import React, { useState } from 'react';
import { UserBasicInfo } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Sparkles, Loader2 } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: (userInfo: UserBasicInfo) => void;
  isGenerating: boolean;
}

export const OnboardingForm = ({ onComplete, isGenerating }: OnboardingFormProps) => {
  const [formData, setFormData] = useState<UserBasicInfo>({
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    targetRole: '',
    experience: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in your full name and job title.",
        variant: "destructive",
      });
      return;
    }

    onComplete(formData);
  };

  const handleChange = (field: keyof UserBasicInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-gray-700 shadow-lg mb-6">
            <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
            AI Resume Builder
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's Build Your
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Perfect Resume
            </span>
          </h1>
          
          <p className="text-xl text-gray-600">
            Tell us a bit about yourself and our AI will create a professional resume tailored to your goals.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange('fullName')}
                  placeholder="John Doe"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                  Current/Target Job Title *
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange('jobTitle')}
                  placeholder="Software Engineer"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={handleChange('location')}
                placeholder="San Francisco, CA"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetRole" className="text-sm font-medium text-gray-700">
                Target Role/Industry (Optional)
              </Label>
              <Input
                id="targetRole"
                value={formData.targetRole}
                onChange={handleChange('targetRole')}
                placeholder="Frontend Development, FinTech"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                Experience Level (Optional)
              </Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={handleChange('experience')}
                placeholder="3 years, Entry-level, Senior"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate My Resume with AI
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
