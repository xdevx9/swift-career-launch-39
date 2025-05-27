
import React from 'react';
import { FileText, ArrowDown } from 'lucide-react';

export const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Perfect Resume?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who've successfully landed their dream jobs with AI-generated resumes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <span className="flex items-center justify-center">
                <FileText className="mr-2 h-5 w-5" />
                Start Building Now
              </span>
            </button>
            
            <button className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10">
              See Examples
            </button>
          </div>
          
          <div className="mt-8 text-blue-100 text-sm">
            No signup required • Free to try • Export in seconds
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">50,000+</div>
            <div className="text-gray-600">Resumes created</div>
          </div>
          <div className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">4.9/5</div>
            <div className="text-gray-600">User satisfaction</div>
          </div>
          <div className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">85%</div>
            <div className="text-gray-600">Interview success rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};
