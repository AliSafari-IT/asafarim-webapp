# @asafarim/paginated-project-grid

A responsive React component for displaying paginated project cards with built-in search functionality.

## Features

- 📱 **Responsive Design**: Adapts to different screen sizes
- 🔍 **Built-in Search**: Collapsible search with customizable fields
- 📄 **Pagination**: Traditional pagination or load-more functionality
- 🎨 **Theme Support**: Light/dark themes with CSS variables
- 🚀 **TypeScript**: Full TypeScript support with type definitions
- 📦 **CSS Modules**: Scoped CSS with no external dependencies
- ⚛️ **React 17/18**: Compatible with modern React versions

## Installation

```bash
npm install @asafarim/paginated-project-grid @asafarim/project-card
```

## Usage

```tsx
import { PaginatedProjectGrid } from '@asafarim/paginated-project-grid';

const projects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React and Node.js',
    image: '/images/ecommerce.jpg',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'Node.js', color: '#339933', icon: '🟢' },
      { name: 'MongoDB', color: '#47A248', icon: '🍃' }
    ],
    links: [
      { type: 'demo', url: 'https://demo.example.com' },
      { type: 'repo', url: 'https://github.com/user/repo' }
    ],
    tags: ['fullstack', 'ecommerce'],
    category: 'web-development',
    status: 'active',
    featured: true,
    lastUpdated: '2024-01-15'
  },
  // ... more projects
];

function ProjectShowcase() {
  return (
    <PaginatedProjectGrid
      projects={projects}
      cardsPerPage={6}
      currentTheme="light"
      enableSearch={true}
      showTechStackIcons={true}
      onProjectClick={(project) => {
        console.log('Clicked project:', project.title);
      }}
    />
  );
}
```

## Props

### PaginatedProjectGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `projects` | `Project[]` | - | **Required**. Array of project objects |
| `cardsPerPage` | `number` | `6` | Number of cards to display per page |
| `currentTheme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Theme for the grid |
| `className` | `string` | `''` | Additional CSS classes |
| `onProjectClick` | `(project: Project) => void` | - | Click handler for project cards |
| `showTechStackIcons` | `boolean` | `false` | Show icons in tech stack tags |
| `maxDescriptionLength` | `number` | `150` | Maximum description length |
| `enableSearch` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `"Search projects..."` | Search input placeholder |
| `noResultsMessage` | `string` | `"No projects found..."` | Message when no results |
| `loadingMessage` | `string` | `"Loading projects..."` | Loading state message |
| `isLoading` | `boolean` | `false` | Show loading state |
| `searchFields` | `Array` | `['title', 'description', 'techStack', 'tags']` | Fields to search in |
| `responsive` | `object` | `{mobile: 1, tablet: 2, desktop: 3}` | Responsive breakpoints |
| `showLoadMore` | `boolean` | `false` | Use load more instead of pagination |
| `loadMoreText` | `string` | `"Load More"` | Load more button text |
| `animationDuration` | `number` | `300` | Animation duration in ms |

### Project Interface

```tsx
interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  techStack: TechStackItem[];
  links: ProjectLink[];
  tags?: string[];
  category?: string;
  status?: 'active' | 'archived' | 'in-progress';
  featured?: boolean;
  lastUpdated?: string;
  dateCreated?: string;
}
```

## Search Functionality

The component includes a collapsible search feature that can search across multiple fields:

- **title**: Project title
- **description**: Project description
- **techStack**: Technology names
- **tags**: Project tags
- **category**: Project category

### Search Example

```tsx
<PaginatedProjectGrid
  projects={projects}
  enableSearch={true}
  searchFields={['title', 'techStack', 'tags']}
  searchPlaceholder="Search by title, tech, or tags..."
/>
```

## Responsive Design

The grid automatically adapts to different screen sizes:

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

You can customize this behavior:

```tsx
<PaginatedProjectGrid
  projects={projects}
  responsive={{
    mobile: 1,
    tablet: 2,
    desktop: 4
  }}
/>
```

## Theming

The component supports light and dark themes:

```tsx
<PaginatedProjectGrid
  projects={projects}
  currentTheme="dark"
/>
```

## Load More vs Pagination

Choose between traditional pagination or load more functionality:

```tsx
// Traditional pagination (default)
<PaginatedProjectGrid
  projects={projects}
  cardsPerPage={6}
/>

// Load more functionality
<PaginatedProjectGrid
  projects={projects}
  cardsPerPage={6}
  showLoadMore={true}
  loadMoreText="Show More Projects"
/>
```

## CSS Customization

The component uses CSS modules for styling. You can override styles by targeting the CSS classes:

```css
/* Custom styles */
.custom-grid {
  max-width: 1400px;
}

.custom-grid .projectCard {
  border-radius: 16px;
}
```

## TypeScript Support

The package includes full TypeScript definitions:

```tsx
import type { PaginatedProjectGridProps, Project } from '@asafarim/paginated-project-grid';

const MyComponent: React.FC<{projects: Project[]}> = ({ projects }) => {
  const handleProjectClick = (project: Project) => {
    // project is fully typed
    console.log(project.title);
  };

  return (
    <PaginatedProjectGrid
      projects={projects}
      onProjectClick={handleProjectClick}
    />
  );
};
```

## License

MIT © Ali Safari
