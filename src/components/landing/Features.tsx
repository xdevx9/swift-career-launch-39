
import React from 'react';
import { Sparkles, FileText, Globe, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Advanced AI generates professional content tailored to your industry and experience level.',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes through Applicant Tracking Systems with optimized formatting.',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Generate resumes in 12+ languages with proper formatting for different regions.',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Real-Time Editing',
    description: 'Make changes instantly with our intuitive editor and see results in real-time.',
    gradient: 'from-blue-500 to-teal-600',
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with proven resume best practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className={`inline-flex rounded-xl bg-gradient-to-r ${feature.gradient} p-3 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              
              <p className="mt-3 text-gray-600">
                {feature.description}
              </p>
              
              <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
