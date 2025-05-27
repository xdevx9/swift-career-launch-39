
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { Resume } from '@/types/resume';

export const exportFormats = {
  PDF: 'pdf',
  DOCX: 'docx',
  TXT: 'txt',
  JSON: 'json'
};

export const exportToPDF = async (resume: Resume, elementId: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${resume.userInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF');
  }
};

export const exportToDOCX = async (resume: Resume): Promise<void> => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: resume.userInfo.fullName,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resume.userInfo.jobTitle,
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            text: `${resume.userInfo.email} | ${resume.userInfo.phone} | ${resume.userInfo.location}`,
          }),
          new Paragraph({ text: '' }),
          
          // Summary
          new Paragraph({
            text: 'PROFESSIONAL SUMMARY',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: resume.sections.summary,
          }),
          new Paragraph({ text: '' }),
          
          // Experience
          new Paragraph({
            text: 'EXPERIENCE',
            heading: HeadingLevel.HEADING_1,
          }),
          ...resume.sections.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.position} at ${exp.company}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location || ''}`,
            }),
            ...exp.description.map(desc => new Paragraph({ text: `• ${desc}` })),
            new Paragraph({ text: '' }),
          ]),
          
          // Projects
          ...(resume.sections.projects && resume.sections.projects.length > 0 ? [
            new Paragraph({
              text: 'PROJECTS',
              heading: HeadingLevel.HEADING_1,
            }),
            ...resume.sections.projects.flatMap(project => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: project.name,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                text: project.description,
              }),
              new Paragraph({
                text: `Technologies: ${project.technologies.join(', ')}`,
              }),
              new Paragraph({ text: '' }),
            ])
          ] : []),
          
          // Education
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_1,
          }),
          ...resume.sections.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree} in ${edu.field}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              text: `${edu.institution} | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
            }),
            new Paragraph({ text: '' }),
          ]),
          
          // Skills
          new Paragraph({
            text: 'SKILLS',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: resume.sections.skills.join(', '),
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.userInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('DOCX export error:', error);
    throw new Error('Failed to export DOCX');
  }
};

export const exportToText = (resume: Resume): void => {
  const resumeText = `
${resume.userInfo.fullName}
${resume.userInfo.email} | ${resume.userInfo.phone}
${resume.userInfo.location}
${resume.userInfo.linkedin ? `LinkedIn: ${resume.userInfo.linkedin}` : ''}
${resume.userInfo.github ? `GitHub: ${resume.userInfo.github}` : ''}

PROFESSIONAL SUMMARY
${resume.sections.summary}

EXPERIENCE
${resume.sections.experience.map(exp => `
${exp.position} at ${exp.company}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.description.join('\n')}
`).join('\n')}

${resume.sections.projects && resume.sections.projects.length > 0 ? `
PROJECTS
${resume.sections.projects.map(project => `
${project.name}
${project.description}
Technologies: ${project.technologies.join(', ')}
`).join('\n')}
` : ''}

EDUCATION
${resume.sections.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution}
${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}
`).join('\n')}

SKILLS
${resume.sections.skills.join(', ')}
  `.trim();

  const blob = new Blob([resumeText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${resume.userInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (resume: Resume): void => {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${resume.userInfo.fullName.replace(/\s+/g, '_')}_Resume.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
