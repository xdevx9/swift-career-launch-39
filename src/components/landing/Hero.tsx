
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, ArrowDown } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
      
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-gray-700 shadow-lg">
            <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
            AI-Powered Resume Builder
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 lg:text-7xl">
            Build Your
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Perfect Resume
            </span>
            <br />
            in Minutes
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 leading-relaxed">
            Let AI create a professional, ATS-optimized resume tailored to your dream job. 
            No templates to choose from – just intelligent, personalized content generation.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button 
              onClick={() => navigate('/create')}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center">
                <FileText className="mr-2 h-5 w-5" />
                Create My Resume
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </button>
            
            <button className="rounded-full border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-white hover:shadow-lg">
              See How It Works
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 text-center">
            <div className="rounded-2xl bg-white/60 backdrop-blur-sm p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600">15s</div>
              <div className="text-gray-600">Average setup time</div>
            </div>
            <div className="rounded-2xl bg-white/60 backdrop-blur-sm p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-gray-600">ATS compatibility</div>
            </div>
            <div className="rounded-2xl bg-white/60 backdrop-blur-sm p-6 shadow-lg">
              <div className="text-3xl font-bold text-indigo-600">12+</div>
              <div className="text-gray-600">Languages supported</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-gray-400" />
      </div>
    </section>
  );
};
