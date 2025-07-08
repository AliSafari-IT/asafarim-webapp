import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProjectCard } from '@asafarim/project-card';

const ProjectCardsDemo: React.FC = () => {
  const sampleProject = {
    id: 'sample-project',
    title: 'Sample Project Card',
    description: 'This is a demonstration of the ProjectCard component with various features and styling options.',
    image: '/images/sample-project.png',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178c6', icon: '📝' },
      { name: 'CSS Modules', color: '#000000', icon: '🎨' }
    ],
    links: [
      { type: 'demo' as const, url: '#', label: 'Live Demo' },
      { type: 'repo' as const, url: '#' }
    ],
    tags: ['react', 'component', 'demo'],
    category: 'ui-component',
    status: 'active' as const,
    featured: true,
    lastUpdated: '2025-01-20',
    dateCreated: '2025-01-15'
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Project Card Component</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Component Demo</h2>
        <p>Interactive project card with hover effects and tech stack display.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <ProjectCard
            {...sampleProject}
            showTechStackIcons={true}
            onCardClick={() => console.log('Card clicked!')}
          />
          
          <ProjectCard
            {...sampleProject}
            title="Variant Without Icons"
            showTechStackIcons={false}
            onCardClick={() => console.log('Card clicked!')}
          />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Usage Example</h2>
        <pre style={{ 
          background: 'var(--surface)', 
          padding: '1rem', 
          borderRadius: '8px', 
          overflow: 'auto',
          fontSize: '0.9rem'
        }}>
{`import { ProjectCard } from '@asafarim/project-card';

<ProjectCard
  id="project-id"
  title="Project Title"
  description="Project description..."
  image="/path/to/image.png"
  techStack={[
    { name: 'React', color: '#61dafb', icon: '⚛️' }
  ]}
  links={[
    { type: 'demo', url: 'https://demo.com' },
    { type: 'repo', url: 'https://github.com/...' }
  ]}
  showTechStackIcons={true}
  onCardClick={() => console.log('Clicked!')}
/>`}
        </pre>
      </section>
    </div>
  );
};

const PaginatedGridDemo: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Paginated Project Grid</h1>
      
      <section>
        <h2>Component Demo</h2>
        <p>Grid layout with pagination, search, and responsive design.</p>
        
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--surface)', borderRadius: '8px' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            See the main projects page for a live demo of the PaginatedProjectGrid component.
          </p>
        </div>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Features</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ Responsive grid layout</li>
          <li>✅ Built-in search functionality</li>
          <li>✅ Pagination controls</li>
          <li>✅ Tech stack filtering</li>
          <li>✅ Theme support (light/dark)</li>
          <li>✅ Custom card click handlers</li>
        </ul>
      </section>
    </div>
  );
};

const SidebarDemo: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Sidebar Component</h1>
      
      <section>
        <h2>Features</h2>
        <p>The sidebar component you see on the left demonstrates:</p>
        
        <ul style={{ lineHeight: '1.8', marginTop: '1rem' }}>
          <li>✅ Collapsible navigation</li>
          <li>✅ Nested menu items</li>
          <li>✅ Icon support</li>
          <li>✅ Theme integration</li>
          <li>✅ Smooth animations</li>
          <li>✅ Responsive behavior</li>
          <li>✅ Accessibility features</li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Configuration</h2>
        <p>The sidebar can be customized with various menu structures and styling options.</p>
        
        <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--surface)', borderRadius: '8px' }}>
          <h3>Try it out:</h3>
          <p>Click the menu toggle button (☰) in the header to collapse/expand the sidebar.</p>
        </div>
      </section>
    </div>
  );
};

const ComponentsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <div>
          <h1>UI Components</h1>
          <p>Explore our collection of reusable React components.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3>🎴 Project Cards</h3>
              <p>Beautiful, interactive project showcase cards with tech stack visualization.</p>
            </div>
            
            <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3>📊 Paginated Grid</h3>
              <p>Responsive grid layout with search, pagination, and filtering capabilities.</p>
            </div>
            
            <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3>🗂️ Sidebar Navigation</h3>
              <p>Collapsible sidebar with nested menus and smooth animations.</p>
            </div>
          </div>
        </div>
      } />
      <Route path="project-cards" element={<ProjectCardsDemo />} />
      <Route path="paginated-grid" element={<PaginatedGridDemo />} />
      <Route path="sidebar" element={<SidebarDemo />} />
    </Routes>
  );
};

export default ComponentsPage;
