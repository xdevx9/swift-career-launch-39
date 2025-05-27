
import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Calendar, Linkedin, Github, ExternalLink } from 'lucide-react';

interface ModernTemplateProps {
  resume: Resume;
}

export const ModernTemplate = ({ resume }: ModernTemplateProps) => {
  const { userInfo, sections } = resume;

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold">{userInfo.fullName}</h1>
        <p className="text-lg text-blue-100">{userInfo.jobTitle}</p>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {userInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {userInfo.email}
            </div>
          )}
          {userInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              {userInfo.phone}
            </div>
          )}
          {userInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {userInfo.location}
            </div>
          )}
          {userInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-1" />
              <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </div>
          )}
          {userInfo.github && (
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-1" />
              <a href={userInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        {sections.summary && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{sections.summary}</p>
          </section>
        )}

        {/* Experience */}
        {sections.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {sections.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exp.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {sections.projects && sections.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {sections.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex space-x-2">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {sections.education.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {sections.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-blue-600">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {sections.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {sections.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {sections.customSections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
              {section.title}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {section.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
