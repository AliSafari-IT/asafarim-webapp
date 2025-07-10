---
title: "Advanced Configuration"
description: "Advanced configuration options and examples"
tags: ["advanced", "configuration", "options"]
---

# Advanced Configuration

Learn how to configure the file explorer for complex scenarios.

## Filtering Options

### File Extensions
```typescript
const explorer = new MdFileExplorer('./docs', {
  includeExtensions: ['.md', '.txt', '.json']
})
```

### Exclude Patterns
```typescript
const explorer = new MdFileExplorer('./docs', {
  excludePatterns: ['node_modules', '.git', 'temp']
})
```

## Sorting and Organization

```typescript
const explorer = new MdFileExplorer('./docs', {
  sortBy: 'date',
  sortOrder: 'desc',
  maxDepth: 3
})
```

## Metadata Parsing

```typescript
const explorer = new MdFileExplorer('./docs', {
  parseMarkdownMetadata: true
})

const result = await explorer.scanDirectory()
result.nodes.forEach(node => {
  if (node.metadata) {
    console.log(`Title: ${node.metadata.title}`)
    console.log(`Tags: ${node.metadata.tags?.join(', ')}`)
  }
})
```
