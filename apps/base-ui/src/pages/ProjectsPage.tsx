import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PaginatedProjectGrid } from '@asafarim/paginated-project-grid';
import type { Project } from '@asafarim/paginated-project-grid';
import { useTheme } from '../context';
import { allProjects } from './allProjects';

const AllProjectsPage: React.FC<{ projects: Project[], categories?: string[] }> = ({ projects, categories }) => {
  const { effectiveTheme } = useTheme();
  const handleProjectClick = (project: { title: string; id: string }) => {
    console.log('Clicked on project:', project.title);
    window.location.href = `/projects/${project.id}`;
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Projects</h1>
      <PaginatedProjectGrid
        projects={projects.filter(project => !categories || categories.includes(project.category || ''))}
        cardsPerPage={3}
        currentTheme={effectiveTheme}
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

const ProjectsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AllProjectsPage projects={allProjects} />} />
      <Route path="webapp" element={<AllProjectsPage projects={allProjects} categories={['webapp', 'fullstack']} />} />
      <Route path="e-commerce" element={<AllProjectsPage projects={allProjects} categories={['e-commerce']} />} />
      <Route path="scientific" element={<AllProjectsPage projects={allProjects} categories={['scientific']} />} />
      <Route path="all" element={<AllProjectsPage projects={allProjects} />} />
    </Routes>
  );
};

export default ProjectsPage;
