
import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

interface MinimalTemplateProps {
  resume: Resume;
}

export const MinimalTemplate = ({ resume }: MinimalTemplateProps) => {
  const { userInfo, sections } = resume;

  return (
    <div className="bg-white max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-light text-gray-900">{userInfo.fullName}</h1>
        <p className="text-xl text-gray-600">{userInfo.jobTitle}</p>
        
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          {userInfo.email && <span>{userInfo.email}</span>}
          {userInfo.phone && <span>•</span>}
          {userInfo.phone && <span>{userInfo.phone}</span>}
          {userInfo.location && <span>•</span>}
          {userInfo.location && <span>{userInfo.location}</span>}
        </div>

        {(userInfo.linkedin || userInfo.github) && (
          <div className="flex justify-center space-x-4 text-sm">
            {userInfo.linkedin && (
              <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                LinkedIn
              </a>
            )}
            {userInfo.github && (
              <a href={userInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                GitHub
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {sections.summary && (
        <section>
          <p className="text-gray-700 leading-relaxed text-center italic">{sections.summary}</p>
        </section>
      )}

      {/* Experience */}
      {sections.experience.length > 0 && (
        <section>
          <h2 className="text-lg font-light text-gray-900 mb-4 text-center">Experience</h2>
          <div className="space-y-6">
            {sections.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                <p className="text-gray-600">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                <div className="mt-2 space-y-1">
                  {exp.description.map((desc, index) => (
                    <p key={index} className="text-sm text-gray-700">{desc}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sections.projects && sections.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-light text-gray-900 mb-4 text-center">Projects</h2>
          <div className="space-y-4">
            {sections.projects.map((project) => (
              <div key={project.id} className="text-center">
                <div className="flex justify-center items-center space-x-2 mb-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                <p className="text-xs text-gray-500">{project.technologies.join(' • ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sections.education.length > 0 && (
        <section>
          <h2 className="text-lg font-light text-gray-900 mb-4 text-center">Education</h2>
          <div className="space-y-3">
            {sections.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h3 className="font-medium text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </p>
                {edu.gpa && (
                  <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sections.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-light text-gray-900 mb-4 text-center">Skills</h2>
          <p className="text-center text-gray-700">{sections.skills.join(' • ')}</p>
        </section>
      )}

      {/* Custom Sections */}
      {sections.customSections.map((section) => (
        <section key={section.id}>
          <h2 className="text-lg font-light text-gray-900 mb-4 text-center">
            {section.title}
          </h2>
          <div className="space-y-1 text-center">
            {section.content.map((item, index) => (
              <p key={index} className="text-gray-700">{item}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
