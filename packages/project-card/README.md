# @asafarim/project-card

A React component for displaying project cards with title, image, description, tech stack, and links.

## 🚀 Demo

Experience the full power of the ProjectCard component with our interactive demo:

```bash
npm run demo
```

Or explore the demo online: [ProjectCard Demo](https://asafarim-project-card-demo.netlify.app)

The demo showcases:
- 🌓 Light/Dark theme switching
- 📱 Responsive design
- 🎨 Featured cards
- ⏳ Loading states
- 🏷️ Status indicators
- 🔗 Multiple link types
- 📊 TypeScript examples

## Installation

```bash
npm install @asafarim/project-card
```

## Usage

```tsx
import { ProjectCard } from '@asafarim/project-card';

const MyComponent = () => {
  return (
    <ProjectCard
      title="My Awesome Project"
      image="https://example.com/image.jpg"
      description="This is a description of my project"
      techStack={[
        { name: 'React', color: '#61dafb', icon: '⚛️' },
        { name: 'TypeScript', color: '#3178c6', icon: '📘' }
      ]}
      links={[
        { type: 'demo', url: 'https://example.com', label: 'Live Demo' },
        { type: 'repo', url: 'https://github.com/user/repo' }
      ]}
      currentTheme="light"
      featured={true}
      status="active"
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | **Required**. The title of the project |
| `image` | `string` | - | URL to the project image/preview |
| `description` | `string` | - | **Required**. Project description |
| `techStack` | `TechStackItem[]` | - | **Required**. Array of technologies used |
| `links` | `ProjectLink[]` | - | **Required**. Array of project links |
| `currentTheme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Theme for the card |
| `className` | `string` | `''` | Additional CSS classes |
| `onCardClick` | `() => void` | - | Click handler for the card |
| `showTechStackIcons` | `boolean` | `false` | Whether to show tech stack icons |
| `maxDescriptionLength` | `number` | `150` | Maximum length for description |
| `imageAlt` | `string` | - | Alt text for the image |
| `isLoading` | `boolean` | `false` | Show loading state |
| `featured` | `boolean` | `false` | Highlight card as featured |
| `lastUpdated` | `string` | - | Last updated date |
| `status` | `'active' \| 'archived' \| 'in-progress'` | `'active'` | Project status |

## Types

### TechStackItem
```tsx
interface TechStackItem {
  name: string;
  color?: string;
  icon?: string;
}
```

### ProjectLink
```tsx
interface ProjectLink {
  type: 'demo' | 'repo' | 'documentation' | 'custom';
  url: string;
  label?: string;
}
```

## License

MIT

## 🎯 Features

- **Theme Support**: Light, dark, and auto themes
- **Responsive Design**: Works on all device sizes
- **Status Indicators**: Active, archived, and in-progress states
- **Loading States**: Beautiful loading animations
- **Featured Cards**: Special styling for important projects
- **Tech Stack Display**: With icons and colors
- **Multiple Link Types**: Demo, repo, documentation, and custom links
- **Click Handlers**: Interactive card behavior
- **TypeScript Support**: Full type safety
- **Customizable**: Extensive customization options

## 📂 Demo Structure

The demo folder contains a complete Vite + React + TypeScript application demonstrating all component features:

```
demo/
├── src/
│   ├── App.tsx          # Main demo application
│   ├── index.css        # Demo-specific styles
│   └── main.tsx         # Entry point
├── package.json         # Demo dependencies
└── README.md           # Demo documentation
```

## 🔧 Development

To run the demo locally:

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Start the demo
npm run demo
```

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.