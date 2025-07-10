// Mock file tree data for browser demo
import { FileNode } from './index';

export const mockFileTree: FileNode[] = [
  {
    name: 'docs',
    path: '/docs',
    type: 'directory',
    children: [
      {
        name: 'getting-started.md',
        path: '/docs/getting-started.md',
        type: 'file',
        extension: '.md',
        size: 2048,
        lastModified: new Date('2025-01-15'),
        metadata: {
          title: 'Getting Started Guide',
          author: 'ASafariM Team',
          tags: ['guide', 'tutorial']
        }
      },
      {
        name: 'api-reference.md',
        path: '/docs/api-reference.md',
        type: 'file',
        extension: '.md',
        size: 5120,
        lastModified: new Date('2025-02-10'),
        metadata: {
          title: 'API Reference',
          author: 'ASafariM Team',
          tags: ['api', 'reference']
        }
      },
      {
        name: 'examples',
        path: '/docs/examples',
        type: 'directory',
        children: [
          {
            name: 'basic-usage.md',
            path: '/docs/examples/basic-usage.md',
            type: 'file',
            extension: '.md',
            size: 1536,
            lastModified: new Date('2025-01-20')
          },
          {
            name: 'advanced-usage.md',
            path: '/docs/examples/advanced-usage.md',
            type: 'file',
            extension: '.md',
            size: 3072,
            lastModified: new Date('2025-02-05')
          }
        ]
      }
    ]
  },
  {
    name: 'src',
    path: '/src',
    type: 'directory',
    children: [
      {
        name: 'index.ts',
        path: '/src/index.ts',
        type: 'file',
        extension: '.ts',
        size: 512,
        lastModified: new Date('2025-01-10')
      },
      {
        name: 'utils',
        path: '/src/utils',
        type: 'directory',
        children: [
          {
            name: 'helpers.ts',
            path: '/src/utils/helpers.ts',
            type: 'file',
            extension: '.ts',
            size: 768,
            lastModified: new Date('2025-01-12')
          },
          {
            name: 'constants.ts',
            path: '/src/utils/constants.ts',
            type: 'file',
            extension: '.ts',
            size: 256,
            lastModified: new Date('2025-01-08')
          }
        ]
      },
      {
        name: 'components',
        path: '/src/components',
        type: 'directory',
        children: [
          {
            name: 'Explorer.tsx',
            path: '/src/components/Explorer.tsx',
            type: 'file',
            extension: '.tsx',
            size: 4096,
            lastModified: new Date('2025-02-01')
          },
          {
            name: 'FileItem.tsx',
            path: '/src/components/FileItem.tsx',
            type: 'file',
            extension: '.tsx',
            size: 1024,
            lastModified: new Date('2025-01-25')
          }
        ]
      }
    ]
  },
  {
    name: 'package.json',
    path: '/package.json',
    type: 'file',
    extension: '.json',
    size: 1024,
    lastModified: new Date('2025-01-05')
  },
  {
    name: 'README.md',
    path: '/README.md',
    type: 'file',
    extension: '.md',
    size: 3584,
    lastModified: new Date('2025-01-01'),
    metadata: {
      title: 'MD File Explorer',
      description: 'A library for exploring markdown files in a directory structure',
      version: '1.0.0'
    }
  }
];
