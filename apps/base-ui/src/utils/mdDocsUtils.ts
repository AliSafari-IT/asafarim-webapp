import type { FileNode } from '@asafarim/markdown-explorer-viewer';

// Mock file tree data for the md-docs folder
// In a real application, you would read this from the filesystem or API
export const createMdDocsFileTree = (): FileNode => {
  return {
    name: 'Documentation',
    path: '/docs',
    type: 'folder',
    children: [
      {
        name: 'changelogs',
        path: '/docs/changelogs',
        type: 'folder',
        children: [
          {
            name: 'CHANGELOG.md',
            path: '/docs/changelogs/CHANGELOG.md',
            type: 'file',
            content: `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Professional layout system with sidebar navigation
- Theme management context
- Responsive design components
- Markdown documentation system

### Changed
- Updated React and TypeScript dependencies
- Enhanced component styling with CSS modules

### Fixed
- Navigation routing issues
- Theme persistence across sessions
`
          },
          {
            name: '2025-07-08_project-initialized-react-typescript-vite.md',
            path: '/docs/changelogs/2025-07-08_project-initialized-react-typescript-vite.md',
            type: 'file',
            content: `# Project Initialization - React TypeScript Vite

**Date:** July 8, 2025

## Overview
Initialized a new React project with TypeScript and Vite for the Base UI application.

## Technical Stack
- **Framework:** React 18.2.0
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 4.6.0
- **Styling:** CSS Modules
- **Routing:** React Router DOM 6.8.0

## Project Structure
\`\`\`
base-ui/
├── src/
│   ├── components/
│   │   └── layout/
│   ├── pages/
│   ├── router/
│   └── context/
├── public/
└── md-docs/
\`\`\`

## Initial Features
- Professional layout system
- Sidebar navigation with nested menus
- Theme management (light/dark)
- Responsive design
- Component library integration

## Next Steps
- Add more pages and components
- Implement proper routing
- Add testing framework
- Create documentation system
`
          }
        ]
      },
      {
        name: 'my-packages',
        path: '/docs/my-packages',
        type: 'folder',
        children: [
          {
            name: 'display-code.md',
            path: '/docs/my-packages/display-code.md',
            type: 'file',
            content: `# @asafarim/display-code

A React component for displaying code snippets with syntax highlighting and copy functionality.

## Installation

\`\`\`bash
npm install @asafarim/display-code
\`\`\`

## Usage

\`\`\`tsx
import { DisplayCode } from '@asafarim/display-code';

function App() {
  return (
    <DisplayCode
      code="console.log('Hello, World!');"
      language="javascript"
      showLineNumbers={true}
      enableCopy={true}
    />
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`code\` | string | - | The code to display |
| \`language\` | string | 'text' | Programming language for syntax highlighting |
| \`showLineNumbers\` | boolean | false | Show line numbers |
| \`enableCopy\` | boolean | true | Enable copy to clipboard |
| \`theme\` | 'light' \\| 'dark' | 'light' | Color theme |

## Features

- ✅ Syntax highlighting for 100+ languages
- ✅ Copy to clipboard functionality
- ✅ Line numbers
- ✅ Theme support (light/dark)
- ✅ Responsive design
- ✅ TypeScript support
`
          },
          {
            name: 'paginated-project-grid.md',
            path: '/docs/my-packages/paginated-project-grid.md',
            type: 'file',
            content: `# @asafarim/paginated-project-grid

A React component for displaying projects in a paginated grid layout with search and filtering capabilities.

## Installation

\`\`\`bash
npm install @asafarim/paginated-project-grid
\`\`\`

## Usage

\`\`\`tsx
import { PaginatedProjectGrid } from '@asafarim/paginated-project-grid';

const projects = [
  {
    id: 'project-1',
    title: 'My Project',
    description: 'A great project',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' }
    ],
    // ... more project properties
  }
];

function App() {
  return (
    <PaginatedProjectGrid
      projects={projects}
      cardsPerPage={6}
      enableSearch={true}
      showTechStackIcons={true}
      onProjectClick={(project) => console.log(project)}
    />
  );
}
\`\`\`

## Features

- ✅ Responsive grid layout
- ✅ Pagination controls
- ✅ Search functionality
- ✅ Tech stack filtering
- ✅ Custom project cards
- ✅ Theme support
- ✅ TypeScript support
- ✅ Accessibility features

## Props

The component accepts a comprehensive set of props for customization:

- \`projects\`: Array of project objects
- \`cardsPerPage\`: Number of cards per page
- \`enableSearch\`: Enable search functionality
- \`searchFields\`: Fields to search in
- \`responsive\`: Responsive breakpoints
- \`onProjectClick\`: Click handler for projects
`
          },
          {
            name: 'project-card.md',
            path: '/docs/my-packages/project-card.md',
            type: 'file',
            content: `# @asafarim/project-card

A beautiful, interactive React component for showcasing individual projects with tech stack visualization.

## Installation

\`\`\`bash
npm install @asafarim/project-card
\`\`\`

## Usage

\`\`\`tsx
import { ProjectCard } from '@asafarim/project-card';

const project = {
  id: 'my-project',
  title: 'My Awesome Project',
  description: 'A comprehensive project description...',
  image: '/path/to/image.jpg',
  techStack: [
    { name: 'React', color: '#61dafb', icon: '⚛️' },
    { name: 'TypeScript', color: '#3178c6', icon: '📝' }
  ],
  links: [
    { type: 'demo', url: 'https://demo.com' },
    { type: 'repo', url: 'https://github.com/...' }
  ]
};

function App() {
  return (
    <ProjectCard
      {...project}
      showTechStackIcons={true}
      onCardClick={() => console.log('Card clicked!')}
    />
  );
}
\`\`\`

## Features

- ✅ Beautiful card design with hover effects
- ✅ Tech stack visualization with icons
- ✅ Multiple link types (demo, repo, docs)
- ✅ Responsive design
- ✅ Theme support
- ✅ TypeScript support
- ✅ Accessibility features
- ✅ Customizable styling

## Card Types

The component supports different card layouts and styles:
- Standard project card
- Featured project card
- Compact project card
- List view project card

## Customization

The component is highly customizable with CSS modules and props for styling and behavior modification.
`
          }
        ]
      }
    ]
  };
};

// Create sidebar items for documentation
export const createDocumentationSidebarItems = () => {
  return [
    {
      id: 'docs-overview',
      label: 'Overview',
      url: '/docs',
    },
    {
      id: 'docs-changelogs',
      label: 'Changelogs',
      url: '/docs/changelogs',
      children: [
        {
          id: 'changelog-main',
          label: 'CHANGELOG.md',
          url: '/docs/changelogs/CHANGELOG.md',
        },
        {
          id: 'changelog-init',
          label: 'Project Initialization',
          url: '/docs/changelogs/2025-07-08_project-initialized-react-typescript-vite.md',
        }
      ]
    },
    {
      id: 'docs-packages',
      label: 'Package Documentation',
      url: '/docs/my-packages',
      children: [
        {
          id: 'docs-display-code',
          label: 'Display Code',
          url: '/docs/my-packages/display-code.md',
        },
        {
          id: 'docs-paginated-grid',
          label: 'Paginated Project Grid',
          url: '/docs/my-packages/paginated-project-grid.md',
        },
        {
          id: 'docs-project-card',
          label: 'Project Card',
          url: '/docs/my-packages/project-card.md',
        }
      ]
    }
  ];
};
