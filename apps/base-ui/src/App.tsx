import './App.css'
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
  },
];

function App() {
  const handleProjectClick = (project: { title: string; id: string }) => {
    console.log('Clicked on project:', project.title);
    // Handle project click - navigate to detail page, open modal, etc.
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>
        My Projects
      </h1>
      
      <PaginatedProjectGrid
        projects={sampleProjects}
        cardsPerPage={3}
        currentTheme="dark"
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
        // Use load more instead of pagination
        showLoadMore={false}
        loadMoreText="Load More Projects"
      />
    </div>
  );
}

export default App
