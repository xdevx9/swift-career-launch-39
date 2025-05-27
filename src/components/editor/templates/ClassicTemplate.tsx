
import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

interface ClassicTemplateProps {
  resume: Resume;
}

export const ClassicTemplate = ({ resume }: ClassicTemplateProps) => {
  const { userInfo, sections } = resume;

  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-black p-6">
        <h1 className="text-3xl font-bold text-center mb-2">{userInfo.fullName}</h1>
        <p className="text-xl text-center text-gray-700 mb-4">{userInfo.jobTitle}</p>
        
        <div className="flex justify-center space-x-6 text-sm">
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
        </div>

        {(userInfo.linkedin || userInfo.github) && (
          <div className="flex justify-center space-x-4 mt-2 text-sm">
            {userInfo.linkedin && (
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-1" />
                <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {userInfo.github && (
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-1" />
                <a href={userInfo.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                  GitHub
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        {sections.summary && (
          <section>
            <h2 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-gray-800 leading-relaxed text-justify">{sections.summary}</p>
          </section>
        )}

        {/* Experience */}
        {sections.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {sections.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-black">{exp.position}</h3>
                      <p className="font-semibold">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 ml-4">
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
            <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide">
              Projects
            </h2>
            <div className="space-y-4">
              {sections.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-black">{project.name}</h3>
                    <div className="flex space-x-2">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-600">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-2">{project.description}</p>
                  <p className="text-sm font-medium">
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {sections.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-3">
              {sections.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="font-semibold">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium">
                    {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {sections.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide">
              Technical Skills
            </h2>
            <p className="text-gray-800">{sections.skills.join(' • ')}</p>
          </section>
        )}

        {/* Custom Sections */}
        {sections.customSections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide">
              {section.title}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-800 ml-4">
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
