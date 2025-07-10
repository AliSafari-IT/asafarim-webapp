# Creating a TreeView Sidebar from Markdown Files

Date: 2024-12-15 
Updated: 2024-12-15 22:44:00

This guide explains how to create a TreeView sidebar from markdown files located in a folder with nested subdirectories. We will use React and Vite to accomplish this. By following these steps, you can create a dynamic TreeView sidebar that displays markdown files from a directory with nested subdirectories.

## Step 1: Configure Vite to Import Markdown Files

First, configure Vite to import markdown files from the desired directory. Update your Vite configuration to include a glob pattern that captures all markdown files, including those in nested directories.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mdfiles': path.resolve(__dirname, '../../../docs'),
    },
  },
});
```

## Step 2: Import Markdown Files

Use Vite's `import.meta.glob` to import markdown files. Ensure the pattern includes all nested directories.

```typescript
// mdFilesUtils.ts
const techDocs = {
  ...import.meta.glob('@mdfiles/TechDocs/**/*.md', {
    as: 'raw',
    eager: true,
  }),
};
```

## Step 3: Create a TreeView Object

Create a function to generate a TreeView structure from the imported markdown files. This function should handle nested directories recursively.

```typescript
function getTreeViewObject(mdFiles: Record<string, string>, name?: string, label?: string, icon?: JSX.Element, docurl?: string): INavItem {
  const baseurl = docurl?.replace(/\/$/, '');
  return {
    id: `asm-mds-${name}`,
    title: label || 'Tree View Title',
    label: label || 'Tree View Label',
    name: name,
    to: '#',
    icon,
    content: '',
    subMenu: Object.entries(mdFiles).map(([path, content]) => {
      const parts = path.split('/');
      const slug = parts.pop()?.replace('.md', '') || '';
      const isDirectory = parts.length > 0 && !slug;
      const type = slug.split('_')[0];
      const title = slug.split('_').slice(1).join('-');
      const to = `${baseurl}/${slug}`;
      const filepath = path;
      const createdAt = getCreationDate(content) || new Date(Date.now());
      const updatedAt = getUpdateDate(content) || createdAt;
      const id = `${name}-${slug}`;
      const label = slug;
      const nameValue = `${name}-${slug}`;

      if (isDirectory) {
        const subMdFiles = Object.fromEntries(
          Object.entries(mdFiles).filter(([subPath]) => subPath.startsWith(path))
        );
        return getTreeViewObject(subMdFiles, name, label, icon, docurl);
      }

      return {
        id,
        slug,
        type,
        title: `${type.toUpperCase()}: ${title}`,
        label,
        name: nameValue,
        to,
        filepath,
        icon,
        content,
        createdAt,
        updatedAt,
        subMenu: []
      };
    }) as unknown as INavItem[],
  };
}
```

## Step 4: Render the TreeView in React

Use the TreeView object to render a sidebar in your React component.

```typescript
// TechDocsPage.tsx
import React from 'react';
import { getMdFiles } from '@/utils/mdFilesUtils';

const TechDocsPage: React.FC = () => {
  const mdFiles = getMdFiles();
  const treeviewItems = (mdFiles.techDocs.subMenu ?? []).map(log => ({
    ...log,
    title: log.content ? getFirstHeading(log.content) : 'No title',
  }));

  return (
    <div>
      <h2>Recent TechDocs</h2>
      <SidebarNavItem sidebarNavData={treeviewItems} />
    </div>
  );
};
```

