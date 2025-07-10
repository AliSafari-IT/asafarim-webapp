---
title: "Basic Usage Example"
description: "Simple example showing basic file explorer usage"
tags: ["example", "basic", "tutorial"]
---

# Basic Usage Example

This example demonstrates the basic functionality of the md-file-explorer.

## Code

```typescript
import { MdFileExplorer } from '@asafarim/md-file-explorer'

async function basicExample() {
  const explorer = new MdFileExplorer('./documents')
  
  // Scan the entire directory
  const result = await explorer.scanDirectory()
  
  console.log(`Found ${result.totalFiles} files`)
  console.log(`Found ${result.totalFolders} folders`)
  
  // Display the file tree
  result.nodes.forEach(node => {
    console.log(`${node.type}: ${node.name}`)
  })
}

basicExample()
```

## Expected Output

```
Found 15 files
Found 3 folders
folder: images
file: readme.md
file: config.json
```
