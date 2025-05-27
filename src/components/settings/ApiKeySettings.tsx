
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getGeminiApiKey, setGeminiApiKey, hasGeminiApiKey } from '@/config/api.config';
import { Key, Eye, EyeOff } from 'lucide-react';

export const ApiKeySettings = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const existingKey = getGeminiApiKey();
    if (existingKey) {
      setGeminiKey(existingKey);
      setIsConfigured(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!geminiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setGeminiApiKey(geminiKey.trim());
    setIsConfigured(true);
    toast({
      title: "Success",
      description: "API key saved successfully. AI features are now available.",
    });
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setGeminiKey('');
    setIsConfigured(false);
    toast({
      title: "API Key Removed",
      description: "AI features have been disabled.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="gemini-key">Google Gemini API Key</Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Input
                id="gemini-key"
                type={showKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSaveApiKey}>
              Save
            </Button>
          </div>
        </div>

        {isConfigured && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-green-700">✅ AI features are enabled</span>
            <Button variant="outline" size="sm" onClick={handleRemoveApiKey}>
              Remove Key
            </Button>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></p>
          <p className="mt-1">This enables AI-powered resume analysis, content enhancement, and job matching features.</p>
        </div>
      </CardContent>
    </Card>
  );
};
