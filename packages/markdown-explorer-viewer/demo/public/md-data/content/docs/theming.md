# Theming Guide

Learn how to customize the appearance of the Markdown Explorer Viewer to match your application's design.

## Built-in Themes

The component comes with three theme options:

- `light` - Clean, bright theme suitable for most applications
- `dark` - Dark theme for low-light environments
- `auto` - Automatically detects system preference

### Setting a Theme

```tsx
// Light theme
<MarkdownExplorer fileTree={fileTree} theme="light" />

// Dark theme  
<MarkdownExplorer fileTree={fileTree} theme="dark" />

// Auto-detect system preference
<MarkdownExplorer fileTree={fileTree} theme="auto" />
```

## CSS Custom Properties

The component uses CSS custom properties (variables) for easy theming:

### Light Theme Variables

```css
:root {
  --me-primary: #2563eb;
  --me-primary-hover: #1d4ed8;
  --me-text-primary: #1f2937;
  --me-text-secondary: #6b7280;
  --me-text-muted: #9ca3af;
  --me-bg-primary: #ffffff;
  --me-bg-secondary: #f9fafb;
  --me-bg-tertiary: #f3f4f6;
  --me-border: #e5e7eb;
  --me-border-hover: #d1d5db;
  --me-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --me-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --me-radius: 0.375rem;
  --me-radius-lg: 0.5rem;
  --me-transition: all 0.15s ease-in-out;
  --me-sidebar-width: 280px;
  --me-code-bg: #f8fafc;
  --me-code-border: #e2e8f0;
}
```

### Dark Theme Variables

```css
[data-theme="dark"] {
  --me-text-primary: #f9fafb;
  --me-text-secondary: #d1d5db;
  --me-text-muted: #9ca3af;
  --me-bg-primary: #111827;
  --me-bg-secondary: #1f2937;
  --me-bg-tertiary: #374151;
  --me-border: #374151;
  --me-border-hover: #4b5563;
  --me-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --me-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  --me-code-bg: #1e293b;
  --me-code-border: #334155;
}
```

## Custom Styling

### Using CSS Classes

You can add custom styling using the `className` prop:

```tsx
<MarkdownExplorer 
  fileTree={fileTree}
  className="my-custom-explorer"
/>
```

```css
.my-custom-explorer {
  border: 2px solid #3b82f6;
  border-radius: 12px;
  overflow: hidden;
}

/* Customize sidebar */
.my-custom-explorer .sidebar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Customize file tree */
.my-custom-explorer .file-tree {
  padding: 1rem;
}
```

### Overriding CSS Variables

Create your own theme by overriding the CSS variables:

```css
.purple-theme {
  --me-primary: #8b5cf6;
  --me-primary-hover: #7c3aed;
  --me-bg-secondary: #faf5ff;
  --me-border: #e9d5ff;
}
```

```tsx
<MarkdownExplorer 
  fileTree={fileTree}
  className="purple-theme"
/>
```

## Custom Markdown Components

Customize how markdown elements are rendered:

```tsx
const customComponents = {
  h1: ({ children }) => (
    <h1 style={{ 
      color: '#8b5cf6', 
      borderBottom: '3px solid #8b5cf6',
      paddingBottom: '0.5rem'
    }}>
      {children}
    </h1>
  ),
  
  h2: ({ children }) => (
    <h2 style={{ 
      color: '#6366f1',
      marginTop: '2rem'
    }}>
      🎯 {children}
    </h2>
  ),
  
  code: ({ children, className }) => (
    <code 
      className={className}
      style={{ 
        background: '#f1f5f9',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #cbd5e1'
      }}
    >
      {children}
    </code>
  ),
  
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '4px solid #8b5cf6',
      background: 'linear-gradient(90deg, #faf5ff 0%, #f3f4f6 100%)',
      padding: '1rem',
      margin: '1rem 0',
      borderRadius: '0 8px 8px 0'
    }}>
      {children}
    </blockquote>
  ),
  
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {children}
      </table>
    </div>
  )
};

<MarkdownExplorer 
  fileTree={fileTree}
  markdownComponents={customComponents}
/>
```

## Icon Customization

### Custom File Icons

```tsx
const renderFileIcon = (node: FileNode) => {
  const ext = node.name.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'md':
    case 'markdown':
      return <span style={{ color: '#22c55e' }}>📝</span>;
    case 'js':
    case 'jsx':
      return <span style={{ color: '#f7df1e' }}>🟨</span>;
    case 'ts':
    case 'tsx':
      return <span style={{ color: '#3178c6' }}>🟦</span>;
    case 'css':
      return <span style={{ color: '#1572b6' }}>🎨</span>;
    default:
      return <span style={{ color: '#6b7280' }}>📄</span>;
  }
};

const renderFolderIcon = (node: FileNode) => {
  return <span style={{ color: '#f59e0b' }}>📁</span>;
};

<MarkdownExplorer 
  fileTree={fileTree}
  renderFileIcon={renderFileIcon}
  renderFolderIcon={renderFolderIcon}
/>
```

## Responsive Design

The component is responsive by default, but you can customize breakpoints:

```css
/* Custom mobile styles */
@media (max-width: 768px) {
  .my-explorer {
    --me-sidebar-width: 100%;
  }
}

/* Custom tablet styles */
@media (max-width: 1024px) {
  .my-explorer {
    --me-sidebar-width: 240px;
  }
}
```

## Advanced Theming

### Theme Switching

```tsx
function ThemeableExplorer() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  
  return (
    <div>
      <div style={{ padding: '1rem' }}>
        <label>
          Theme:
          <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </label>
      </div>
      
      <MarkdownExplorer 
        fileTree={fileTree}
        theme={theme}
      />
    </div>
  );
}
```

### Dynamic Styling

```tsx
function DynamicExplorer() {
  const [accentColor, setAccentColor] = useState('#2563eb');
  
  const customStyle = {
    '--me-primary': accentColor,
    '--me-primary-hover': adjustBrightness(accentColor, -20)
  } as React.CSSProperties;
  
  return (
    <div style={customStyle}>
      <input 
        type="color" 
        value={accentColor}
        onChange={(e) => setAccentColor(e.target.value)}
      />
      
      <MarkdownExplorer fileTree={fileTree} />
    </div>
  );
}
```

This comprehensive theming system allows you to create a markdown explorer that perfectly matches your application's design language!