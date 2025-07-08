# @asafarim/sidebar

A flexible and customizable collapsible sidebar component for React applications.

## Features

- 🎯 **Fully Collapsible** - Smooth toggle between expanded and collapsed states
- 🎨 **Themed** - Light and dark theme support
- 📱 **Responsive** - Mobile-friendly with overlay support
- ♿ **Accessible** - Full keyboard navigation and screen reader support
- 🔧 **Flexible** - Highly customizable with multiple configuration options
- 🌲 **Nested Items** - Support for multi-level navigation hierarchies
- 🎪 **Icons & Badges** - Rich visual elements for better UX
- 📍 **Positioning** - Left or right sidebar positioning

## Installation

```bash
npm install @asafarim/sidebar
```

## Basic Usage

```tsx
import { Sidebar } from '@asafarim/sidebar';
import type { SidebarItem } from '@asafarim/sidebar';

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    onClick: () => console.log('Dashboard clicked')
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '📁',
    children: [
      {
        id: 'my-projects',
        label: 'My Projects',
        icon: '📂'
      },
      {
        id: 'shared-projects',
        label: 'Shared Projects',
        icon: '👥',
        badge: 3
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    url: '/settings'
  }
];

function App() {
  return (
    <Sidebar
      items={sidebarItems}
      logo={<span>My App</span>}
      theme="dark"
      onItemClick={(item) => console.log('Clicked:', item.label)}
    />
  );
}
```

## Props

### SidebarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SidebarItem[]` | **Required** | Array of navigation items |
| `isCollapsed` | `boolean` | `undefined` | Controlled collapsed state |
| `onToggle` | `(collapsed: boolean) => void` | `undefined` | Callback when toggle state changes |
| `width` | `string` | `'280px'` | Width when expanded |
| `collapsedWidth` | `string` | `'64px'` | Width when collapsed |
| `className` | `string` | `''` | Additional CSS class |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `position` | `'left' \| 'right'` | `'left'` | Sidebar position |
| `overlay` | `boolean` | `false` | Show overlay on mobile |
| `showToggleButton` | `boolean` | `true` | Show collapse/expand button |
| `logo` | `ReactNode` | `undefined` | Logo/brand element |
| `footer` | `ReactNode` | `undefined` | Footer content |
| `onItemClick` | `(item: SidebarItem) => void` | `undefined` | Item click handler |

### SidebarItem

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `label` | `string` | ✅ | Display text |
| `icon` | `string` | ❌ | Icon (emoji or text) |
| `url` | `string` | ❌ | Navigation URL |
| `onClick` | `() => void` | ❌ | Click handler |
| `children` | `SidebarItem[]` | ❌ | Nested items |
| `badge` | `string \| number` | ❌ | Notification badge |
| `disabled` | `boolean` | ❌ | Disabled state |

## Examples

### Controlled Sidebar

```tsx
function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      items={items}
      isCollapsed={collapsed}
      onToggle={setCollapsed}
      theme="dark"
    />
  );
}
```

### With Custom Footer

```tsx
<Sidebar
  items={items}
  footer={
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <img src="/avatar.jpg" alt="User" style={{ borderRadius: '50%', width: '40px' }} />
      <div>John Doe</div>
    </div>
  }
/>
```

### Mobile Responsive with Overlay

```tsx
<Sidebar
  items={items}
  overlay={true}
  theme="light"
  position="left"
/>
```

### Complex Navigation Structure

```tsx
const complexItems: SidebarItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: '🏢',
    children: [
      {
        id: 'overview',
        label: 'Overview',
        icon: '📈'
      },
      {
        id: 'team',
        label: 'Team Members',
        icon: '👥',
        badge: '12'
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        children: [
          {
            id: 'active-projects',
            label: 'Active',
            badge: 5
          },
          {
            id: 'archived-projects',
            label: 'Archived',
            badge: 23
          }
        ]
      }
    ]
  }
];
```

## Styling

The component uses CSS modules for styling. You can override styles by providing a custom `className` prop or by targeting the CSS classes directly.

### CSS Custom Properties

```css
.sidebar {
  --sidebar-bg: #ffffff;
  --sidebar-text: #374151;
  --sidebar-hover: #f3f4f6;
  --sidebar-active: #dbeafe;
  --sidebar-border: #e5e7eb;
}

.sidebar.dark {
  --sidebar-bg: #1f2937;
  --sidebar-text: #d1d5db;
  --sidebar-hover: #374151;
  --sidebar-active: #1e40af;
  --sidebar-border: #374151;
}
```

## Accessibility

The sidebar component is built with accessibility in mind:

- Full keyboard navigation support
- ARIA labels and roles
- Screen reader friendly
- Focus management
- High contrast support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
