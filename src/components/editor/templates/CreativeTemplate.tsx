
import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

interface CreativeTemplateProps {
  resume: Resume;
}

export const CreativeTemplate = ({ resume }: CreativeTemplateProps) => {
  const { userInfo, sections } = resume;

  return (
    <div className="bg-white max-w-4xl mx-auto overflow-hidden shadow-2xl">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-700 to-purple-900 text-white p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-700">
                {userInfo.fullName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-xl font-bold">{userInfo.fullName}</h1>
            <p className="text-purple-200">{userInfo.jobTitle}</p>
          </div>

          {/* Contact */}
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            {userInfo.email && (
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span className="break-all">{userInfo.email}</span>
              </div>
            )}
            {userInfo.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span>{userInfo.phone}</span>
              </div>
            )}
            {userInfo.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{userInfo.location}</span>
              </div>
            )}
            {userInfo.linkedin && (
              <div className="flex items-center text-sm">
                <Linkedin className="h-4 w-4 mr-2" />
                <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {userInfo.github && (
              <div className="flex items-center text-sm">
                <Github className="h-4 w-4 mr-2" />
                <a href={userInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub
                </a>
              </div>
            )}
          </div>

          {/* Skills */}
          {sections.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              <div className="space-y-2">
                {sections.skills.map((skill, index) => (
                  <div key={index} className="bg-purple-600 bg-opacity-50 rounded px-3 py-1 text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {sections.education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Education</h3>
              <div className="space-y-3">
                {sections.education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-purple-200">{edu.institution}</p>
                    <p className="text-purple-300 text-xs">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8">
          {/* Summary */}
          {sections.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-4 relative">
                About Me
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-purple-700"></div>
              </h2>
              <p className="text-gray-700 leading-relaxed">{sections.summary}</p>
            </section>
          )}

          {/* Experience */}
          {sections.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-4 relative">
                Experience
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-purple-700"></div>
              </h2>
              <div className="space-y-6">
                {sections.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-purple-200">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-700 rounded-full"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                        <p className="text-purple-600 font-medium">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-500">{exp.location}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
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
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-4 relative">
                Projects
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-purple-700"></div>
              </h2>
              <div className="space-y-4">
                {sections.projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <div className="flex space-x-2">
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
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
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {sections.customSections.map((section) => (
            <section key={section.id} className="mb-8">
              <h2 className="text-2xl font-bold text-purple-700 mb-4 relative">
                {section.title}
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-purple-700"></div>
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
    </div>
  );
};
