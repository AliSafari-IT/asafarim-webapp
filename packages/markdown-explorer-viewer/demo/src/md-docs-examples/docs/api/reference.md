# API Reference

## MarkdownExplorer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTree` | `FileNode` | required | The file tree structure |
| `theme` | `'light' | 'dark' | 'auto'` | `'auto'` | Theme mode |
| `enableSearch` | `boolean` | `true` | Enable search functionality |
| `showBreadcrumbs` | `boolean` | `true` | Show breadcrumb navigation |

## FileNode Interface

```typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}
```