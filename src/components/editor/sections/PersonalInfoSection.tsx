
import React, { useRef } from 'react';
import { UserBasicInfo } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

interface PersonalInfoSectionProps {
  userInfo: UserBasicInfo;
  onUpdate: (field: string, value: string) => void;
}

export const PersonalInfoSection = ({ userInfo, onUpdate }: PersonalInfoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpdate('profilePicture', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    onUpdate('profilePicture', '');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Personal Information</h3>
      
      {/* Profile Picture Section */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userInfo.profilePicture} alt={userInfo.fullName} />
          <AvatarFallback className="text-lg">
            {getInitials(userInfo.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Label>Profile Picture</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1"
            >
              <Upload className="h-3 w-3" />
              Upload Photo
            </Button>
            {userInfo.profilePicture && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeProfilePicture}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3" />
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-xs text-gray-500">
            Upload a professional photo (JPG, PNG, max 5MB)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={userInfo.fullName}
            onChange={(e) => onUpdate('fullName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={userInfo.jobTitle}
            onChange={(e) => onUpdate('jobTitle', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userInfo.email || ''}
            onChange={(e) => onUpdate('email', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={userInfo.phone || ''}
            onChange={(e) => onUpdate('phone', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={userInfo.location || ''}
            onChange={(e) => onUpdate('location', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            value={userInfo.linkedin || ''}
            onChange={(e) => onUpdate('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            value={userInfo.github || ''}
            onChange={(e) => onUpdate('github', e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <Input
            id="portfolio"
            value={userInfo.portfolio || ''}
            onChange={(e) => onUpdate('portfolio', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
};
