import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PaginatedProjectGrid } from '@asafarim/paginated-project-grid';
import type { Project } from '@asafarim/paginated-project-grid';

// Sample projects data
const sampleProjects: Project[] = [
  {
    id: 'ecommerce-platform-igs',
    title: 'IGS Pharma',
    description: 'A comprehensive healthcare management system for pharmacies, including inventory management and patient records.',
    image: '/images/igs-asafarim-com.png',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'MongoDB', color: '#47A248', icon: '🍃' }
    ],
    links: [
      { type: 'demo', url: 'https://igs.asafarim.com', label: 'Live Demo' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/IGS' }
    ],
    tags: ['healthcare', 'management', 'pharmacy'],
    category: 'web-development',
    status: 'active',
    featured: true,
    lastUpdated: '2025-02-10',
    dateCreated: '2025-01-15'
  },
  {
    id: 'aquaflow-hydrological-modelling',
    title: 'Aquaflow Hydrological Modelling',
    image: '/images/aquaflow-asafarim-com.png',
    description: 'A comprehensive hydrological modelling tool for water resource management.',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'MySQL', color: '#47A248', icon: '🐬' }
    ],
    links: [
      { type: 'demo', url: 'https://aquaflow.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/AquaFlow' }
    ],
    tags: ['fullstack', 'hydrology', 'modelling'],
    category: 'web-development',
    status: 'active',
    featured: false,
    lastUpdated: '2025-6-15'
  },
];

const AllProjectsPage: React.FC = () => {
  const handleProjectClick = (project: { title: string; id: string }) => {
    console.log('Clicked on project:', project.title);
    window.location.href = `/projects/${project.id}`;
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Projects</h1>
      <PaginatedProjectGrid
        projects={sampleProjects}
        cardsPerPage={6}
        currentTheme="light"
        enableSearch={true}
        showTechStackIcons={true}
        maxDescriptionLength={120}
        searchPlaceholder="Search projects by name, description, or technology..."
        onProjectClick={handleProjectClick}
        searchFields={['title', 'description', 'techStack', 'tags', 'category']}
        responsive={{
          mobile: 1,
          tablet: 2,
          desktop: 3
        }}
        showLoadMore={true}
        loadMoreText="Load More Projects"
      />
    </div>
  );
};

const PortfolioPage: React.FC = () => {
  return (
    <div>
      <h1>Portfolio</h1>
      <p>Featured work and case studies.</p>
    </div>
  );
};

const WebAppsPage: React.FC = () => {
  return (
    <div>
      <h1>Web Applications</h1>
      <p>Showcase of web applications and SaaS products.</p>
    </div>
  );
};

const MobileAppsPage: React.FC = () => {
  return (
    <div>
      <h1>Mobile Applications</h1>
      <p>Mobile apps and cross-platform solutions.</p>
    </div>
  );
};

const ProjectDetailPage: React.FC = () => {
  return (
    <div>
      <h1>Project Details</h1>
      <p>Detailed view of the selected project.</p>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AllProjectsPage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="web-apps" element={<WebAppsPage />} />
      <Route path="mobile-apps" element={<MobileAppsPage />} />
      <Route path=":id" element={<ProjectDetailPage />} />
    </Routes>
  );
};

export default ProjectsPage;
