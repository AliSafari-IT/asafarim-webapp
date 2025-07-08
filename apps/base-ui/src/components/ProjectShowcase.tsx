// In your base-ui app, first install the package:
// pnpm add @asafarim/project-card

// Then use it:
import type { Project } from '@asafarim/paginated-project-grid';
import { ProjectCard } from '@asafarim/project-card';
import React from 'react';

const projects = [
  {} as Project,
];

function ProjectShowcase() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          {...project}
          showTechStackIcons={false}
          onCardClick={() => console.log(`Clicked on ${project.title}`)}
        />
      ))}
    </div>
  );
}
export default ProjectShowcase;