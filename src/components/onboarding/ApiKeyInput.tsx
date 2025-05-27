
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Key, ExternalLink } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-gray-700 shadow-lg mb-6">
            <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
            AI Resume Builder
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}AI Assistant
            </span>
          </h1>
          
          <p className="text-lg text-gray-600">
            To generate your resume with AI, we need your Google Gemini API key.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <Alert className="mb-6">
            <Key className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally on your device and never sent to our servers. 
              You can get a free API key from Google AI Studio.
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800"
              >
                Get API Key <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
                Google Gemini API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Key className="mr-2 h-5 w-5" />
              Continue with AI
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
