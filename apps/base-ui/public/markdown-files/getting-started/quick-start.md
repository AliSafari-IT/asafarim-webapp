---
title: "Quick Start Guide"
description: "Get up and running with ASafariM components in minutes"
author: "Ali Safari"
date: "2025-01-22"
category: "Getting Started"
tags:
  - quick-start
  - setup
  - installation
---

# Quick Start Guide 🚀

Welcome! This guide will help you get started with ASafariM components and packages in just a few minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher
- **npm**, **yarn**, or **pnpm** package manager
- A React 18+ project (TypeScript recommended)

## Installation

### Option 1: Install Specific Components

Install only the components you need:

```bash
# Install individual packages
npm install @asafarim/project-card
npm install @asafarim/sidebar
npm install @asafarim/simple-md-viewer

# Or with pnpm
pnpm add @asafarim/project-card @asafarim/sidebar @asafarim/simple-md-viewer
```

### Option 2: Install Multiple Packages

For multiple packages, you can install them all at once:

```bash
npm install @asafarim/project-card @asafarim/sidebar @asafarim/simple-md-viewer @asafarim/display-code @asafarim/paginated-project-grid
```

## Basic Usage

### 1. Project Card Component

```tsx
import { ProjectCard } from '@asafarim/project-card';

const MyProject = () => {
  const project = {
    id: '1',
    title: 'My Awesome Project',
    description: 'A revolutionary web application built with React and TypeScript',
    image: '/images/project.jpg',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178c6', icon: '📘' }
    ],
    links: [
      { type: 'demo', url: 'https://demo.example.com' },
      { type: 'repo', url: 'https://github.com/user/repo' }
    ]
  };

  return <ProjectCard project={project} />;
};
```

### 2. Sidebar Component

```tsx
import { Sidebar } from '@asafarim/sidebar';

const App = () => {
  const sidebarItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      url: '/'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '📋',
      url: '/projects'
    }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        items={sidebarItems}
        theme="light"
        collapsible={true}
      />
      <main>
        {/* Your main content */}
      </main>
    </div>
  );
};
```

### 3. Simple Markdown Viewer

```tsx
import { MarkdownContent, ThemeProvider } from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

const DocsPage = () => {
  return (
    <ThemeProvider theme="light">
      <MarkdownContent 
        apiBaseUrl="http://localhost:3300"
        showHomePage={true}
        hideFileTree={false}
      />
    </ThemeProvider>
  );
};
```

## TypeScript Support

All packages include full TypeScript definitions. Import types as needed:

```tsx
import { ProjectCardProps, TechStackItem } from '@asafarim/project-card';
import { SidebarProps, SidebarItemType } from '@asafarim/sidebar';

const techStack: TechStackItem[] = [
  { name: 'React', color: '#61dafb', icon: '⚛️' }
];
```

## Styling

### CSS Custom Properties

Most components support theming through CSS custom properties:

```css
:root {
  --primary-color: #007acc;
  --background-color: #ffffff;
  --text-color: #333333;
  --border-color: #e1e4e8;
}

[data-theme="dark"] {
  --background-color: #1a1a1a;
  --text-color: #e1e1e1;
  --border-color: #404040;
}
```

### Custom Classes

Add custom styling by passing className props:

```tsx
<ProjectCard 
  project={project}
  className="my-custom-card"
/>
```

## Next Steps

### 🎯 Explore Components
- [Project Card Examples](../packages/project-card/examples.md)
- [Sidebar Configuration](../packages/sidebar/configuration.md)
- [Markdown Viewer Setup](../packages/simple-md-viewer/setup.md)

### 📚 Learn More
- [Component API Reference](../api-reference/components/overview.md)
- [Styling Guide](../tutorials/styling-guide/introduction.md)
- [Integration Examples](../tutorials/integration-examples/basic-setup.md)

### 🛠️ Development
- [Development Setup](./development-setup.md)
- [Contributing Guide](../contributing/getting-started.md)
- [Building from Source](../contributing/building.md)

## Common Issues

### Package Not Found
If you encounter package not found errors, ensure you're using the correct package names:
- ✅ `@asafarim/project-card` (correct)
- ❌ `asafarim/project-card` (missing @)

### TypeScript Errors
Make sure to install type definitions if not automatically included:
```bash
npm install --save-dev @types/react @types/react-dom
```

### Styling Issues
Always import component CSS files:
```tsx
import '@asafarim/simple-md-viewer/dist/style.css';
```

## Support

Need help? Check out:
- [Troubleshooting Guide](../troubleshooting/common-issues.md)
- [FAQ](../faq/index.md)
- [GitHub Issues](https://github.com/AliSafari-IT/asafarim-webapp/issues)

---

**Ready to build something awesome?** Start with the component that best fits your needs and explore the other packages as your project grows! 🎉
