import React from 'react';
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

const HomePage: React.FC = () => {
  const handleProjectClick = (project: { title: string; id: string }) => {
    console.log('Clicked on project:', project.title);
    // Navigate to project detail page
    window.location.href = `/projects/${project.id}`;
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Welcome to Base UI App</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '1rem' }}>
          A modern React application with professional layout and components
        </p>
      </div>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Featured Projects</h2>
        <PaginatedProjectGrid
          projects={sampleProjects.filter(p => p.featured)}
          cardsPerPage={2}
          currentTheme="light"
          enableSearch={false}
          showTechStackIcons={true}
          maxDescriptionLength={120}
          onProjectClick={handleProjectClick}
          responsive={{
            mobile: 1,
            tablet: 1,
            desktop: 2
          }}
          showLoadMore={false}
        />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3>🚀 Quick Start</h3>
          <p>Get started with our component library and build amazing applications.</p>
          <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            View Components
          </button>
        </div>
        
        <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3>📚 Documentation</h3>
          <p>Learn how to use our components and build professional layouts.</p>
          <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Read Docs
          </button>
        </div>
        
        <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3>💼 Portfolio</h3>
          <p>Browse through our collection of projects and case studies.</p>
          <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            View Portfolio
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
