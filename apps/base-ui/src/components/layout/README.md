# Base UI Layout Components

This directory contains the layout components for the Base UI application, built with the `@asafarim/sidebar` package for collapsible navigation.

## Components

### Layout
The main layout component that wraps your application with a header, sidebar, footer, and content area.

```tsx
import { Layout } from './components/layout';
import type { SidebarItemType } from '@asafarim/sidebar';

const sidebarItems: SidebarItemType[] = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    url: '/',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '📋',
    url: '/projects',
    children: [
      {
        id: 'portfolio',
        label: 'Portfolio',
        url: '/projects/portfolio',
      }
    ]
  }
];

function App() {
  return (
    <Layout
      title="My App"
      theme="light"
      sidebarItems={sidebarItems}
      showSidebar={true}
    >
      <div>Your content here</div>
    </Layout>
  );
}
```

### Header
Displays the application title and navigation actions.

### Footer
Contains copyright information and footer links.

## Features

- ✅ **Collapsible Sidebar** - Full sidebar navigation with expand/collapse functionality
- ✅ **Theme Support** - Light and dark theme variants
- ✅ **Responsive Design** - Mobile-friendly layout
- ✅ **Hierarchical Navigation** - Support for nested menu items
- ✅ **Custom Icons** - Emoji or custom icon support
- ✅ **Badge Support** - Show notifications or counts on menu items
- ✅ **Click Handlers** - Custom onClick handlers for menu items
- ✅ **URL Navigation** - Integration with React Router

## Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display in the main area |
| `title` | `string` | `'Base UI App'` | Application title shown in header |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme variant |
| `sidebarItems` | `SidebarItemType[]` | `[]` | Custom sidebar navigation items |
| `showSidebar` | `boolean` | `true` | Whether to show the sidebar |

## Sidebar Item Structure

```typescript
interface SidebarItemType {
  id: string;
  label: string;
  icon?: string;
  url?: string;
  onClick?: () => void;
  children?: SidebarItemType[];
  badge?: string | number;
  disabled?: boolean;
}
```

## Styling

The layout uses CSS modules for styling with CSS custom properties for theming:

- `Layout.module.css` - Main layout structure
- `Header.module.css` - Header component styles  
- `Footer.module.css` - Footer component styles

## Theme Variables

### Light Theme
```css
--bg-primary: #ffffff;
--bg-secondary: #f8f9fa;
--text-primary: #212529;
--text-secondary: #6c757d;
--border-color: #dee2e6;
```

### Dark Theme
```css
--bg-primary: #1a1a1a;
--bg-secondary: #2d2d2d;
--text-primary: #e9ecef;
--text-secondary: #adb5bd;
--border-color: #495057;
```

## Mobile Responsiveness

The layout automatically adapts to smaller screens:
- Header becomes more compact
- Sidebar may overlay content on mobile
- Touch-friendly button sizes
- Optimized spacing and typography

## Usage with React Router

The layout works seamlessly with React Router. Menu items with `url` properties will trigger navigation when clicked. You can also provide custom `onClick` handlers for more complex interactions.
