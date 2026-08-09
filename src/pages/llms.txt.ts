import homeData from '../data/home.json';
import careerData from '../data/career.json';
import educationData from '../data/education.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';

export async function GET() {
  const siteUrl = (homeData.siteUrl || '').replace(/\/$/, '');

  const skillsStr = skillsData.categories
    .map((cat) => `- **${cat.title}:** ${cat.skills.map((s) => s.name).join(', ')}`)
    .join('\n');

  const careerStr = careerData
    .map((item) => `- **${item.role}** — ${item.company} (${item.period})\n  * ${item.description}`)
    .join('\n');

  const educationStr = educationData
    .map((item) => `- **${item.degree}** — ${item.institution} (${item.period})`)
    .join('\n');

  const projectsStr = projectsData
    .map((proj) => `- **${proj.title}:** ${proj.description}`)
    .join('\n');

  const socialsStr = homeData.socials
    .filter((s) => s.url && s.url !== '#' && s.url !== '')
    .map((s) => `- **${s.name}:** ${s.url}`)
    .join('\n');

  const markdown = `# ${homeData.name}

> ${homeData.description}

## Overview
${homeData.name} is a ${homeData.jobTitle || 'Software Engineer'}. ${homeData.description}

## Key Information
- **Portfolio:** ${siteUrl}
${homeData.resumeUrl ? `- **Resume:** ${siteUrl}${homeData.resumeUrl}` : ''}

## Skills & Expertise
${skillsStr}

## Experience
${careerStr}

## Education
${educationStr}

## Key Initiatives & Projects
${projectsStr}

## Contact & Links
- **Website:** ${siteUrl}
${socialsStr}
`;

  return new Response(markdown.trim() + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
