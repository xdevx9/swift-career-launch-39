
import React from 'react';
import { UserBasicInfo } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoSectionProps {
  userInfo: UserBasicInfo;
  onUpdate: (field: string, value: string) => void;
}

export const PersonalInfoSection = ({ userInfo, onUpdate }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Personal Information</h3>
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
