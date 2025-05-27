
import React from 'react';
import { User, Sparkles, FileText } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: 'Enter Your Information',
    description: 'Provide basic details like your name, target role, and key experiences.',
    color: 'blue',
  },
  {
    icon: Sparkles,
    title: 'AI Generates Content',
    description: 'Our AI creates professional, tailored content optimized for your industry.',
    color: 'purple',
  },
  {
    icon: FileText,
    title: 'Download & Apply',
    description: 'Get your polished resume in PDF format and start applying with confidence.',
    color: 'indigo',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional resume in just three simple steps. No design skills required.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className={`inline-flex rounded-full bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 p-6 shadow-xl mb-6`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 text-lg">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-x-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
